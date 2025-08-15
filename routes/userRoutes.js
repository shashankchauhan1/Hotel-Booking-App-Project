const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/profile
// @desc    Get user profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;
