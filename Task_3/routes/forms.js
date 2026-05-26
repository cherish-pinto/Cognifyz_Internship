const express = require('express');
const jwt = require('jsonwebtoken');
const Form = require('../models/Form');

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const form = new Form({
      userId: req.userId,
      name,
      email,
      message
    });

    await form.save();
    res.status(201).json({ message: 'Form submitted successfully', form });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-submissions', authenticateToken, async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:formId', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Form.findByIdAndDelete(req.params.formId);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
