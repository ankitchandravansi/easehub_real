import { useState } from 'react';
import { Link } from 'react-router-dom';

const RequestsPage = () => {
    const [filter, setFilter] = useState('all');

    const requests = [
        {
            id: '1',
            service: 'PG/Hostel',
            title: 'Green Valley PG - Single Room',
            status: 'pending',
            date: '2024-01-15',
            amount: 8500,
            description: 'Requested single room with AC and WiFi',
            icon: '🏠',
            gradient: 'from-blue-600 to-cyan-600'
        },
        {
            id: '2',
            service: 'Meals',
            title: 'Standard Meal Plan',
            status: 'active',
            date: '2024-01-10',
            amount: 4500,
            description: 'Monthly meal plan with 3 meals per day',
            icon: '🍽️',
            gradient: 'from-green-600 to-emerald-600'
        },
        {
            id: '3',
            service: 'Laundry',
            title: 'Monthly Unlimited Plan',
            status: 'active',
            date: '2024-01-08',
            amount: 1200,
            description: 'Unlimited laundry service for the month',
            icon: '👕',
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            id: '4',
            service: 'Extra Services',
            title: 'Room Cleaning Service',
            status: 'completed',
            date: '2024-01-05',
            amount: 400,
            description: 'Deep cleaning of room and bathroom',
            icon: '⚡',
            gradient: 'from-orange-600 to-red-600'
        },
        {
            id: '5',
            service: 'Extra Services',
            title: 'Electrician Service',
            status: 'completed',
            date: '2024-01-03',
            amount: 350,
            description: 'Fixed electrical wiring issue',
            icon: '⚡',
            gradient: 'from-orange-600 to-red-600'
        },
        {
            id: '6',
            service: 'Laundry',
            title: 'Per-KG Plan',
            status: 'cancelled',
            date: '2023-12-28',
            amount: 120,
            description: 'Cancelled due to change in plans',
            icon: '👕',
            gradient: 'from-purple-600 to-pink-600'
        }
    ];

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(req => req.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
            case 'active':
                return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
        }
    };

    const statusCounts = {
        all: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        active: requests.filter(r => r.status === 'active').length,
        completed: requests.filter(r => r.status === 'completed').length,
        cancelled: requests.filter(r => r.status === 'cancelled').length
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            My Requests
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Track all your service requests in one place
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700 inline-flex gap-2 flex-wrap">
                    {['all', 'pending', 'active', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${filter === status
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No {filter !== 'all' ? filter : ''} requests found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {filter === 'all'
                                ? 'Start by requesting a service from our catalog'
                                : `You don't have any ${filter} requests`}
                        </p>
                        <Link
                            to="/services/pg"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300"
                        >
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${request.gradient} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}>
                                        {request.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                {request.service}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(request.status)}`}>
                                                {request.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {request.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {request.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <span className="text-lg">📅</span>
                                                <span className="font-semibold">
                                                    {new Date(request.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <span className="text-lg">💰</span>
                                                <span className="font-bold text-xl text-gray-900 dark:text-white">
                                                    ₹{request.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col gap-3 justify-end">
                                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            View Details
                                        </button>
                                        {request.status === 'pending' && (
                                            <button className="px-6 py-3 border-2 border-red-500 text-red-500 dark:text-red-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;
