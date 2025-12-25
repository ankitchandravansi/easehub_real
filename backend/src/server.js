import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";

// ================= ENV LOAD =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

// ================= APP =================
const app = express();

// ================= CORS =================
app.use(
    cors({
        origin: [
            "https://easehub-frontend.vercel.app",
            process.env.CLIENT_URL,
            "http://localhost:5173",
        ].filter(Boolean),
        credentials: true,
    })
);

// ================= BODY =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import laundryRoutes from "./routes/laundryRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// 🔥🔥🔥 MAIN FIX HERE 🔥🔥🔥
app.use("/api/pg", pgRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// ================= HEALTH =================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "EaseHub API is running ✅",
    });
});

// ================= 404 =================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// ================= ERROR =================
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

// ================= START =================
const PORT = process.env.PORT || 5002;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();

export default app;
