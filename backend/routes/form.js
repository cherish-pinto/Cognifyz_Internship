const express = require('express');
const auth = require('../middleware/auth');
const FormData = require('../models/FormData');

const router = express.Router();

router.post('/submit', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const formData = new FormData({
      userId: req.userId,
      firstName,
      lastName,
      email,
      phone,
      message
    });
    
    await formData.save();
    
    res.status(201).json({
      message: 'Form submitted successfully',
      data: formData
    });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting form', error: err.message });
  }
});

router.get('/data', auth, async (req, res) => {
  try {
    const formData = await FormData.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(formData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form data', error: err.message });
  }
});

router.get('/data/:id', auth, async (req, res) => {
  try {
    const formData = await FormData.findById(req.params.id);
    
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }
    
    if (formData.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this data' });
    }
    
    res.json(formData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form data', error: err.message });
  }
});

router.delete('/data/:id', auth, async (req, res) => {
  try {
    const formData = await FormData.findById(req.params.id);
    
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }
    
    if (formData.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this data' });
    }
    
    await FormData.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Form data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting form data', error: err.message });
  }
});

module.exports = router;
