const Job = require('../models/Job');

const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType, skills } = req.body;
    const job = await Job.create({
      title, description, company, location, salary, jobType, skills,
      postedBy: req.user.id
    });
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (jobType) {
      query.jobType = jobType;
    }

    if (keyword && keyword.trim()) {
      const words = keyword.trim().split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        // Try strict $and match across all keywords first
        const andQueries = words.map(word => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { company: { $regex: word, $options: 'i' } },
            { skills: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } }
          ]
        }));

        const andQuery = { ...query, $and: andQueries };
        let jobs = await Job.find(andQuery)
          .populate('postedBy', 'name email')
          .sort({ createdAt: -1 });

        if (jobs.length > 0) {
          return res.json({ success: true, count: jobs.length, jobs });
        }

        // Fallback to flexible $or match if strict match yields zero results
        const orQueries = words.map(word => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { company: { $regex: word, $options: 'i' } },
            { skills: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } }
          ]
        }));

        const orQuery = { ...query, $or: orQueries };
        jobs = await Job.find(orQuery)
          .populate('postedBy', 'name email')
          .sort({ createdAt: -1 });

        return res.json({ success: true, count: jobs.length, jobs });
      }
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    // Cascade delete all associated applications
    const Application = require('../models/Application');
    await Application.deleteMany({ job: req.params.id });

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs };