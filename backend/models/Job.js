const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  salary: String,
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'remote'],
    default: 'full-time'
  },
  skills: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);