const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

dotenv.config();

const users = [
    { userId: "admin-1", name: "Anika Patel", email: "admin@company.com", role: "admin", department: "Administration", status: "active" },
    { userId: "t-awt", name: "Charmy Vora", email: "charmy@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { userId: "t-os", name: "Pranav Tank", email: "pranav@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { userId: "t-cn", name: "Chirag Bhalodiya", email: "chirag@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { userId: "t-coa", name: "Dhara Joshi", email: "dhara@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { userId: "t-dm", name: "Khanjan Trivedi", email: "khanjan@faculty.com", role: "teacher", department: "Mathematics", status: "active" },
    { userId: "t-qla", name: "Ronak Doshi", email: "ronak@faculty.com", role: "teacher", department: "Aptitude", status: "active" },
    { userId: "1", name: "Neel Vyas", email: "neel@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "2", name: "Vivek Dhedhi", email: "vivek@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "3", name: "Harsh Kanjariya", email: "harsh@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "4", name: "Arun Busa", email: "arun@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "5", name: "Rajveersinh Dodiya", email: "rajveer@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "6", name: "Anik Das", email: "anik@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "7", name: "Vishwaraj Jadeja", email: "vishwaraj@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "8", name: "Jeet", email: "jeet@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "9", name: "Tarvish", email: "tarvish@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "10", name: "Mann", email: "mann@student.com", role: "student", department: "4EV4", status: "active" },
    { userId: "11", name: "Aryan Patel", email: "aryan@student.com", role: "student", department: "4EV3", status: "active" },
    { userId: "12", name: "Isha Shah", email: "isha@student.com", role: "student", department: "4EV3", status: "active" },
    { userId: "13", name: "Ryan Gupta", email: "ryan@student.com", role: "student", department: "4EV3", status: "active" },
    { userId: "16", name: "Rohan Sharma", email: "rohan@student.com", role: "student", department: "4EV2", status: "active" },
    { userId: "21", name: "Aditya Rao", email: "aditya@student.com", role: "student", department: "4EV1", status: "active" },
];

const classes = [
    { classId: "c1", name: "4EV4 - AWT", section: "4EV4", subject: "AWT (Advance Web Technology)", teacherId: "t-awt", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { classId: "c2", name: "4EV4 - CN", section: "4EV4", subject: "CN (Computer networking)", teacherId: "t-cn", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { classId: "c3", name: "4EV3 - OS", section: "4EV3", subject: "OS (Operating System)", teacherId: "t-os", studentIds: ["11", "12", "13"] },
    { classId: "c4", name: "4EV2 - COA", section: "4EV2", subject: "COA (Computer Organization and Architecture)", teacherId: "t-coa", studentIds: ["16"] },
    { classId: "c5", name: "4EV1 - DM", section: "4EV1", subject: "DM (Discrete Mathematics)", teacherId: "t-dm", studentIds: ["21"] },
    { classId: "c6", name: "4EV4 - QLA-2", section: "4EV4", subject: "QLA (Quantitative & Logical ability-2)", teacherId: "t-qla", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
];

const attendanceRecords = [
    { userId: "1", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "2", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "3", date: "2026-03-22", status: "absent", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "4", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "1", date: "2026-03-22", status: "present", classId: "c1", subject: "AWT (Advance Web Technology)" },
    { userId: "2", date: "2026-03-22", status: "present", classId: "c1", subject: "AWT (Advance Web Technology)" },
    { userId: "3", date: "2026-03-22", status: "absent", classId: "c1", subject: "AWT (Advance Web Technology)" },
    { userId: "1", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "2", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "3", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "11", date: "2026-03-22", status: "present", classId: "c3", subject: "OS (Operating System)" },
    { userId: "12", date: "2026-03-22", status: "absent", classId: "c3", subject: "OS (Operating System)" },
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Class.deleteMany({});
        await Attendance.deleteMany({});

        console.log('Inserting users individually...');
        for (const userData of users) {
             const user = new User({ ...userData, password: 'password123' });
             await user.save();
             console.log(`Saved user: ${user.email}`);
        }
        
        console.log('Inserting classes...');
        await Class.insertMany(classes);
        
        const attendance = attendanceRecords.map(rec => ({
            ...rec,
            date: new Date(rec.date)
        }));
        await Attendance.insertMany(attendance);

        console.log('Database Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit();
    }
};

seedDB();
