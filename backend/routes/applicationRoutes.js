const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student routes
router.post('/:jobId', protect, authorize('student'), applyJob);
router.get('/myapplications', protect, authorize('student'), getMyApplications);
router.delete('/:id', protect, authorize('student'), withdrawApplication);

// Recruiter/Admin routes
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;