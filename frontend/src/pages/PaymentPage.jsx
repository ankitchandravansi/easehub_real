import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, submitPaymentProof } from '../services/bookingService';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUTRForm, setShowUTRForm] = useState(false);
    const [utr, setUtr] = useState('');
    const [proofFile, setProofFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Check if we have a stored bookingId from a previous session
        const storedBookingId = sessionStorage.getItem('currentBookingId');

        if (bookingId) {
            fetchBooking();
        } else if (storedBookingId) {
            // Auto-restore to payment page if user returns
            navigate(`/payment/${storedBookingId}`);
        }
    }, [bookingId]);

    const fetchBooking = async () => {
        try {
            console.log('🔍 Fetching booking:', bookingId);
            const response = await getBookingById(bookingId);
            console.log('📥 Payment Page - Booking Data:', response.data);
            console.log('💰 Amount from backend:', response.data.amount);

            setBooking(response.data);
            if (response.data.status !== 'CREATED') {
                setShowUTRForm(false);
            }
            // Clear sessionStorage after successful booking fetch
            if (response.data.status === 'PAID' || response.data.status === 'CANCELLED') {
                sessionStorage.removeItem('currentBookingId');
                sessionStorage.removeItem('currentBookingAmount');
                sessionStorage.removeItem('currentBookingService');
            }
        } catch (error) {
            console.error('❌ Error fetching booking:', error);
            const errorMsg = error.response?.data?.message || 'Booking not found';
            alert(errorMsg);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProof = async (e) => {
        e.preventDefault();

        if (!utr || utr.length < 12) {
            alert('Please enter a valid UTR (minimum 12 characters)');
            return;
        }

        try {
            setSubmitting(true);
            await submitPaymentProof(bookingId, utr, proofFile);
            alert('Payment proof submitted successfully! Verification within 30 minutes.');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting proof:', error);
            alert(error.response?.data?.message || 'Failed to submit payment proof');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Complete Payment
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Booking ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{booking.bookingId}</span>
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Service:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{booking.serviceName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</span>
                            </div>
                            <div className="flex justify-between items-baseline border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                                <span className="text-gray-600 dark:text-gray-400">Amount to Pay:</span>
                                <span className="text-3xl font-black text-green-600 dark:text-green-400">₹{typeof booking.amount === 'number' && !isNaN(booking.amount) ? booking.amount : 0}</span>
                            </div>
                        </div>
                    </div>

                    {booking.status === 'CREATED' && !showUTRForm && (
                        <>
                            {/* UPI QR Code */}
                            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 mb-8">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                                    Scan QR Code to Pay
                                </h3>
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="/upi-qr-code.jpg"
                                        alt="UPI QR Code"
                                        className="w-full max-w-sm rounded-lg shadow-lg"
                                    />
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 text-center font-medium">
                                        📱 Please pay <span className="font-bold">₹{typeof booking.amount === 'number' && !isNaN(booking.amount) ? booking.amount : 0}</span> and enter Booking ID <span className="font-mono font-bold">{booking.bookingId}</span> in the UPI note/remark
                                    </p>
                                </div>

                                {/* Helper Text */}
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center font-medium">
                                        ⚠️ After payment, please return to this page to submit UTR.<br />
                                        <span className="text-xs">Do not close this page until payment is completed.</span>
                                    </p>
                                </div>
                            </div>

                            {/* Trust Messages */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8 border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">🔒 Safe & Secure</h4>
                                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                    <li>✓ Manual payment verification within 30 minutes</li>
                                    <li>✓ For safety, payments are verified manually</li>
                                    <li>✓ Instant support available on WhatsApp</li>
                                </ul>
                            </div>

                            {/* I Have Paid Button */}
                            <button
                                onClick={() => setShowUTRForm(true)}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                            >
                                I have paid ₹{typeof booking.amount === 'number' && !isNaN(booking.amount) ? booking.amount : 0}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 dark:text-green-400 text-xl">✔</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Manual verification within 30 minutes</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 dark:text-green-400 text-xl">✔</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Trusted by local PGs</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 dark:text-green-400 text-xl">✔</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">100% human support</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 dark:text-green-400 text-xl">✔</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">No payment gateway fees</span>
                                    </div>
                                </div>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400 border-t border-blue-200 dark:border-blue-700 pt-4">
                                    Payments are manually verified for your safety.<br />
                                    For instant help, contact us on WhatsApp.
                                </p>
                            </div>
                        </>
                    )}

                    {booking.status === 'CREATED' && showUTRForm && (
                        <form onSubmit={handleSubmitProof} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    UTR / Transaction ID *
                                </label>
                                <input
                                    type="text"
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                    required
                                    minLength={12}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter 12-digit UTR number"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Find UTR in your UPI app transaction history
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Payment Screenshot (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProofFile(e.target.files[0])}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUTRForm(false)}
                                    className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Payment Proof'}
                                </button>
                            </div>
                        </form>
                    )}

                    {booking.status === 'PAYMENT_PENDING' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Under Verification</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Your payment is being verified. This usually takes 30 minutes.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-left max-w-md mx-auto">
                                <p className="text-sm text-gray-600 dark:text-gray-400">UTR: <span className="font-mono font-bold">{booking.utr}</span></p>
                            </div>
                        </div>
                    )}

                    {booking.status === 'PAID' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Confirmed!</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your booking is confirmed. Check your email for details.
                            </p>
                        </div>
                    )}

                    {booking.status === 'CANCELLED' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Rejected</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Please contact support for assistance.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
