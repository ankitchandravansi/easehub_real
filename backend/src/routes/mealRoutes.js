import express from "express";
import {
    getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
} from "../controllers/mealController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMeals);
router.get("/:id", getMealById);

// Admin routes
router.post("/", protect, adminOnly, createMeal);
router.put("/:id", protect, adminOnly, updateMeal);
router.delete("/:id", protect, adminOnly, deleteMeal);

export default router;
