const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/authMiddleware');

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new user (Admin only)
router.post('/register', protect, admin, async (req, res) => {
    const { name, email, password, role, department, userId } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            userId: userId || `u-${Date.now()}`,
            name,
            email,
            password: password || 'password123',
            role,
            department,
            status: 'active'
        });
        res.status(201).json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            user.role = req.body.role || user.role;
            user.department = req.body.department || user.department;
            user.status = req.body.status || user.status;
            
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                userId: updatedUser.userId,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    console.log(`[BACKEND] Attempting to delete user with ID: ${req.params.id}`);
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            console.log(`[BACKEND] User ${req.params.id} deleted successfully`);
            res.json({ message: 'User removed successfully' });
        } else {
            console.warn(`[BACKEND] User NOT found: ${req.params.id}`);
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`[BACKEND] Delete Error for ${req.params.id}:`, error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
