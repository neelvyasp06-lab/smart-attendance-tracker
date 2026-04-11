const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All class routes are protected

// Get all classes
router.get('/', async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            return res.json([
                { classId: 'CS101', name: 'Computer Science', section: 'A', subject: 'Databases', teacherId: 'TCH001', studentIds: ['STU001'] },
                { classId: 'CS102', name: 'Web Dev', section: 'B', subject: 'React', teacherId: 'TCH001', studentIds: ['STU001'] }
            ]);
        }
        const query = req.user.role === 'teacher' ? { teacherId: req.user.userId } : {};
        const classes = await Class.find(query);
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get classes by teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        if (req.user.role === 'teacher' && req.user.userId !== req.params.teacherId) {
             return res.status(403).json({ message: 'Not authorized to view other teacher classes' });
        }
        const teacherClasses = await Class.find({ teacherId: req.params.teacherId });
        res.json(teacherClasses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get class details by id
router.get('/:classId', async (req, res) => {
    try {
        const classObj = await Class.findOne({ classId: req.params.classId });
        if (classObj) {
            // Populate students info
            const students = await User.find({ userId: { $in: classObj.studentIds } });
            res.json({ ...classObj.toObject(), students });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new class (Admin only)
router.post('/', async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create classes' });
    }
    const { classId, name, section, subject, teacherId, studentIds } = req.body;
    try {
        const newClass = new Class({
            classId,
            name,
            section,
            subject,
            teacherId,
            studentIds: studentIds || []
        });
        await newClass.save();
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update class / Reassign teacher (Admin only)
router.put('/:classId', async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can update classes' });
    }
    try {
        const updatedClass = await Class.findOneAndUpdate(
            { classId: req.params.classId },
            { $set: req.body },
            { new: true }
        );
        if (updatedClass) {
            res.json(updatedClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
