const express = require('express');
const router = express.Router();
const {
    getMonthlySummary,
    getTaxEstimate,
} = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

// @route   GET /api/summary/monthly
router.get('/monthly', protect, getMonthlySummary);

// @route   GET /api/summary/tax
router.get('/tax', protect, getTaxEstimate);

module.exports = router;
