const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    classId: { type: String, unique: true }, // custom class identifier e.g. 'c1'
    name: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    teacherId: { type: String, required: true }, // References custom user.userId or _id. For simplicity we'll use userId string first.
    studentIds: [{ type: String }] // Array of custom userId strings.
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
