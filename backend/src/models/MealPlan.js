import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Plan name is required'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    planType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    category: {
        type: String,
        enum: ['veg', 'non-veg', 'both'],
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    meals: {
        breakfast: {
            type: Boolean,
            default: false
        },
        lunch: {
            type: Boolean,
            default: false
        },
        dinner: {
            type: Boolean,
            default: false
        }
    },
    features: [{
        type: String
    }],
    availability: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
