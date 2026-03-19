import ChatAnalytics from '../models/ChatAnalytics.js';

// Track chat analytics
export const trackChatAnalytics = async (req, res) => {
    try {
        const { eventType, metadata } = req.body;

        // Validate event type
        const validEvents = ['chat_opened', 'button_click', 'booking_lookup', 'language_change'];
        if (!validEvents.includes(eventType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event type'
            });
        }

        // Create analytics record
        const analytics = new ChatAnalytics({
            eventType,
            metadata,
            userId: req.user?._id || null, // Optional: track if user is logged in
            timestamp: new Date()
        });

        await analytics.save();

        res.status(200).json({
            success: true,
            message: 'Analytics tracked successfully'
        });
    } catch (error) {
        console.error('Chat analytics error:', error);
        // Silent fail - don't block user experience
        res.status(200).json({
            success: true,
            message: 'Analytics received'
        });
    }
};

// Get chat analytics (Admin only)
export const getChatAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, eventType } = req.query;

        const query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (eventType) {
            query.eventType = eventType;
        }

        const analytics = await ChatAnalytics.find(query)
            .sort({ timestamp: -1 })
            .limit(1000);

        // Aggregate statistics
        const stats = {
            totalEvents: analytics.length,
            chatOpened: analytics.filter(a => a.eventType === 'chat_opened').length,
            buttonClicks: analytics.filter(a => a.eventType === 'button_click').length,
            bookingLookups: analytics.filter(a => a.eventType === 'booking_lookup').length,
            languageChanges: analytics.filter(a => a.eventType === 'language_change').length,
            uniqueUsers: new Set(analytics.filter(a => a.userId).map(a => a.userId.toString())).size
        };

        res.status(200).json({
            success: true,
            analytics,
            stats
        });
    } catch (error) {
        console.error('Get chat analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics'
        });
    }
};
