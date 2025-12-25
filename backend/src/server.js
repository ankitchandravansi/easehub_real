import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import laundryRoutes from "./routes/laundryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// ================== CORS - PRODUCTION READY ==================
// CRITICAL: Must be BEFORE routes and body parsers
app.use(
    cors({
        origin: [
            "https://easehub-frontend.vercel.app",
            "http://localhost:5173",
            process.env.CLIENT_URL,
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

// Handle preflight requests explicitly
app.options("*", cors());

// ================== BODY PARSERS ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== HEALTH CHECK ==================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "EaseHub API running ✅",
        timestamp: new Date().toISOString(),
    });
});

// ================== API ROUTES ==================
app.use("/api/pg", pgRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// ================== 404 HANDLER ==================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 10000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log("=".repeat(50));
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`🔗 Backend URL: https://easehub-real.onrender.com`);
            console.log(`✅ CORS enabled for: https://easehub-frontend.vercel.app`);
            console.log("=".repeat(50));
        });
    } catch (err) {
        console.error("❌ Server start failed:", err);
        process.exit(1);
    }
};

startServer();

export default app;
