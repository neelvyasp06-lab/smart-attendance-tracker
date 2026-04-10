const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = (process.env.MONGODB_URI || "").trim();
        console.log(`[DB] Connecting to URI length: ${uri.length}`);
        if (!uri) {
            throw new Error("MONGODB_URI is missing in .env");
        }
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('⚠️ Server continuing in Static Mode (No Database)...');
        console.log('💡 TIP: Check if your IP is whitelisted in MongoDB Atlas under "Network Access".');
    }
};

module.exports = connectDB;
