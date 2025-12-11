const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// @route   POST /api/transactions
// @route   GET /api/transactions
router.route('/')
    .post(protect, createTransaction)
    .get(protect, getAllTransactions);

// @route   GET /api/transactions/:id
// @route   PUT /api/transactions/:id
// @route   DELETE /api/transactions/:id
router.route('/:id')
    .get(protect, getTransactionById)
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
