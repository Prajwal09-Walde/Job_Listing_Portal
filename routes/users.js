const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'headline', 'bio', 'location', 'phone', 'website',
      'skills', 'experience', 'education',
      'companyName', 'companyDescription', 'companyWebsite', 'companySize', 'industry',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

// @route   POST /api/users/resume
// @desc    Upload resume (PDF/DOC/DOCX)
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          resume: req.file.filename,
          resumeOriginalName: req.file.originalname,
        },
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: req.file.filename,
      resumeOriginalName: req.file.originalname,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error uploading resume' });
  }
});

// @route   GET /api/users/:id
// @desc    Get public user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name headline bio location website skills experience education companyName companyDescription companyWebsite industry role createdAt'
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
