const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, employerOnly } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with search & filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword, 'i')] } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (salaryMin || salaryMax) {
      query.salaryMin = {};
      if (salaryMin) query.salaryMin.$gte = Number(salaryMin);
      if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name companyName companyLogo industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      jobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/my
// @desc    Get employer's own job listings
// @access  Private (employer)
router.get('/my', protect, employerOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name companyName companyDescription companyWebsite companyLogo industry location');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job listing
// @access  Private (employer)
router.post('/', protect, employerOnly, async (req, res) => {
  try {
    const {
      title, description, qualifications, responsibilities,
      location, jobType, experienceLevel,
      salaryMin, salaryMax, salaryCurrency,
      skills, industry, applicationDeadline,
    } = req.body;

    const employer = req.user;
    const company = employer.companyName || employer.name;

    const job = await Job.create({
      employer: employer._id,
      title,
      company,
      description,
      qualifications,
      responsibilities,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      skills,
      industry,
      applicationDeadline,
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating job' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job listing
// @access  Private (employer who owns the job)
router.put('/:id', protect, employerOnly, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });
    }

    const allowedUpdates = [
      'title', 'description', 'qualifications', 'responsibilities',
      'location', 'jobType', 'experienceLevel',
      'salaryMin', 'salaryMax', 'salaryCurrency',
      'skills', 'industry', 'applicationDeadline', 'isActive',
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    job = await Job.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });

    res.json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating job' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job listing
// @access  Private (employer who owns the job)
router.delete('/:id', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Also remove related applications
    await Application.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting job' });
  }
});

// @route   GET /api/jobs/:id/applications
// @desc    Get all applications for a job (employer only)
// @access  Private (employer)
router.get('/:id/applications', protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email headline location skills resume resumeOriginalName phone website')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
