import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingService';

const AdminBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', serviceType: '' });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings(filter);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bookingId) => {
        if (!confirm('Mark this booking as PAID?')) return;

        try {
            await updateBookingStatus(bookingId, 'PAID');
            fetchBookings();
            alert('Booking approved successfully');
        } catch (error) {
            console.error('Error approving booking:', error);
            alert('Failed to approve booking');
        }
    };

    const handleReject = async (bookingId) => {
        if (!confirm('Reject this booking?')) return;

        try {
            await updateBookingStatus(bookingId, 'CANCELLED');
            fetchBookings();
            alert('Booking rejected');
        } catch (error) {
            console.error('Error rejecting booking:', error);
            alert('Failed to reject booking');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            CREATED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Admin - Booking Management
                    </h1>

                    {/* Quick Filters */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setFilter({ status: '', serviceType: '' })}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${!filter.status ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter({ ...filter, status: 'PAYMENT_PENDING' })}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${filter.status === 'PAYMENT_PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter({ ...filter, status: 'PAID' })}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${filter.status === 'PAID' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            Paid
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 mb-8">
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Status</option>
                            <option value="CREATED">Created</option>
                            <option value="PAYMENT_PENDING">Payment Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        <select
                            value={filter.serviceType}
                            onChange={(e) => setFilter({ ...filter, serviceType: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Services</option>
                            <option value="PG">PG</option>
                            <option value="Meal">Meal</option>
                            <option value="Laundry">Laundry</option>
                            <option value="Extra">Extra</option>
                        </select>

                        <button
                            onClick={fetchBookings}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Refresh
                        </button>
                    </div>

                    {/* Bookings Table */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No bookings found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Service</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Booking ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">UTR</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Screenshot</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                {booking.userId?.name || 'N/A'}
                                                <br />
                                                <span className="text-xs text-gray-500">{booking.userId?.email}</span>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <span className="font-medium text-gray-900 dark:text-white">{booking.serviceName}</span>
                                                <br />
                                                <span className="text-xs text-gray-500">{booking.serviceType}</span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                                ₹{booking.amount}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-mono text-indigo-600 dark:text-indigo-400">
                                                {booking.bookingId}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">
                                                {booking.utr || '-'}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {booking.proofImage ? (
                                                    <button
                                                        onClick={() => setSelectedImage(`http://localhost:10000${booking.proofImage}`)}
                                                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {booking.status === 'PAYMENT_PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(booking._id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs font-bold"
                                                        >
                                                            ✅ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking._id)}
                                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs font-bold"
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-4xl w-full">
                        <img
                            src={selectedImage}
                            alt="Payment Proof"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookingsPage;
