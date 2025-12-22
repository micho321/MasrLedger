const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdminRole = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/masrledger');
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('Admin User Found:');
            console.log(`Username: ${admin.username}`);
            console.log(`Email: ${admin.email}`);
            console.log(`Role: "${admin.role}" (Type: ${typeof admin.role})`);
        } else {
            console.log('Admin user not found!');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
};

checkAdminRole();
