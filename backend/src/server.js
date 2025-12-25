import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// ROUTES - Fixed import paths (removed extra ./src/)
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import laundryRoutes from "./routes/laundryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// ================== CORS ==================
app.use(
    cors({
        origin: [
            "https://easehub-frontend.vercel.app",
            "http://localhost:5173",
            process.env.CLIENT_URL,
        ].filter(Boolean),
        credentials: true,
    })
);

// ================== BODY ==================
app.use(express.json());

// ================== HEALTH ==================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "EaseHub API running ✅",
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

// ================== 404 ==================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// ================== START ==================
const PORT = process.env.PORT || 10000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server start failed", err);
        process.exit(1);
    }
};

startServer();
