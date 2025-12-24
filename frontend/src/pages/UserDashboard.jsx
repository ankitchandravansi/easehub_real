import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeRequests: 3,
        completedRequests: 12,
        totalSpent: 15420
    });

    const recentRequests = [
        {
            id: '1',
            service: 'PG/Hostel',
            title: 'Green Valley PG - Single Room',
            status: 'pending',
            date: '2024-01-15',
            amount: 8500
        },
        {
            id: '2',
            service: 'Meals',
            title: 'Standard Meal Plan',
            status: 'active',
            date: '2024-01-10',
            amount: 4500
        },
        {
            id: '3',
            service: 'Laundry',
            title: 'Monthly Unlimited Plan',
            status: 'active',
            date: '2024-01-08',
            amount: 1200
        }
    ];

    const quickActions = [
        { icon: '🏠', title: 'Find PG', link: '/services/pg', gradient: 'from-blue-600 to-cyan-600' },
        { icon: '🍽️', title: 'Order Meals', link: '/services/meals', gradient: 'from-green-600 to-emerald-600' },
        { icon: '👕', title: 'Book Laundry', link: '/services/laundry', gradient: 'from-purple-600 to-pink-600' },
        { icon: '⚡', title: 'Request Service', link: '/services/extra', gradient: 'from-orange-600 to-red-600' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
            case 'active':
                return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                        Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.name || 'Student'}</span>!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Manage all your services from one place
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                                ⏳
                            </div>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{stats.activeRequests}</span>
                        </div>
                        <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Active Requests</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                                ✅
                            </div>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{stats.completedRequests}</span>
                        </div>
                        <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Completed</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                                💰
                            </div>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">₹{stats.totalSpent.toLocaleString()}</span>
                        </div>
                        <h3 className="text-gray-600 dark:text-gray-400 font-semibold">Total Spent</h3>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.link}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {action.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{action.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Requests */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Requests</h2>
                        <Link
                            to="/requests"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                {request.service}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {request.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Requested on {new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                                            ₹{request.amount.toLocaleString()}
                                        </p>
                                        <Link
                                            to={`/requests/${request.id}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
