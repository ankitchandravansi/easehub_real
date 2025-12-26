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
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

/* =========================================================
   CORS — FINAL & STABLE (NO DUPLICATE / NO PREFLIGHT BUG)
   ========================================================= */
const allowedOrigins = [
    "https://easehub-frontend.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow server-to-server / Postman / curl
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(
                    new Error(`CORS blocked for origin: ${origin}`)
                );
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ================= BODY PARSERS ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "EaseHub API running ✅",
        env: process.env.NODE_ENV,
        time: new Date().toISOString(),
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
app.use("/api/bookings", bookingRoutes);

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
        message: err.message || "Internal Server Error",
    });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 10000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log("=".repeat(50));
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Backend URL: https://easehub-real.onrender.com`);
            console.log(`✅ Allowed CORS origins:`);
            allowedOrigins.forEach((o) => console.log("   •", o));
            console.log("=".repeat(50));
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;
