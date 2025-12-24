import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./src/models/User.js";
import PGHostel from "./src/models/PGHostel.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected for seeding");

        // Clear old data
        await User.deleteMany();
        await PGHostel.deleteMany();

        console.log("🗑️ Old data cleared");

        // ======================
        // ADMIN USER
        // ======================
        const adminUser = await User.create({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            phone: "9999999999", // 🔥 REQUIRED FIELD
            role: "admin",
        });

        console.log("👑 Admin user created");

        // ======================
        // PG HOSTEL
        // ======================
        await PGHostel.create({
            name: "EaseHub Premium PG",
            description: "Fully furnished PG with food, wifi and laundry",
            rent: 9000,
            gender: "male", // ❌ boys ❌ girls ❌ | ✅ male / female / unisex
            contactNumber: "8888888888",
            amenities: ["WiFi", "Laundry", "Meals", "Power Backup"],
            location: {
                address: "Near City Center",
                city: "Mumbai",
                pincode: "400001",
            },
        });

        console.log("🏠 PG Hostel added");

        console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
