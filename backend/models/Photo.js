// models/Photo.js
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename:  { type: String, required: true },
  url:       { type: String, required: true },
  tags:      [{ type: String }],
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);
