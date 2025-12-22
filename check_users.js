const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/masrledger');
        console.log('Connected to MongoDB');

        const users = await User.find().select('username email role');
        console.log('Found Users:');
        console.log(JSON.stringify(users, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
