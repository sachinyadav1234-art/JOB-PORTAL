const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Private routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/recruiter/myjobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);


module.exports = router;