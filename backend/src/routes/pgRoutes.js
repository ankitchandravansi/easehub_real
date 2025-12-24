import express from "express";
import {
    getAllPGs,
    getPGById,
    createPG,
    updatePG,
    deletePG,
} from "../controllers/pgController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPGs);
router.get("/:id", getPGById);

// Admin routes
router.post("/", protect, adminOnly, createPG);
router.put("/:id", protect, adminOnly, updatePG);
router.delete("/:id", protect, adminOnly, deletePG);

export default router;
