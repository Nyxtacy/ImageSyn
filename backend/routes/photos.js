// routes/photos.js
const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const Photo  = require('../models/Photo');
const auth   = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename:    (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const tags = req.body.tags ? req.body.tags.split(',') : [];
  const photo = await Photo.create({ user: req.userId, filename: req.file.filename, url, tags });
  res.json(photo);
});

// List (with pagination)
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const photos = await Photo.find({ user: req.userId })
    .sort('-createdAt')
    .skip((page-1)*limit)
    .limit(parseInt(limit));
  res.json(photos);
});

// Like / Unlike
router.post('/:id/like', auth, async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  const idx = photo.likes.indexOf(req.userId);
  if (idx === -1) photo.likes.push(req.userId);
  else photo.likes.splice(idx, 1);
  await photo.save();
  res.json(photo.likes);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo || photo.user.toString() !== req.userId)
    return res.status(404).json({ error: 'Not found' });
  await photo.deleteOne();
  res.json({ success: true });
});

module.exports = router;
