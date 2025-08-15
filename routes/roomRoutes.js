const express = require('express');
const router = express.Router();
const {
    addRoomToHotel,
    getRoomsByHotel,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/rooms/hotel/:hotelId
// @desc    Add a room to a hotel (Admin only)
router.post('/hotel/:hotelId', protect, admin, addRoomToHotel);

// @route   GET /api/rooms/hotel/:hotelId
// @desc    Get all rooms for a specific hotel (Public)
router.get('/hotel/:hotelId', getRoomsByHotel);

// @route   PUT /api/rooms/:id
// @desc    Update a room's details (Admin only)
router.put('/:id', protect, admin, updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete a room (Admin only)
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
