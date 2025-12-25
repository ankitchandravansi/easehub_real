import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ==================================================
// LOAD ENV (WORKS FOR LOCAL + RENDER BOTH)
// ==================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Render automatically injects env, local needs .env
dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

// ==================================================
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

// ==================================================
// CORS (FIXED FOR VERCEL + LOCAL)
// ==================================================
app.use(
    cors({
        origin: [
            "https://easehub-frontend.vercel.app",  // Production frontend (explicit)
            process.env.CLIENT_URL,                  // Backup env var
            "http://localhost:5173",                 // Local frontend
        ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ==================================================
// BODY PARSERS
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================================
// HEALTH CHECK (🔥 THIS WAS THE MAIN ISSUE)
// ==================================================
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EaseHub API is running",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
    });
});

// ==================================================
// API ROUTES
// ==================================================
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// ==================================================
// 404 HANDLER (KEEP AT BOTTOM)
// ==================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ==================================================
// START SERVER
// ==================================================
const PORT = process.env.PORT || 5002;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("=================================");
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 ENV: ${process.env.NODE_ENV || "development"}`);
            console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL || "NOT SET"}`);
            console.log(
                `📧 EMAIL_USER: ${process.env.EMAIL_USER ? "LOADED" : "NOT LOADED"}`
            );
            console.log("=================================");
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;
