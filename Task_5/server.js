const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const Queue = require('bull');
const path = require('path');

const app = express();
const PORT = 3000;

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  legacyMode: true
});

redisClient.connect().catch(err => {
  console.error('Redis connection error:', err);
});

redisClient.on('error', err => {
  console.log('Redis error:', err);
});

const emailQueue = new Queue('email-jobs', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

const dataProcessingQueue = new Queue('data-processing', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.set('X-Request-ID', Date.now().toString());
  next();
});

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.send(JSON.parse(cachedData));
      }
    } catch (err) {
      console.log('Cache get error:', err);
    }
    
    const originalSend = res.send;
    res.send = async function(data) {
      try {
        await redisClient.setEx(cacheKey, duration, JSON.stringify(data));
      } catch (err) {
        console.log('Cache set error:', err);
      }
      return originalSend.call(this, data);
    };
    
    next();
  };
};

app.get('/api/data', cacheMiddleware(3600), (req, res) => {
  const data = {
    timestamp: new Date().toISOString(),
    users: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com' }
    ]
  };
  res.json(data);
});

app.post('/api/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const job = await emailQueue.add({ email, subject, message });
    res.json({ success: true, jobId: job.id, message: 'Email job queued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

emailQueue.process(async (job) => {
  const { email, subject, message } = job.data;
  console.log(`Processing email job ${job.id}: Sending to ${email}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Email sent to ${email}`);
  return { sent: true, email };
});

app.post('/api/process-data', async (req, res) => {
  const { dataset } = req.body;

  if (!dataset) {
    return res.status(400).json({ error: 'Dataset is required' });
  }

  try {
    const job = await dataProcessingQueue.add({ dataset, timestamp: new Date() });
    res.json({ success: true, jobId: job.id, message: 'Data processing job queued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

dataProcessingQueue.process(async (job) => {
  const { dataset } = job.data;
  console.log(`Processing data job ${job.id}`);
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const result = {
    itemCount: dataset.length,
    processedAt: new Date().toISOString()
  };
  
  console.log(`Data processing complete: ${result.itemCount} items processed`);
  return result;
});

app.get('/api/job/:jobId', async (req, res) => {
  const { jobId } = req.params;
  
  try {
    const emailJob = await emailQueue.getJob(jobId);
    if (emailJob) {
      const state = await emailJob.getState();
      return res.json({ jobId, state, type: 'email' });
    }

    const dataJob = await dataProcessingQueue.getJob(jobId);
    if (dataJob) {
      const state = await dataJob.getState();
      return res.json({ jobId, state, type: 'data-processing' });
    }

    res.status(404).json({ error: 'Job not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  const stats = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
