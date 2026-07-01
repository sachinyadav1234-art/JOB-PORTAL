const express = require('express');
const router = express.Router();
const {
  searchRealJobs,
  matchJobs,
  getVerifiedFresherJobs,
  getJobFairsAndMassHiring,
  reviewResume,
  generateMockInterview,
  gradeMockInterview
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/search-jobs', protect, authorize('student'), searchRealJobs);
router.get('/match-jobs', protect, authorize('student'), matchJobs);
router.get('/verified-fresher-jobs', protect, authorize('student'), getVerifiedFresherJobs);
router.get('/job-fairs-mass-hiring', protect, authorize('student'), getJobFairsAndMassHiring);
router.post('/review-resume', protect, authorize('student'), reviewResume);
router.post('/mock-interview/generate', protect, authorize('student'), generateMockInterview);
router.post('/mock-interview/grade', protect, authorize('student'), gradeMockInterview);

module.exports = router;