const AccountantRequest = require('../models/AccountantRequest');

// @desc    Create accountant consultation request
// @route   POST /api/accountant/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const request = await AccountantRequest.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Consultation request created successfully',
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all requests for logged-in user
// @route   GET /api/accountant/requests
// @access  Private
exports.getUserRequests = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = { user: req.user.id };
        if (status) {
            query.status = status;
        }

        const requests = await AccountantRequest.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'username email');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all requests (for accountants/admins)
// @route   GET /api/accountant/requests/all
// @access  Private (accountant, admin)
exports.getAllRequests = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }

        const requests = await AccountantRequest.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'username email businessType');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update request status
// @route   PUT /api/accountant/requests/:id
// @access  Private
exports.updateRequestStatus = async (req, res, next) => {
    try {
        let request = await AccountantRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found',
            });
        }

        // Users can only update their own requests
        // Accountants/admins can update any request
        if (
            request.user.toString() !== req.user.id &&
            !['accountant', 'admin'].includes(req.user.role)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this request',
            });
        }

        const { status, accountantResponse, notes } = req.body;

        const fieldsToUpdate = {};
        if (status) fieldsToUpdate.status = status;
        if (accountantResponse) fieldsToUpdate.accountantResponse = accountantResponse;
        if (notes) fieldsToUpdate.notes = notes;

        request = await AccountantRequest.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true,
            }
        ).populate('user', 'username email');

        res.status(200).json({
            success: true,
            message: 'Request updated successfully',
            data: request,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single request
// @route   GET /api/accountant/requests/:id
// @access  Private
exports.getRequestById = async (req, res, next) => {
    try {
        const request = await AccountantRequest.findById(req.params.id)
            .populate('user', 'username email businessType');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found',
            });
        }

        // Users can only view their own requests
        // Accountants/admins can view any request
        if (
            request.user._id.toString() !== req.user.id &&
            !['accountant', 'admin'].includes(req.user.role)
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this request',
            });
        }

        res.status(200).json({
            success: true,
            data: request,
        });
    } catch (error) {
        next(error);
    }
};
