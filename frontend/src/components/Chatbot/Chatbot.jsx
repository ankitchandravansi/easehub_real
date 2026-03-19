import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, Languages, Minimize2 } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize chat with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = language === 'en'
                ? "Hi 👋 I'm EaseHub Assistant.\nI can help you with bookings, payments, and support."
                : "नमस्ते 👋 मैं EaseHub Assistant हूँ।\nमैं booking, payment और support में आपकी मदद कर सकता हूँ।";

            setMessages([
                {
                    type: 'bot',
                    text: welcomeMessage,
                    timestamp: new Date()
                }
            ]);

            // Track chat opened
            trackAnalytics('chat_opened');
        }
    }, [isOpen, language]);

    // Analytics tracking
    const trackAnalytics = async (eventType, metadata = {}) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            await axios.post(`${API_BASE_URL}/api/analytics/chat`, {
                eventType,
                metadata,
                timestamp: new Date()
            });
        } catch (error) {
            // Silent fail - analytics should not block user experience
            console.log('Analytics tracking failed:', error.message);
        }
    };

    // Quick action buttons
    const quickActions = language === 'en' ? [
        { id: 'status', label: '📋 Check booking status', action: 'check_status' },
        { id: 'search', label: '🔍 Search by Booking ID', action: 'search_booking' },
        { id: 'payment', label: '💳 How payment works', action: 'payment_info' },
        { id: 'utr', label: '📝 Submit UTR help', action: 'utr_help' },
        { id: 'support', label: '📞 Contact support', action: 'contact_support' }
    ] : [
        { id: 'status', label: '📋 बुकिंग स्टेटस चेक करें', action: 'check_status' },
        { id: 'search', label: '🔍 बुकिंग ID से खोजें', action: 'search_booking' },
        { id: 'payment', label: '💳 पेमेंट कैसे करें', action: 'payment_info' },
        { id: 'utr', label: '📝 UTR सबमिट करें', action: 'utr_help' },
        { id: 'support', label: '📞 सपोर्ट से संपर्क करें', action: 'contact_support' }
    ];

    // Handle quick action click
    const handleQuickAction = (action) => {
        trackAnalytics('button_click', { action });

        const userMessage = quickActions.find(a => a.action === action)?.label || action;
        addMessage('user', userMessage);

        // Generate response based on action
        setTimeout(() => {
            let response = '';

            switch (action) {
                case 'check_status':
                    response = language === 'en'
                        ? "Please provide your Booking ID (format: EH-XXXX) to check the status."
                        : "कृपया अपनी बुकिंग ID (फॉर्मेट: EH-XXXX) प्रदान करें।";
                    break;

                case 'search_booking':
                    response = language === 'en'
                        ? "Please enter your Booking ID in the format: EH-XXXX\n\nExample: EH-1234"
                        : "कृपया अपनी बुकिंग ID इस फॉर्मेट में दर्ज करें: EH-XXXX\n\nउदाहरण: EH-1234";
                    break;

                case 'payment_info':
                    response = language === 'en'
                        ? "💳 Payment Process:\n\n1. Complete your booking\n2. Scan the QR code on payment page\n3. Make payment via UPI\n4. Submit UTR number\n5. Wait for verification (usually within 24 hours)\n\nYour booking will be confirmed once payment is verified ✅"
                        : "💳 पेमेंट प्रक्रिया:\n\n1. अपनी बुकिंग पूरी करें\n2. पेमेंट पेज पर QR कोड स्कैन करें\n3. UPI से पेमेंट करें\n4. UTR नंबर सबमिट करें\n5. वेरिफिकेशन की प्रतीक्षा करें (आमतौर पर 24 घंटे के भीतर)\n\nपेमेंट वेरिफाई होने के बाद आपकी बुकिंग कन्फर्म हो जाएगी ✅";
                    break;

                case 'utr_help':
                    response = language === 'en'
                        ? "📝 How to find UTR number:\n\n1. Open your UPI app (GPay, PhonePe, Paytm, etc.)\n2. Go to transaction history\n3. Find your EaseHub payment\n4. Look for 'UTR' or 'Transaction ID'\n5. It's a 12-digit number\n6. Copy and paste it on the payment page\n\nNeed more help? Contact support."
                        : "📝 UTR नंबर कैसे खोजें:\n\n1. अपना UPI ऐप खोलें (GPay, PhonePe, Paytm, आदि)\n2. ट्रांजेक्शन हिस्ट्री में जाएं\n3. अपना EaseHub पेमेंट खोजें\n4. 'UTR' या 'Transaction ID' देखें\n5. यह 12 अंकों का नंबर है\n6. इसे कॉपी करके पेमेंट पेज पर पेस्ट करें\n\nऔर मदद चाहिए? सपोर्ट से संपर्क करें।";
                    break;

                case 'contact_support':
                    response = language === 'en'
                        ? "📞 Contact Support:\n\n📧 Email: support@easehub.com\n📱 WhatsApp: +91-XXXXXXXXXX\n⏰ Available: 9 AM - 9 PM (Mon-Sat)\n\nWe typically respond within 2-4 hours."
                        : "📞 सपोर्ट से संपर्क करें:\n\n📧 ईमेल: support@easehub.com\n📱 WhatsApp: +91-XXXXXXXXXX\n⏰ उपलब्ध: सुबह 9 बजे - रात 9 बजे (सोम-शनि)\n\nहम आमतौर पर 2-4 घंटे के भीतर जवाब देते हैं।";
                    break;

                default:
                    response = language === 'en'
                        ? "How can I help you today?"
                        : "मैं आज आपकी कैसे मदद कर सकता हूँ?";
            }

            addMessage('bot', response);
        }, 500);
    };

    // Add message to chat
    const addMessage = (type, text) => {
        setMessages(prev => [...prev, {
            type,
            text,
            timestamp: new Date()
        }]);
    };

    // Validate booking ID format
    const isValidBookingId = (id) => {
        return /^EH-\d{4,}$/i.test(id.trim());
    };

    // Search booking by ID
    const searchBooking = async (bookingId) => {
        setIsLoading(true);
        trackAnalytics('booking_lookup', { bookingId });

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

            // USE PUBLIC SEARCH ENDPOINT - No token needed
            const response = await axios.get(
                `${API_BASE_URL}/api/bookings/search/${bookingId}`
            );

            const booking = response.data.data; // Response structure: { success: true, data: booking }

            // Generate status-aware response
            let statusMessage = '';

            switch (booking.status) {
                case 'CREATED':
                    statusMessage = language === 'en'
                        ? "Your booking is created.\nPlease complete payment using the QR code."
                        : "आपकी बुकिंग बन गई है।\nकृपया QR कोड का उपयोग करके पेमेंट पूरा करें।";
                    break;

                case 'PAYMENT_PENDING':
                    statusMessage = language === 'en'
                        ? "Payment received.\nVerification is in progress."
                        : "पेमेंट प्राप्त हुआ।\nवेरिफिकेशन प्रगति पर है।";
                    break;

                case 'PAID':
                    statusMessage = language === 'en'
                        ? "Payment verified ✅\nYour service is confirmed."
                        : "पेमेंट वेरिफाई हो गया ✅\nआपकी सेवा कन्फर्म है।";
                    break;

                case 'CANCELLED':
                    statusMessage = language === 'en'
                        ? "This booking was cancelled.\nPlease create a new booking."
                        : "यह बुकिंग रद्द कर दी गई थी।\nकृपया नई बुकिंग बनाएं।";
                    break;

                default:
                    statusMessage = language === 'en'
                        ? `Status: ${booking.status}`
                        : `स्थिति: ${booking.status}`;
            }

            const bookingInfo = language === 'en'
                ? `📋 Booking Details:\n\nBooking ID: ${booking.bookingId}\nService: ${booking.serviceType}\nAmount: ₹${booking.amount}\nStatus: ${booking.status}\n\n${statusMessage}`
                : `📋 बुकिंग विवरण:\n\nबुकिंग ID: ${booking.bookingId}\nसेवा: ${booking.serviceType}\nराशि: ₹${booking.amount}\nस्थिति: ${booking.status}\n\n${statusMessage}`;

            addMessage('bot', bookingInfo);
        } catch (error) {
            const errorMessage = language === 'en'
                ? `No booking found for ID: ${bookingId}\n\nPlease check your booking ID and try again.`
                : `ID के लिए कोई बुकिंग नहीं मिली: ${bookingId}\n\nकृपया अपनी बुकिंग ID जांचें और पुनः प्रयास करें।`;

            addMessage('bot', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle user input
    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userInput = inputValue.trim();
        addMessage('user', userInput);
        setInputValue('');

        // Check if it's a booking ID
        if (isValidBookingId(userInput)) {
            searchBooking(userInput.toUpperCase());
        } else {
            // Generic response for now (future: AI integration)
            setTimeout(() => {
                const response = language === 'en'
                    ? "I can help you with:\n\n• Checking booking status (provide Booking ID)\n• Payment information\n• UTR submission help\n• General support\n\nPlease use the quick action buttons or provide your Booking ID (format: EH-XXXX)."
                    : "मैं आपकी मदद कर सकता हूँ:\n\n• बुकिंग स्टेटस चेक करना (बुकिंग ID दें)\n• पेमेंट जानकारी\n• UTR सबमिशन मदद\n• सामान्य सपोर्ट\n\nकृपया क्विक एक्शन बटन का उपयोग करें या अपनी बुकिंग ID दें (फॉर्मेट: EH-XXXX)।";

                addMessage('bot', response);
            }, 500);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Toggle language
    const toggleLanguage = (lang) => {
        setLanguage(lang);
        setMessages([]); // Reset messages
        trackAnalytics('language_change', { language: lang });
    };

    return (
        <>
            {/* Chat Button */}
            <div className={`chatbot-button ${isOpen ? 'hidden' : ''}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="chat-trigger"
                    aria-label="Open chat"
                >
                    <MessageCircle size={32} className="chat-icon-svg" />
                </button>
                <div className="chat-tooltip">Need help?</div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-content">
                            <div className="chatbot-avatar">
                                <Bot size={24} color="white" />
                            </div>
                            <div className="chatbot-title">
                                <h3>EaseHub Assistant</h3>
                                <p className="chatbot-status">
                                    <span className="status-dot"></span>
                                    {language === 'en' ? 'Online' : 'ऑनलाइन'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="chatbot-close"
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="language-selector">
                        <button
                            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                            onClick={() => toggleLanguage('en')}
                        >
                            🇬🇧 English
                        </button>
                        <button
                            className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
                            onClick={() => toggleLanguage('hi')}
                        >
                            🇮🇳 हिंदी
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'}`}
                            >
                                <div className="message-content">
                                    {message.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message message-bot">
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length > 0 && (
                        <div className="quick-actions">
                            {quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action.action)}
                                    className="quick-action-btn"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="chatbot-input-container">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={language === 'en' ? 'Type your message or Booking ID...' : 'अपना संदेश या बुकिंग ID टाइप करें...'}
                            className="chatbot-input"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="chatbot-send-btn"
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
