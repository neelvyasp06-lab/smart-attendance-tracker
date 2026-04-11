const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // custom user Id
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    classId: { type: String, required: true }, // custom class Id
    subject: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
