export const users = [
    { id: "admin-1", name: "Anika Patel", email: "admin@company.com", role: "admin", department: "Administration", status: "active" },
    
    // Faculty (Teachers)
    { id: "t-awt", name: "Charmy Vora", email: "charmy@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { id: "t-os", name: "Pranav Tank", email: "pranav@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { id: "t-cn", name: "Chirag Bhalodiya", email: "chirag@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { id: "t-coa", name: "Dhara Joshi", email: "dhara@faculty.com", role: "teacher", department: "Computer Engineering", status: "active" },
    { id: "t-dm", name: "Khanjan Trivedi", email: "khanjan@faculty.com", role: "teacher", department: "Mathematics", status: "active" },
    { id: "t-qla", name: "Ronak Doshi", email: "ronak@faculty.com", role: "teacher", department: "Aptitude", status: "active" },
    
    // 4EV4 Students (Enrollment 1-10)
    { id: "1", name: "Neel Vyas", email: "neel@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "2", name: "Vivek Dhedhi", email: "vivek@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "3", name: "Harsh Kanjariya", email: "harsh@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "4", name: "Arun Busa", email: "arun@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "5", name: "Rajveersinh Dodiya", email: "rajveer@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "6", name: "Anik Das", email: "anik@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "7", name: "Vishwaraj Jadeja", email: "vishwaraj@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "8", name: "Jeet", email: "jeet@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "9", name: "Tarvish", email: "tarvish@student.com", role: "student", department: "4EV4", status: "active" },
    { id: "10", name: "Mann", email: "mann@student.com", role: "student", department: "4EV4", status: "active" },
    
    // 4EV3 Students (11-15)
    { id: "11", name: "Aryan Patel", email: "aryan@student.com", role: "student", department: "4EV3", status: "active" },
    { id: "12", name: "Isha Shah", email: "isha@student.com", role: "student", department: "4EV3", status: "active" },
    { id: "13", name: "Ryan Gupta", email: "ryan@student.com", role: "student", department: "4EV3", status: "active" },
    
    // 4EV2 Students
    { id: "16", name: "Rohan Sharma", email: "rohan@student.com", role: "student", department: "4EV2", status: "active" },
    
    // 4EV1 Students
    { id: "21", name: "Aditya Rao", email: "aditya@student.com", role: "student", department: "4EV1", status: "active" },
];

export const classes = [
    { id: "c1", name: "4EV4 - AWT", section: "4EV4", subject: "AWT (Advance Web Technology)", teacherId: "t-awt", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { id: "c2", name: "4EV4 - CN", section: "4EV4", subject: "CN (Computer networking)", teacherId: "t-cn", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    { id: "c3", name: "4EV3 - OS", section: "4EV3", subject: "OS (Operating System)", teacherId: "t-os", studentIds: ["11", "12", "13"] },
    { id: "c4", name: "4EV2 - COA", section: "4EV2", subject: "COA (Computer Organization and Architecture)", teacherId: "t-coa", studentIds: ["16"] },
    { id: "c5", name: "4EV1 - DM", section: "4EV1", subject: "DM (Discrete Mathematics)", teacherId: "t-dm", studentIds: ["21"] },
    { id: "c6", name: "4EV4 - QLA-2", section: "4EV4", subject: "QLA (Quantitative & Logical ability-2)", teacherId: "t-qla", studentIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
];

export const attendanceRecords = [
    // Today's records (2026-03-22)
    { userId: "1", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "2", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "3", date: "2026-03-22", status: "absent", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "4", date: "2026-03-22", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    
    { userId: "1", date: "2026-03-22", status: "present", classId: "c1", subject: "AWT (Advance Web Technology)" },
    { userId: "2", date: "2026-03-22", status: "present", classId: "c1", subject: "AWT (Advance Web Technology)" },
    { userId: "3", date: "2026-03-22", status: "absent", classId: "c1", subject: "AWT (Advance Web Technology)" },
    
    // Previous days (2026-03-21)
    { userId: "1", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "2", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    { userId: "3", date: "2026-03-21", status: "present", classId: "c2", subject: "CN (Computer networking)" },
    
    { userId: "11", date: "2026-03-22", status: "present", classId: "c3", subject: "OS (Operating System)" },
    { userId: "12", date: "2026-03-22", status: "absent", classId: "c3", subject: "OS (Operating System)" },
];

export const weeklyAttendance = [
    { day: "Mon", present: 85, absent: 5, late: 2 },
    { day: "Tue", present: 88, absent: 2, late: 1 },
    { day: "Wed", present: 82, absent: 6, late: 3 },
    { day: "Thu", present: 46, absent: 4, late: 1 },
    { day: "Fri", present: 40, absent: 8, late: 4 },
];

export const departmentAttendance = [
    { department: "4EV4", attendance: 92 },
    { department: "4EV3", attendance: 85 },
    { department: "4EV2", attendance: 88 },
    { department: "4EV1", attendance: 90 },
];

export const recentActivity = [
    { id: "1", user: "Chirag Bhalodiya", action: "Marked attendance for 4EV4 - CN", time: "just now", type: "success" },
    { id: "2", user: "Charmy Vora", action: "Updated 4EV4 - AWT records", time: "15 min ago", type: "info" },
];

export const notifications = [
    { id: "1", title: "Attendance Milestone", message: "4EV4 reached 95% attendance today!", time: "3 min ago", read: false, type: "success" },
];
