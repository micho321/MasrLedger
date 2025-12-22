const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
router.get('/', protect, authorize('admin'), getAllUsers);

// @route   GET /api/users/profile
// @route   PUT /api/users/profile
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

module.exports = router;
