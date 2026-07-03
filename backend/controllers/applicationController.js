const Application = require('../models/Application');
const Job = require('../models/Job');

// ─────────────────────────────────────
// @route   POST /api/applications/:jobId
// @access  Private (student only)
// ─────────────────────────────────────
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied for this job
    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user.id,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json({ success: true, application });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   GET /api/applications/myapplications
// @access  Private (student)
// ─────────────────────────────────────
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location salary jobType')
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, applications });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiter/admin)
// ─────────────────────────────────────
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Restrict access to the recruiter who posted the job or an admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills resume')
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, applications });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   PUT /api/applications/:id/status
// @access  Private (recruiter/admin)
// ─────────────────────────────────────
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────
// @route   DELETE /api/applications/:id
// @access  Private (student - withdraw application)
// ─────────────────────────────────────
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await application.deleteOne();

    res.json({ success: true, message: 'Application withdrawn successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication
};