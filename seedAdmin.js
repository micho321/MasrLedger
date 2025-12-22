const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./models/User');
// fallback if .env is not in root or not picked up automatically by plain config()

// Also check MONGODB_URI vs MONGO_URI
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    console.error("FATAL: MONGODB_URI not found in environment variables");
    process.exit(1);
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected for Seeding...');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        // Check if exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user exists. Updating credentials...');
            user.password = adminPassword;
            user.role = 'admin';
            user.username = 'Admin';
            await user.save();
        } else {
            console.log('Creating new admin user...');
            user = await User.create({
                username: 'Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                businessType: 'other'
            });
        }

        console.log('Admin Credentials Set:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedAdmin();
