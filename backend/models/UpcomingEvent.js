const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  type: { type: String, enum: ['mass-hiring', 'job-fair', 'off-campus-drive'], required: true },
  date: { type: String, default: 'See details' },
  registrationLink: { type: String, required: true, unique: true },
  eligibility: String,
  location: String, // e.g. Delhi, Bangalore, Online
  description: String,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UpcomingEvent', upcomingEventSchema);
