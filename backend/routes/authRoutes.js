const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../middleware/uploadMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.put('/upload-resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const url = await uploadToCloudinary(req.file.buffer);

    await User.findByIdAndUpdate(req.user.id, { resume: url });

    res.json({ success: true, message: 'Resume uploaded', resumeUrl: url });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;