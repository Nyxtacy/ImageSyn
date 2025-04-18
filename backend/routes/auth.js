// routes/auth.js
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Manual validation before attempting to create user
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one number' });
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one special character (@$!%*?&)' });
    }
    
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;