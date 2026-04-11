const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, teacher } = require('../middleware/authMiddleware');

// Mark attendance (Teacher/Admin only)
router.post('/mark', protect, teacher, async (req, res) => {
    const { userId, date, status, classId, subject } = req.body;
    try {
        // Simple attendance marking. If record exists for same user, class, date, then update.
        const filter = { userId, date: new Date(date), classId };
        const update = { status, subject };
        const record = await Attendance.findOneAndUpdate(filter, update, { upsert: true, new: true });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk mark attendance (Teacher/Admin only)
router.post('/bulk-mark', protect, teacher, async (req, res) => {
    const { students, date, classId, subject } = req.body; // students: [{userId, status}]
    try {
        const operations = students.map(student => ({
            updateOne: {
                filter: { userId: student.userId, date: new Date(date), classId },
                update: { status: student.status, subject },
                upsert: true
            }
        }));
        await Attendance.bulkWrite(operations);
        res.json({ message: 'Attendance records updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance for a class (Teacher/Admin only)
router.get('/class/:classId', protect, teacher, async (req, res) => {
    try {
        const attendance = await Attendance.find({ classId: req.params.classId });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance for a student (Self or Teacher/Admin)
router.get('/student/:userId', protect, async (req, res) => {
    try {
        // Only allow student to see their own records, or let teachers see any student record
        if (req.user.role === 'student' && req.user.userId !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized to view other student records' });
        }
        const attendance = await Attendance.find({ userId: req.params.userId });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
