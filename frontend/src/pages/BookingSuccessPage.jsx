import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BookingSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, pg } = location.state || {};

    useEffect(() => {
        if (!booking) {
            navigate('/');
        }
    }, [booking, navigate]);

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-8">
                        Your booking has been confirmed. We've sent the details to your email.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                        <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Property:</span>
                                <span className="font-medium">{pg?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Check-in:</span>
                                <span className="font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Check-out:</span>
                                <span className="font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-medium text-green-600">₹{booking.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booking ID:</span>
                                <span className="font-medium text-xs">{booking._id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/dashboard"
                            className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold"
                        >
                            View My Bookings
                        </Link>
                        <Link
                            to="/services/pg"
                            className="block w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
                        >
                            Browse More PGs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
