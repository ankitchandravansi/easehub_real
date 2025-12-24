import express from "express";
import {
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
} from "../controllers/requestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);

// Admin routes
router.get("/", protect, adminOnly, getAllRequests);
router.put("/:id", protect, adminOnly, updateRequestStatus);

export default router;
