const Transaction = require('../models/Transaction');
const User = require('../models/User'); // Explicitly require for population
const fs = require('fs');
const path = require('path');

// Helper for persistent logging since we can't always see terminal
const logToFile = (msg) => {
    const logPath = path.join(__dirname, '../debug_log.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllTransactions = async (req, res, next) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        // More robust role check
        const userRole = req.user && req.user.role ? req.user.role.toString().toLowerCase() : '';
        const isAdmin = userRole === 'admin';

        // Build query
        const query = isAdmin ? {} : { user: req.user.id };

        const logMsg = `GET /api/transactions - User: ${req.user.username}, Role: ${req.user.role}, isAdmin: ${isAdmin}, base query: ${JSON.stringify(query)}`;
        console.log(logMsg);
        logToFile(logMsg);

        if (type) {
            query.type = type;
        }

        if (category) {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate);
            }
        }

        console.log(`Final Query: ${JSON.stringify(query)}`);
        logToFile(`Final Query: ${JSON.stringify(query)}`);

        let transactions;
        if (isAdmin) {
            transactions = await Transaction.find(query).sort({ date: -1 }).populate({
                path: 'user',
                select: 'username email'
            });
        } else {
            transactions = await Transaction.find(query).sort({ date: -1 });
        }

        const foundMsg = `Found ${transactions.length} transactions for user ${req.user.username}`;
        console.log(foundMsg);
        logToFile(foundMsg);

        res.status(200).json({
            success: true,
            count: transactions.length,
            debug_info: { role: req.user.role, isAdmin, query_used: query },
            data: transactions,
        });
    } catch (error) {
        const errMsg = `ERROR in getAllTransactions: ${error.message}`;
        console.error(errMsg);
        logToFile(errMsg);
        next(error);
    }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this transaction',
            });
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this transaction',
            });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this transaction',
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
