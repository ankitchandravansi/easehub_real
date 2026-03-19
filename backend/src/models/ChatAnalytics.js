import mongoose from 'mongoose';

const chatAnalyticsSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: ['chat_opened', 'button_click', 'booking_lookup', 'language_change']
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
chatAnalyticsSchema.index({ eventType: 1, timestamp: -1 });
chatAnalyticsSchema.index({ userId: 1, timestamp: -1 });

// Auto-delete old analytics after 90 days (optional)
chatAnalyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const ChatAnalytics = mongoose.model('ChatAnalytics', chatAnalyticsSchema);

export default ChatAnalytics;
