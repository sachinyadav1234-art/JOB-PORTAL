const mongoose = require('mongoose');

const verifiedJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: String,
  location: String,
  salary: String,
  jobType: { type: String, default: 'full-time' }, // full-time, internship, remote
  skills: [String],
  link: { type: String, required: true, unique: true }, // unique application link
  isVerified: { type: Boolean, default: true },
  verifiedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerifiedJob', verifiedJobSchema);
