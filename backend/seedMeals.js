import mongoose from "mongoose";
import MealPlan from "./src/models/MealPlan.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://easehub:HuxhX0HaI535XyqF@cluster0.f6xugmd.mongodb.net/easehub?retryWrites=true&w=majority";

const mealData = [
    {
        planName: 'Basic Plan',
        description: 'Essential meals for students on a budget',
        category: 'veg',
        planType: 'monthly',
        price: 3500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['2 meals per day', 'Home-style cooking', 'Unlimited rice & roti', 'Weekly menu rotation']
    },
    {
        planName: 'Standard Plan',
        description: 'Complete nutrition with variety',
        category: 'veg',
        planType: 'monthly',
        price: 4500,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['3 meals per day', 'Fresh vegetables', 'Weekly special dishes', 'Customizable menu', 'Free delivery']
    },
    {
        planName: 'Premium Plan',
        description: 'Gourmet meals with premium ingredients',
        category: 'both',
        planType: 'monthly',
        price: 6000,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['3 meals + snacks', 'Veg & Non-veg options', 'Premium ingredients', 'Chef special weekly', 'Personalized diet plans']
    },
    {
        planName: 'Non-Veg Delight',
        description: 'For chicken and egg lovers',
        category: 'non-veg',
        planType: 'monthly',
        price: 5500,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Chicken 4 days/week', 'Eggs daily', 'Fish twice a week', 'Home-style cooking', 'Hygienic preparation']
    },
    {
        planName: 'Daily Veg Meal',
        description: 'Pay per day, no commitment',
        category: 'veg',
        planType: 'daily',
        price: 150,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['2 meals included', 'No monthly commitment', 'Fresh daily', 'Cancel anytime']
    },
    {
        planName: 'Breakfast Special',
        description: 'Start your day right',
        category: 'veg',
        planType: 'monthly',
        price: 1500,
        meals: { breakfast: true, lunch: false, dinner: false },
        features: ['Healthy breakfast', 'Variety of options', 'Fresh juice included', 'Early delivery']
    }
];

const seedMeals = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        await MealPlan.deleteMany({});
        console.log("🗑️  Cleared existing Meal Plans");

        await MealPlan.insertMany(mealData);
        console.log("✅ Inserted Meal Plans");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed Error:", error.message);
        process.exit(1);
    }
};

seedMeals();
