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

/* ================= BASIC & SAFE CORS ================= */
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
app.use('/uploads', express.static('uploads'));

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

/* ================= START SERVER (WINDOWS FIX) ================= */
const PORT = process.env.PORT || 10000;
const HOST = "127.0.0.1";

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start Express server with proper error handling
        const server = app.listen(PORT, HOST, () => {
            console.log("=".repeat(50));
            console.log(`✅ Server LISTENING on http://${HOST}:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`🔗 Health Check: http://${HOST}:${PORT}/api/health`);
            console.log("=".repeat(50));
        });

        // Critical: Handle server errors (port in use, permission denied, etc.)
        server.on("error", (err) => {
            console.error("=".repeat(50));
            console.error("❌ SERVER ERROR:", err.message);
            console.error("=".repeat(50));

            if (err.code === "EADDRINUSE") {
                console.error(`Port ${PORT} is already in use!`);
                console.error("Run: netstat -ano | findstr :${PORT}");
            } else if (err.code === "EACCES") {
                console.error(`Permission denied to bind to port ${PORT}`);
            }

            process.exit(1);
        });

        // Graceful shutdown
        process.on("SIGTERM", () => {
            console.log("⚠️  SIGTERM received, shutting down gracefully...");
            server.close(() => {
                console.log("✅ Server closed");
                process.exit(0);
            });
        });

    } catch (err) {
        console.error("=".repeat(50));
        console.error("❌ STARTUP FAILED:", err.message);
        console.error("=".repeat(50));
        process.exit(1);
    }
};

startServer();

export default app;
