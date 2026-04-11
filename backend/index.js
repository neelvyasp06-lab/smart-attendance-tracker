const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database (don't await so server starts immediately)
connectDB().catch(err => console.error("Immediate DB Error:", err));

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allows all origins, including your Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


// Health Check for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// Support for non-prefixed routes (if Vercel rewrite strips /api)
app.use('/auth', require('./routes/authRoutes'));
app.use('/classes', require('./routes/classRoutes'));
app.use('/attendance', require('./routes/attendanceRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Smart Attendance Tracker API is running...', mode: 'production' });
});

// Final 404 Handler - MUST RETURN JSON, NOT HTML
app.use((req, res) => {
    console.error(`[404] Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: 'Route not found on Backend', 
        path: req.url,
        method: req.method 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is officially listening on port ${PORT}`);
}).on('error', (err) => {
    console.error("Critical Server Error:", err.message);
});

// Keep-alive to prevent process exit in some environments
setInterval(() => {}, 1000 * 60 * 60);
