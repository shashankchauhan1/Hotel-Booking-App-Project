const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { hotel, room, checkInDate, checkOutDate, totalPrice } = req.body;
        
        // Check if the room is available
        const roomToBook = await Room.findById(room);
        if (!roomToBook || !roomToBook.isAvailable) {
            return res.status(400).json({ message: 'Room is not available for booking' });
        }

        const booking = new Booking({
            user: req.user._id,
            hotel,
            room,
            checkInDate,
            checkOutDate,
            totalPrice
        });

        const createdBooking = await booking.save();
        
        // Mark the room as unavailable
        roomToBook.isAvailable = false;
        await roomToBook.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('hotel', 'name location')
            .populate('room', 'roomNumber type');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            // Check if the user owns the booking
            if (booking.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            booking.status = 'cancelled';
            
            // Make the room available again
            const room = await Room.findById(booking.room);
            if (room) {
                room.isAvailable = true;
                await room.save();
            }

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking };
