import mongoose from "mongoose";
import MealPlan from "./src/models/MealPlan.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://easehub:HuxhX0HaI535XyqF@cluster0.f6xugmd.mongodb.net/easehub?retryWrites=true&w=majority";

const mealData = [
    {
        messName: 'Roshan Kushwaha Mess',
        planName: 'Standard Monthly',
        description: 'Quality home-style food in Kohka.',
        category: 'veg',
        planType: 'monthly',
        price: 2500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Lunch & Dinner', 'Sunday Special'],
        location: '68HW+X52, Kohka, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Aapka Rasoi Mess',
        planName: 'Monthly Tiffin',
        description: 'Best tiffin service in Saket Nagar.',
        category: 'veg',
        planType: 'monthly',
        price: 3800, // 1-200 per person/meal implied, mapping to monthly
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Fresh Vegetables', 'Hygienic Kitchen'],
        location: 'Saket nagar, Kurud Rd, Kohka, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Sai Mess',
        planName: 'Student Plan',
        description: 'Affordable mess for students.',
        category: 'veg',
        planType: 'monthly',
        price: 2000,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Unlimited Roti', 'Rice'],
        location: 'Kurud Rd, Kurud, Shanti Nagar, Bhilai, Chhattisgarh 490026'
    },
    {
        messName: 'Bhavesh mess center',
        planName: 'Regular Plan',
        description: 'Reliable mess center in Kohka.',
        category: 'veg',
        planType: 'monthly',
        price: 2400,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Daily variety', 'Salad included'],
        location: '68JW+5PP, Kurud Rd, Kohka, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Shailya Mess',
        planName: 'Premium Monthly',
        description: 'Good quality food and service.',
        category: 'veg',
        planType: 'monthly',
        price: 2800,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['3 meals', 'Evening tea'],
        location: 'Street 11, kohka kurud, Shanti Nagar, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Aditya Mess',
        planName: 'Basic Plan',
        description: 'Simple and good food.',
        category: 'veg',
        planType: 'monthly',
        price: 2200,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Lunch & Dinner'],
        location: '05 Avanti Bai Chowk Avanti Bai Chowk Bhilai, Bhilai, Chhattisgarh'
    },
    {
        messName: 'NAINA GIRLS PG & MESS FACILITY',
        planName: 'PG & Mess Combo',
        description: 'Specialized for girls PG residents.',
        category: 'veg',
        planType: 'monthly',
        price: 3000,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Secure environment', 'Home taste'],
        location: 'near MANSA ITI COLLAGE and RUNGTA COLLEGE, Kohka, Bhilai'
    },
    {
        messName: 'Shri Laxmi Mess',
        planName: 'Monthly Subscription',
        description: 'Popular choice in Smriti Nagar.',
        category: 'veg',
        planType: 'monthly',
        price: 2500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Tiffin delivery available', 'Sunday Feast'],
        location: '6879+V4P, Smriti Nagar, Bhilai, Chhattisgarh 490020'
    },
    {
        messName: 'Rasoi Express',
        planName: 'Premium Tiffin',
        description: 'The best tiffin provider in the area.',
        category: 'veg',
        planType: 'monthly',
        price: 2200,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Hot delivery', 'Customizable spice levels'],
        location: 'Kohka, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Om Sai Mess CG Mess',
        planName: 'Standard Plan',
        description: 'Near St. Xavier school.',
        category: 'veg',
        planType: 'monthly',
        price: 2300,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Students Discount'],
        location: 'Nirmal Chhaya, Besides, near st Xavier school, Bhilai, Chhattisgarh 490026'
    },
    {
        messName: 'Jaya Tiffin Services',
        planName: 'Home Tiffin',
        description: 'Homemade food delivery.',
        category: 'veg',
        planType: 'monthly',
        price: 2000,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Mom\'s taste', 'Hygiene priority'],
        location: 'Hanuman Mandir, Kohka, Shanti Nagar, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Anant mess',
        planName: 'Budget Plan',
        description: 'Located in Nehru Nagar East.',
        category: 'veg',
        planType: 'monthly',
        price: 2100,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Economy meals'],
        location: '54/2, Nehru Nagar East, Bhilai, Chhattisgarh 490020'
    },
    {
        messName: 'Mom\'s food creation',
        planName: 'Full Meal Plan',
        description: 'Tiffin, Meal, Box services available.',
        category: 'veg',
        planType: 'monthly',
        price: 3000,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Box service', 'Variety menu'],
        location: 'St No Zero, Supela, Shanti Nagar, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Gayatri Mess',
        planName: 'Monthly Plan',
        description: 'Located in Smriti Nagar.',
        category: 'veg',
        planType: 'monthly',
        price: 2400,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Fresh roti'],
        location: '6879+8CR, Smriti Nagar, Bhilai, Chhattisgarh 490020'
    },
    {
        messName: 'Paushtic Mess',
        planName: 'Healthy Plan',
        description: 'Focus on nutritious food.',
        category: 'veg',
        planType: 'monthly',
        price: 2600,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Less oil', 'Green veggies'],
        location: '6879+8FQ, Central Avenue, Pushpak Nagar, Bhilai, Chhattisgarh 490020'
    },
    {
        messName: 'Mom\'s kitchen mess & Catering',
        planName: 'Catering Style',
        description: 'Tasty food near Hanuman temple.',
        category: 'both',
        planType: 'monthly',
        price: 2800,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Special Sunday Non-veg', 'Sweet dish'],
        location: 'Beside Hanuman temple, Hanuman Nagar, Durg, Chhattisgarh 490022'
    },
    {
        messName: 'Shri Mess And Tiffin Services',
        planName: 'Standard Plan',
        description: 'Mess in Sector 7.',
        category: 'veg',
        planType: 'monthly',
        price: 2500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Timely delivery'],
        location: 'college, Sector 7, Bhilai, Kalyan, Chhattisgarh 490006'
    },
    {
        messName: 'Makhija Restaurant',
        planName: 'Restaurant Plan',
        description: 'Restaurant food at mess prices.',
        category: 'both',
        planType: 'monthly',
        price: 3500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Restaurant taste', 'AC seating'],
        location: 'Ghadi chowk, A-33, Dakshin Gangotri, Supela, Bhilai, Chhattisgarh 490023'
    },
    {
        messName: 'Mother mess',
        planName: 'Home Plan',
        description: 'Motherly care in cooking.',
        category: 'veg',
        planType: 'monthly',
        price: 2200,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Simple food'],
        location: 'A-67, Central Avenue road, Smriti Nagar, Bhilai, Chhattisgarh'
    },
    {
        messName: 'Shivam fast food and mess',
        planName: 'Fast Food Combo',
        description: 'Mess with fast food options.',
        category: 'veg',
        planType: 'monthly',
        price: 2000,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Evening snacks'],
        location: 'under bridge, Main road, in front of Raipur Naka, Smriti Nagar Road'
    },
    {
        messName: 'Hariom Mess & Restaurant',
        planName: 'Combo Plan',
        description: 'Mess and restaurant combined.',
        category: 'veg',
        planType: 'monthly',
        price: 2500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['Wide variety'],
        location: '58MN+3XQ, Street Number 8, Zonal Market, Sector 10, Bhilai'
    }
];

const seedMeals = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        await MealPlan.deleteMany({});
        console.log("🗑️  Cleared existing Meal Plans");

        await MealPlan.insertMany(mealData);
        console.log(`✅ Inserted ${mealData.length} Meal Plans`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed Error:", error.message);
        process.exit(1);
    }
};

seedMeals();
