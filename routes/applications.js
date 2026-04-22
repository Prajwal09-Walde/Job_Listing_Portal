const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, jobseekerOnly, employerOnly } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Apply to a job
// @access  Private (jobseeker)
router.post('/', protect, jobseekerOnly, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.user.resume,
    });

    // Update application count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    await application.populate('job', 'title company location jobType');
    await application.populate('applicant', 'name email');

    res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error applying to job' });
  }
});

// @route   GET /api/applications/my
// @desc    Get current user's applications (jobseeker)
// @access  Private (jobseeker)
router.get('/my', protect, jobseekerOnly, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'name companyName',
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw an application (jobseeker)
// @access  Private (jobseeker)
router.delete('/:id', protect, jobseekerOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Application.findByIdAndDelete(req.params.id);
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });

    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (employer)
// @access  Private (employer)
router.put('/:id/status', protect, employerOnly, async (req, res) => {
  try {
    const { status, employerNotes } = req.body;

    if (!['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify employer owns the job
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    if (employerNotes !== undefined) application.employerNotes = employerNotes;
    await application.save();

    res.json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating application status' });
  }
});

module.exports = router;
