import ServiceRequest from '../models/ServiceRequest.js';

// @desc    Create service request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
    try {
        const { serviceType, serviceId, requestDetails, attachments } = req.body;

        // Determine service model based on type
        let serviceModel = null;
        if (serviceType === 'pg') serviceModel = 'PGHostel';
        else if (serviceType === 'meal') serviceModel = 'MealPlan';
        else if (serviceType === 'laundry') serviceModel = 'LaundryService';

        const request = await ServiceRequest.create({
            user: req.user._id,
            serviceType,
            serviceId: serviceId || null,
            serviceModel,
            requestDetails,
            attachments: attachments || []
        });

        res.status(201).json({
            success: true,
            message: 'Service request created successfully',
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's requests
// @route   GET /api/requests
// @access  Private
export const getMyRequests = async (req, res) => {
    try {
        const { status } = req.query;

        let query = { user: req.user._id };
        if (status) query.status = status;

        const requests = await ServiceRequest.find(query)
            .populate('serviceId')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id)
            .populate('serviceId');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if user owns this request or is admin
        if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this request'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
export const updateRequestStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        request.status = status;
        if (adminNotes) request.adminNotes = adminNotes;
        if (status === 'completed') request.completedAt = Date.now();

        await request.save();

        res.status(200).json({
            success: true,
            message: 'Request status updated successfully',
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all requests (Admin)
// @route   GET /api/admin/requests
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
    try {
        const { status, serviceType } = req.query;

        let query = {};
        if (status) query.status = status;
        if (serviceType) query.serviceType = serviceType;

        const requests = await ServiceRequest.find(query)
            .populate('serviceId')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
