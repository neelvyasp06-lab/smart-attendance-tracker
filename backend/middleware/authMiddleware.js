const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            
            // Check if it's the static bypass ID
            if (decoded.id === 'static-id') {
                req.user = {
                    _id: 'static-id',
                    userId: 'STATIC-USR', 
                    role: decoded.role || 'admin',
                    name: 'Static User'
                };
                return next();
            }

            // Real user check - but only if DB is up
            if (mongoose.connection.readyState === 1) {
                req.user = await User.findById(decoded.id).select('-password');
            } else {
                console.warn('[AUTH] DB Disconnected. Using fallback for decoded token.');
                req.user = {
                    _id: decoded.id,
                    userId: 'FALLBACK-USR',
                    role: decoded.role,
                    name: 'Fallback User'
                };
            }
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            return next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const teacher = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a teacher' });
    }
};

module.exports = { protect, admin, teacher };
