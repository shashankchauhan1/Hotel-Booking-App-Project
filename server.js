// Import necessary packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make user info available in res.locals
app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));


// --- API Routes ---
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// --- Page Rendering Routes (Corrected to always pass user) ---

// Home Page
app.get('/', (req, res) => {
    res.render('index', { title: 'Home', user: res.locals.user });
});

// Signup Page
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up', user: res.locals.user });
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', user: res.locals.user });
});

// Logout - Handle POST from form
app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.redirect('/');
});


// All Hotels Page
app.get('/hotels', async (req, res) => {
    try {
        const { rating } = req.query;
        let filter = {};
        if (rating) {
            filter.rating = { $gte: rating };
        }
        const hotels = await Hotel.find(filter);
        res.render('hotels', { 
            title: 'All Hotels', 
            hotels, 
            query: req.query, 
            user: res.locals.user 
        });
    } catch (error) {
        res.status(500).send("Error fetching hotels");
    }
});

// Single Hotel Details Page
app.get('/hotel/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('reviews');
        const rooms = await Room.find({ hotel: req.params.id });
        if (hotel) {
            res.render('hotel-details', { 
                title: hotel.name, 
                hotel, 
                rooms, 
                user: res.locals.user 
            });
        } else {
            res.status(404).send("Hotel not found");
        }
    } catch (error) {
        res.status(500).send("Error fetching hotel details");
    }
});

// User Profile Page
app.get('/profile', (req, res) => {
    if (!res.locals.user) return res.redirect('/login');
    res.render('profile', { title: 'My Profile', user: res.locals.user });
});

// My Bookings Page
app.get('/my-bookings', async (req, res) => {
    if (!res.locals.user) return res.redirect('/login');
    try {
        const bookings = await Booking.find({ user: res.locals.user._id })
            .populate('hotel', 'name location')
            .populate('room', 'roomNumber type');
        res.render('my-bookings', { 
            title: 'My Bookings', 
            bookings, 
            user: res.locals.user 
        });
    } catch (error) {
        res.status(500).send("Error fetching bookings");
    }
});

// Show Booking Confirmation Page
app.get('/booking/:hotelId/:roomId', async (req, res) => {
    if (!res.locals.user) return res.redirect('/login');
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        const room = await Room.findById(req.params.roomId);
        res.render('booking', { 
            title: 'Confirm Booking', 
            hotel, 
            room, 
            user: res.locals.user 
        });
    } catch (error) {
        res.status(500).send("Error fetching booking details");
    }
});

// --- Admin Pages ---
app.get('/admin/new-hotel', (req, res) => {
    if (!res.locals.user || res.locals.user.role !== 'admin') return res.status(403).send("Access Denied");
    res.render('new-hotel', { title: 'Add Hotel', user: res.locals.user });
});

app.get('/admin/new-room/:hotelId', async (req, res) => {
    if (!res.locals.user || res.locals.user.role !== 'admin') return res.status(403).send("Access Denied");
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        res.render('new-room', { title: 'Add Room', hotel, user: res.locals.user });
    } catch (error) {
        res.status(500).send("Error");
    }
});


// --- Server Listening ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
