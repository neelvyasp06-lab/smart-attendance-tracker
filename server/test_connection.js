const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
    console.log('Testing connection to:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Only wait 5s
        });
        console.log('SUCCESS: Connected to MongoDB successfully!');
        process.exit(0);
    } catch (err) {
        console.error('ERROR: Could not connect to MongoDB.');
        console.error('Reason:', err.message);
        console.log('\nTroubleshooting Tips:');
        console.log('1. Make sure MongoDB Server is installed on your system.');
        console.log('2. Check Windows Services (services.msc) and ensure "MongoDB Server" is STARTED.');
        console.log('3. Open MongoDB Compass and try to connect to: ' + process.env.MONGODB_URI);
        process.exit(1);
    }
};

testConnection();
