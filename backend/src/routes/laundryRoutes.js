import express from "express";
import {
    getAllLaundry,
    getLaundryById,
    createLaundry,
    updateLaundry,
    deleteLaundry,
} from "../controllers/laundryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllLaundry);
router.get("/:id", getLaundryById);

// Admin routes
router.post("/", protect, adminOnly, createLaundry);
router.put("/:id", protect, adminOnly, updateLaundry);
router.delete("/:id", protect, adminOnly, deleteLaundry);

export default router;
