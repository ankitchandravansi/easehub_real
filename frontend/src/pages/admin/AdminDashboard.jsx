import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAllBookings } from '../../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalPGs: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0, confirmedBookings: 0, pendingBookings: 0 });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                getDashboardStats(),
                getAllBookings()
            ]);

            // Handle PG Data
            let pgCount = 0;
            if (statsRes.data && typeof statsRes.data.totalPGs === 'number') {
                pgCount = statsRes.data.totalPGs;
            }

            // Handle Booking Data
            let bookingList = [];
            if (bookingsRes.data && bookingsRes.data.data) {
                bookingList = bookingsRes.data.data;
            }

            setBookings(bookingList);
            setStats(statsRes.data || { totalPGs: 0, totalBookings: 0, totalUsers: 0, totalRevenue: 0, confirmedBookings: 0, pendingBookings: 0 });

        } catch (err) {
            console.error("Dashboard Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-600 dark:text-gray-400">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-10">Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">TOTAL PGs</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-3">{stats.pgs}</p>
                        <Link to="/admin/pgs" className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">View All PGs →</Link>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">TOTAL BOOKINGS</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-3">{stats.bookings}</p>
                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">Recent activity</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">USERS</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-3">{stats.users}</p>
                        <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">Registered users</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Bookings</h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">PG</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{booking.user?.name || 'Unknown'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.pg?.name || 'Unknown PG'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{new Date(booking.moveInDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No bookings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
