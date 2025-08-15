const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/bookings
// @desc    Create a new booking (Logged-in users only)
router.post('/', protect, createBooking);

// @route   GET /api/bookings/mybookings
// @desc    Get all bookings for the logged-in user
router.get('/mybookings', protect, getUserBookings);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking (User who booked it only)
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
