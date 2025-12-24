import MealPlan from '../models/MealPlan.js';

// @desc    Get all meal plans
// @route   GET /api/meals
// @access  Public
export const getAllMeals = async (req, res) => {
    try {
        const { planType, category } = req.query;

        let query = {};
        if (planType) query.planType = planType;
        if (category) query.category = category;

        const mealPlans = await MealPlan.find(query).sort('price');

        res.status(200).json({
            success: true,
            count: mealPlans.length,
            data: mealPlans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single meal plan
// @route   GET /api/meals/:id
// @access  Public
export const getMealById = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        res.status(200).json({
            success: true,
            data: mealPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create meal plan
// @route   POST /api/meals
// @access  Private/Admin
export const createMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Meal plan created successfully',
            data: mealPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update meal plan
// @route   PUT /api/meals/:id
// @access  Private/Admin
export const updateMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Meal plan updated successfully',
            data: mealPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete meal plan
// @route   DELETE /api/meals/:id
// @access  Private/Admin
export const deleteMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Meal plan deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
