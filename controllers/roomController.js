const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

// @desc    Add a room to a hotel
// @route   POST /api/rooms/hotel/:hotelId
const addRoomToHotel = async (req, res) => {
    try {
        const { roomNumber, type, price, images } = req.body;
        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const room = new Room({
            hotel: req.params.hotelId,
            roomNumber,
            type,
            price,
            images
        });

        const createdRoom = await room.save();
        res.status(201).json(createdRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all rooms for a hotel
// @route   GET /api/rooms/hotel/:hotelId
const getRoomsByHotel = async (req, res) => {
    try {
        const rooms = await Room.find({ hotel: req.params.hotelId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
const updateRoom = async (req, res) => {
    try {
        const { roomNumber, type, price, images, isAvailable } = req.body;
        const room = await Room.findById(req.params.id);

        if (room) {
            room.roomNumber = roomNumber || room.roomNumber;
            room.type = type || room.type;
            room.price = price || room.price;
            room.images = images || room.images;
            room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;

            const updatedRoom = await room.save();
            res.json(updatedRoom);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            await room.deleteOne();
            res.json({ message: 'Room removed' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addRoomToHotel, getRoomsByHotel, updateRoom, deleteRoom };
