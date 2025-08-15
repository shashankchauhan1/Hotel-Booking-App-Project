const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomNumber: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true, // e.g., 'Single', 'Double', 'Suite'
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String // Array of image URLs
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
