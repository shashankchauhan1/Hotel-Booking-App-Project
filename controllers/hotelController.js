const Hotel = require('../models/Hotel');
const Review = require('../models/Review');

// @desc    Create a new hotel
// @route   POST /api/hotels
const createHotel = async (req, res) => {
    try {
        // Added 'rating' to the destructured request body
        const { name, location, description, images, rating } = req.body;
        const hotel = new Hotel({
            name,
            location,
            description,
            images,
            rating, // Added the rating to the new Hotel object
            owner: req.user._id // The logged-in admin
        });
        const createdHotel = await hotel.save();
        res.status(201).json(createdHotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all hotels, with optional rating filter
// @route   GET /api/hotels
const getAllHotels = async (req, res) => {
    try {
        const { rating } = req.query;
        let filter = {};
        if (rating) {
            // Filter for hotels with a rating greater than or equal to the query
            filter.rating = { $gte: rating };
        }
        const hotels = await Hotel.find(filter).populate('reviews');
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single hotel by ID
// @route   GET /api/hotels/:id
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('reviews');
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
const updateHotel = async (req, res) => {
    try {
        const { name, location, description, images } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (hotel) {
            hotel.name = name || hotel.name;
            hotel.location = location || hotel.location;
            hotel.description = description || hotel.description;
            hotel.images = images || hotel.images;
            
            const updatedHotel = await hotel.save();
            res.json(updatedHotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) {
            await hotel.deleteOne();
            res.json({ message: 'Hotel removed' });
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review to a hotel
// @route   POST /api/hotels/:id/reviews
const addHotelReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (hotel) {
            const review = new Review({
                user: req.user._id,
                hotel: req.params.id,
                rating,
                comment
            });

            await review.save();
            hotel.reviews.push(review);

            // Update the hotel's average rating
            const reviews = await Review.find({ hotel: req.params.id });
            hotel.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            
            await hotel.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel, addHotelReview };
