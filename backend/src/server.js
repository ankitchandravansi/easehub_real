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
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://easehub-frontend.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("CORS blocked"), false);
        },
        credentials: true,
    })
);

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static("uploads"));

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EaseHub API running ✅",
    });
});

/* ================= API ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/pg", pgRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
    console.error("❌ API Error:", err.message);
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

/* ================= START SERVER (RENDER SAFE) ================= */
const PORT = process.env.PORT || 10000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log("=".repeat(50));
            console.log(`✅ Server LISTENING on PORT ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`🔗 Health Check: /api/health`);
            console.log("=".repeat(50));
        });

        server.on("error", (err) => {
            console.error("❌ SERVER ERROR:", err.message);
            process.exit(1);
        });

        process.on("SIGTERM", () => {
            console.log("⚠️ SIGTERM received, shutting down...");
            server.close(() => process.exit(0));
        });

    } catch (err) {
        console.error("❌ STARTUP FAILED:", err.message);
        process.exit(1);
    }
};

startServer();

export default app;
