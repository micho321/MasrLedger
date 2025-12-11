const express = require('express');
const router = express.Router();
const {
    createRequest,
    getUserRequests,
    getAllRequests,
    updateRequestStatus,
    getRequestById,
} = require('../controllers/accountantController');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/accountant/requests
// @route   GET /api/accountant/requests
router.route('/requests')
    .post(protect, createRequest)
    .get(protect, getUserRequests);

// @route   GET /api/accountant/requests/all
router.get('/requests/all', protect, authorize('accountant', 'admin'), getAllRequests);

// @route   GET /api/accountant/requests/:id
// @route   PUT /api/accountant/requests/:id
router.route('/requests/:id')
    .get(protect, getRequestById)
    .put(protect, updateRequestStatus);

module.exports = router;
