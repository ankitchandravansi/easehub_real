import dotenv from 'dotenv';
import connectDB from './database.js';
import User from '../models/User.js';
import PGHostel from '../models/PGHostel.js';
import MealPlan from '../models/MealPlan.js';
import LaundryService from '../models/LaundryService.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Seeding database...');

        // Create admin user
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@easehub.com' });

        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL || 'admin@easehub.com',
                phone: '9999999999',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin'
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Seed PG/Hostels
        const pgCount = await PGHostel.countDocuments();
        if (pgCount === 0) {
            await PGHostel.insertMany([
                {
                    name: 'Sunrise Boys PG',
                    description: 'Comfortable and affordable PG accommodation for boys near college campus with all modern amenities.',
                    location: {
                        address: '123 College Road',
                        city: 'Mumbai',
                        pincode: '400001'
                    },
                    pricing: {
                        single: 8000,
                        double: 6000,
                        triple: 5000
                    },
                    amenities: ['WiFi', 'AC', 'Laundry', 'Meals', 'Power Backup', 'Security'],
                    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
                    gender: 'male',
                    contactNumber: '9876543210',
                    rating: 4.5
                },
                {
                    name: 'Green Valley Girls Hostel',
                    description: 'Safe and secure hostel for girls with homely environment and nutritious food.',
                    location: {
                        address: '456 University Lane',
                        city: 'Mumbai',
                        pincode: '400002'
                    },
                    pricing: {
                        single: 9000,
                        double: 7000,
                        triple: 5500
                    },
                    amenities: ['WiFi', 'AC', 'Gym', 'Mess', 'CCTV', 'Warden'],
                    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
                    gender: 'female',
                    contactNumber: '9876543211',
                    rating: 4.7
                },
                {
                    name: 'City Center Co-living',
                    description: 'Modern co-living space with shared amenities and vibrant community.',
                    location: {
                        address: '789 Metro Station Road',
                        city: 'Pune',
                        pincode: '411001'
                    },
                    pricing: {
                        single: 10000,
                        double: 7500
                    },
                    amenities: ['WiFi', 'AC', 'Gym', 'Cafeteria', 'Gaming Room', 'Study Room'],
                    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
                    gender: 'unisex',
                    contactNumber: '9876543212',
                    rating: 4.3
                }
            ]);
            console.log('✅ PG/Hostels seeded');
        }

        // Seed Meal Plans
        const mealCount = await MealPlan.countDocuments();
        if (mealCount === 0) {
            await MealPlan.insertMany([
                {
                    planName: 'Daily Veg Meal',
                    description: 'Fresh vegetarian meals prepared daily with home-style cooking',
                    planType: 'daily',
                    category: 'veg',
                    price: 100,
                    meals: { breakfast: true, lunch: true, dinner: true },
                    features: ['Home-style cooking', 'Fresh ingredients', 'Customizable spice level']
                },
                {
                    planName: 'Monthly Veg Plan',
                    description: 'Complete vegetarian meal plan for the entire month',
                    planType: 'monthly',
                    category: 'veg',
                    price: 2500,
                    meals: { breakfast: true, lunch: true, dinner: true },
                    features: ['30 days coverage', 'Variety menu', 'Weekend special']
                },
                {
                    planName: 'Daily Non-Veg Meal',
                    description: 'Delicious non-vegetarian meals with chicken, fish, and eggs',
                    planType: 'daily',
                    category: 'non-veg',
                    price: 150,
                    meals: { breakfast: false, lunch: true, dinner: true },
                    features: ['Chicken/Fish options', 'High protein', 'Fresh meat']
                },
                {
                    planName: 'Monthly Mixed Plan',
                    description: 'Flexible meal plan with both veg and non-veg options',
                    planType: 'monthly',
                    category: 'both',
                    price: 3000,
                    meals: { breakfast: true, lunch: true, dinner: true },
                    features: ['Veg & Non-veg options', 'Daily variety', 'Festival specials']
                }
            ]);
            console.log('✅ Meal plans seeded');
        }

        // Seed Laundry Services
        const laundryCount = await LaundryService.countDocuments();
        if (laundryCount === 0) {
            await LaundryService.insertMany([
                {
                    serviceName: 'Per Kg Laundry',
                    description: 'Pay per kilogram for your laundry needs',
                    pricingType: 'per-kg',
                    price: 40,
                    features: ['Wash & Iron', 'Same day service', 'Pickup & Delivery'],
                    turnaroundTime: '24 hours'
                },
                {
                    serviceName: 'Monthly Unlimited',
                    description: 'Unlimited laundry service for the entire month',
                    pricingType: 'monthly',
                    price: 500,
                    features: ['Unlimited clothes', 'Free pickup & delivery', 'Premium detergent'],
                    turnaroundTime: '24-48 hours'
                },
                {
                    serviceName: 'Premium Per Item',
                    description: 'Premium laundry service charged per item',
                    pricingType: 'per-item',
                    price: 30,
                    features: ['Dry cleaning available', 'Stain removal', 'Fabric care'],
                    turnaroundTime: '48 hours'
                }
            ]);
            console.log('✅ Laundry services seeded');
        }

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
