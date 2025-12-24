import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ LOAD ENV FIRST - BEFORE ANY OTHER IMPORTS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import laundryRoutes from "./routes/laundryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "EaseHub API is running",
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5002;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER || 'NOT LOADED'}`);
            console.log(`🔐 EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? 'LOADED' : 'NOT LOADED'}`);
            console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL || 'NOT LOADED'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
