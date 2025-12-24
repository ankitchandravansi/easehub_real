import LaundryService from '../models/LaundryService.js';

// @desc    Get all laundry services
// @route   GET /api/laundry
// @access  Public
export const getAllLaundry = async (req, res) => {
    try {
        const { pricingType } = req.query;

        let query = {};
        if (pricingType) query.pricingType = pricingType;

        const laundryServices = await LaundryService.find(query).sort('price');

        res.status(200).json({
            success: true,
            count: laundryServices.length,
            data: laundryServices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single laundry service
// @route   GET /api/laundry/:id
// @access  Public
export const getLaundryById = async (req, res) => {
    try {
        const laundryService = await LaundryService.findById(req.params.id);

        if (!laundryService) {
            return res.status(404).json({
                success: false,
                message: 'Laundry service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: laundryService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create laundry service
// @route   POST /api/laundry
// @access  Private/Admin
export const createLaundry = async (req, res) => {
    try {
        const laundryService = await LaundryService.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Laundry service created successfully',
            data: laundryService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update laundry service
// @route   PUT /api/laundry/:id
// @access  Private/Admin
export const updateLaundry = async (req, res) => {
    try {
        const laundryService = await LaundryService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!laundryService) {
            return res.status(404).json({
                success: false,
                message: 'Laundry service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Laundry service updated successfully',
            data: laundryService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete laundry service
// @route   DELETE /api/laundry/:id
// @access  Private/Admin
export const deleteLaundry = async (req, res) => {
    try {
        const laundryService = await LaundryService.findByIdAndDelete(req.params.id);

        if (!laundryService) {
            return res.status(404).json({
                success: false,
                message: 'Laundry service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Laundry service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
