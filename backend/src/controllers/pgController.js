import PGHostel from "../models/PGHostel.js";

// @desc    Get all PGs
// @route   GET /api/pgs
// @access  Public
export const getAllPGs = async (req, res) => {
    try {
        console.log('[PG API] Fetching all PGs from database...');

        // Optimized query with lean() for better performance
        const pgs = await PGHostel.find()
            .lean() // Returns plain JS objects instead of Mongoose documents
            .sort("-createdAt")
            .limit(100); // Limit to prevent large payloads

        console.log(`[PG API] Found ${pgs.length} PGs in database`);

        res.status(200).json({
            success: true,
            count: pgs.length,
            data: pgs,
        });

        console.log(`[PG API] Response sent: ${pgs.length} PGs`);
    } catch (error) {
        console.error('[PG API] Error fetching PGs:', error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch PG listings",
            error: error.message,
        });
    }
};

// @desc    Get single PG
// @route   GET /api/pgs/:id
// @access  Public
export const getPGById = async (req, res) => {
    try {
        const pg = await PGHostel.findById(req.params.id);

        if (!pg) {
            return res.status(404).json({
                success: false,
                message: "PG not found",
            });
        }

        res.status(200).json({
            success: true,
            data: pg,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create PG (admin only)
// @route   POST /api/pgs
// @access  Private/Admin
export const createPG = async (req, res) => {
    try {
        const pg = await PGHostel.create(req.body);

        res.status(201).json({
            success: true,
            message: "PG created successfully",
            data: pg,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update PG (admin only)
// @route   PUT /api/pgs/:id
// @access  Private/Admin
export const updatePG = async (req, res) => {
    try {
        const pg = await PGHostel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!pg) {
            return res.status(404).json({
                success: false,
                message: "PG not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "PG updated successfully",
            data: pg,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete PG (admin only)
// @route   DELETE /api/pgs/:id
// @access  Private/Admin
export const deletePG = async (req, res) => {
    try {
        const pg = await PGHostel.findById(req.params.id);

        if (!pg) {
            return res.status(404).json({
                success: false,
                message: "PG not found",
            });
        }

        await pg.deleteOne();

        res.status(200).json({
            success: true,
            message: "PG deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
