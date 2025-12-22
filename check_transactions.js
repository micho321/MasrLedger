const mongoose = require('mongoose');
const User = require('./models/User'); // Load User model
const Transaction = require('./models/Transaction'); // Load Transaction model
require('dotenv').config();

const checkTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/masrledger');
        console.log('Connected to MongoDB');

        const transactions = await Transaction.find().populate('user', 'username email');
        console.log(`Found ${transactions.length} Transactions:`);
        console.log(JSON.stringify(transactions, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
};

checkTransactions();
