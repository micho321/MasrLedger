const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Transaction must belong to a user'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0, 'Amount cannot be negative'],
    },
    type: {
        type: String,
        required: [true, 'Please specify transaction type'],
        enum: {
            values: ['income', 'expense'],
            message: 'Type must be either income or expense',
        },
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Please provide a transaction date'],
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Index for faster queries
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
