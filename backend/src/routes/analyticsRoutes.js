import express from 'express';
import { trackChatAnalytics, getChatAnalytics } from '../controllers/chatAnalyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - track analytics (no auth required for better UX)
router.post('/chat', trackChatAnalytics);

// Admin route - get analytics
router.get('/chat', protect, adminOnly, getChatAnalytics);

export default router;
