const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user and clear cookie
router.post('/logout', logoutUser);

module.exports = router;
