import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPGs } from "../services/services";
import LoadingSpinner from '../components/LoadingSpinner';

const PGListingPage = () => {
    // Initial state setup
    const [pgListings, setPgListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        gender: '',
        minPrice: '',
        maxPrice: ''
    });

    const getPGImage = (pg) => {
        if (pg.images && pg.images.length > 0) {
            return pg.images[0];
        }
        return "/no-image.jpg";
    };

    // Fetch Data - Runs ONCE on mount
    useEffect(() => {
        const fetchPGListings = async () => {
            try {
                setLoading(true);
                const response = await getAllPGs();

                // Robust data extraction
                let dataToUse = [];
                if (response.data && Array.isArray(response.data.data)) {
                    dataToUse = response.data.data;
                } else if (response.data && Array.isArray(response.data.pgs)) { // Handle possible response structure
                    dataToUse = response.data.pgs;
                } else if (Array.isArray(response.data)) {
                    dataToUse = response.data;
                }

                setPgListings(dataToUse);
                setFilteredListings(dataToUse);
                console.log(`Loaded ${dataToUse.length} PGs`);

            } catch (err) {
                console.error("Failed to load PGs:", err);
                setPgListings([]);
                setFilteredListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPGListings();
    }, []);

    // Filter Logic - Runs when filters change
    useEffect(() => {
        let result = [...pgListings];

        // Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(pg =>
                pg.name?.toLowerCase().includes(lowerTerm) ||
                pg.location?.city?.toLowerCase().includes(lowerTerm) ||
                pg.location?.address?.toLowerCase().includes(lowerTerm)
            );
        }

        // Gender
        if (filters.gender) {
            result = result.filter(pg => pg.gender === filters.gender);
        }

        // Price (using 'rent')
        if (filters.minPrice) {
            result = result.filter(pg => (pg.rent || 0) >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            result = result.filter(pg => (pg.rent || 0) <= parseInt(filters.maxPrice));
        }

        setFilteredListings(result);
    }, [searchTerm, filters, pgListings]);

    // Handlers
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ gender: '', minPrice: '', maxPrice: '' });
    };

    // --- RENDER ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <LoadingSpinner size="lg" />
                <p className="ml-4 text-gray-600 dark:text-gray-300">Loading PGs...</p>
            </div>
        );
    }

    // Main UI
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 text-center text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect PG</h1>
                    <p className="text-xl mb-8 opacity-90">Safe, affordable & verified accommodations</p>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by name, city, or area..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-full text-black dark:text-white bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <select name="gender" value={filters.gender} onChange={handleFilterChange} className="input p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="">All Genders</option>
                        <option value="male">Boys</option>
                        <option value="female">Girls</option>
                        <option value="unisex">Co-living</option>
                    </select>
                    <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} className="input p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} className="input p-2 rounded border dark:bg-gray-700 dark:text-white dark:border-gray-600" />

                    <button onClick={clearFilters} className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                        Clear Filters
                    </button>

                    <div className="flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300">
                        {filteredListings.length} Result{filteredListings.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                {filteredListings.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No PGs Found</h2>
                        <p className="text-gray-500">Try adjusting your filters or search term.</p>
                        <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredListings.map((pg, index) => (
                            <div key={pg._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
                                <div className="h-48 bg-gray-300 relative overflow-hidden">
                                    <img
                                        src={getPGImage(pg)}
                                        alt={pg.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/no-image.jpg";
                                        }}
                                    />
                                    <span className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-xs font-bold uppercase shadow">
                                        {pg.gender}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pg.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex items-center">
                                        📍 {pg.location?.address}, {pg.location?.city}
                                    </p>

                                    {/* Price */}
                                    <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Starts from</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                ₹{pg.rent?.toLocaleString() || 'N/A'}
                                            </p>
                                        </div>
                                        <Link to={`/book/${pg._id}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default PGListingPage;
