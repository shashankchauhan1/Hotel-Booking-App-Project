const express = require('express');
const router = express.Router();
const {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    addHotelReview
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/hotels
// @desc    Get all hotels (public)
router.get('/', getAllHotels);

// @route   GET /api/hotels/:id
// @desc    Get a single hotel by ID (public)
router.get('/:id', getHotelById);

// @route   POST /api/hotels
// @desc    Create a new hotel (Admin only)
router.post('/', protect, admin, createHotel);

// @route   PUT /api/hotels/:id
// @desc    Update a hotel (Admin only)
router.put('/:id', protect, admin, updateHotel);

// @route   DELETE /api/hotels/:id
// @desc    Delete a hotel (Admin only)
router.delete('/:id', protect, admin, deleteHotel);

// @route   POST /api/hotels/:id/reviews
// @desc    Add a review to a hotel (Logged-in users only)
router.post('/:id/reviews', protect, addHotelReview);


module.exports = router;
