// routes/profile.js
const router = require('express').Router();
const User   = require('../models/User');
const auth   = require('../middleware/auth');

// Get profile
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// Update profile
router.put('/', auth, async (req, res) => {
  const { username, bio } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { username, bio },
    { new: true }
  ).select('-password');
  res.json(user);
});

module.exports = router;
