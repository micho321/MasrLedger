const mongoose = require('mongoose');

const AccountantRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Request must belong to a user'],
    },
    topic: {
        type: String,
        required: [true, 'Please provide a topic for consultation'],
        trim: true,
        maxlength: [200, 'Topic cannot exceed 200 characters'],
    },
    preferredDate: {
        type: Date,
        required: [true, 'Please provide a preferred consultation date'],
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['pending', 'accepted', 'completed', 'rejected'],
            message: 'Status must be pending, accepted, completed, or rejected',
        },
        default: 'pending',
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    accountantResponse: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
AccountantRequestSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('AccountantRequest', AccountantRequestSchema);
