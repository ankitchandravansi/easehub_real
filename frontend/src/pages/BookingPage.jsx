import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPGById } from '../services/pgService';
import { createBooking, verifyPayment } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guestName: user?.name || '',
        guestEmail: user?.email || '',
        guestPhone: '',
        specialRequests: ''
    });

    useEffect(() => {
        loadPG();
    }, [id]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const loadPG = async () => {
        try {
            const res = await getPGById(id);
            setPg(res.data);
        } catch (error) {
            console.error('Error fetching PG', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!formData.checkInDate || !formData.checkOutDate) return 0;
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return days > 0 ? pg.price * days : 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!formData.checkInDate || !formData.checkOutDate || !formData.guestPhone) {
            alert('Please fill all required fields');
            return;
        }

        const total = calculateTotal();
        if (total <= 0) {
            alert('Invalid date range');
            return;
        }

        setSubmitting(true);

        try {
            const bookingRes = await createBooking({
                pgId: id,
                ...formData,
                totalAmount: total
            });

            const { booking, order } = bookingRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'EaseHub',
                description: `Booking for ${pg.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingId: booking._id
                        });

                        navigate('/booking-success', {
                            state: {
                                booking: booking,
                                pg: pg
                            }
                        });
                    } catch (error) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.guestName,
                    email: formData.guestEmail,
                    contact: formData.guestPhone
                },
                theme: {
                    color: '#4F46E5'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                alert('Payment failed. Please try again.');
            });
            razorpay.open();
        } catch (error) {
            console.error(error);
            alert('Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!pg) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">PG not found</p>
                </div>
            </div>
        );
    }

    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white">
                            <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
                            <h3 className="text-xl font-semibold">{pg.name}</h3>
                            <p className="opacity-90 mt-2">{pg.address}, {pg.city}</p>

                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between">
                                    <span>Price per month</span>
                                    <span>₹{pg.price}</span>
                                </div>
                                {total > 0 && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Duration</span>
                                            <span>{Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))} days</span>
                                        </div>
                                        <div className="h-px bg-white/30 my-2"></div>
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total Amount</span>
                                            <span>₹{total}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="md:w-1/2 p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Booking</h2>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.guestName}
                                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.guestEmail}
                                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit mobile number"
                                        value={formData.guestPhone}
                                        onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.checkInDate}
                                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                                        value={formData.checkOutDate}
                                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Any special requirements..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || total <= 0}
                                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${submitting || total <= 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                        }`}
                                >
                                    {submitting ? 'Processing...' : `Pay ₹${total}`}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    🔒 Secure payment via Razorpay
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
