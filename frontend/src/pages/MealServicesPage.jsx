import { useState, useEffect } from 'react';
import { getAllMeals } from '../services/services';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

// Dummy data for when backend is unavailable
const DUMMY_MEAL_DATA = [
    {
        _id: '1',
        planName: 'Basic Plan',
        description: 'Essential meals for students on a budget',
        category: 'veg',
        planType: 'monthly',
        price: 3500,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['2 meals per day', 'Home-style cooking', 'Unlimited rice & roti', 'Weekly menu rotation']
    },
    {
        _id: '2',
        planName: 'Standard Plan',
        description: 'Complete nutrition with variety',
        category: 'veg',
        planType: 'monthly',
        price: 4500,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['3 meals per day', 'Fresh vegetables', 'Weekly special dishes', 'Customizable menu', 'Free delivery']
    },
    {
        _id: '3',
        planName: 'Premium Plan',
        description: 'Gourmet meals with premium ingredients',
        category: 'both',
        planType: 'monthly',
        price: 6000,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['3 meals + snacks', 'Veg & Non-veg options', 'Premium ingredients', 'Chef special weekly', 'Personalized diet plans']
    },
    {
        _id: '4',
        planName: 'Non-Veg Delight',
        description: 'For chicken and egg lovers',
        category: 'non-veg',
        planType: 'monthly',
        price: 5500,
        meals: { breakfast: true, lunch: true, dinner: true },
        features: ['Chicken 4 days/week', 'Eggs daily', 'Fish twice a week', 'Home-style cooking', 'Hygienic preparation']
    },
    {
        _id: '5',
        planName: 'Daily Veg Meal',
        description: 'Pay per day, no commitment',
        category: 'veg',
        planType: 'daily',
        price: 150,
        meals: { breakfast: false, lunch: true, dinner: true },
        features: ['2 meals included', 'No monthly commitment', 'Fresh daily', 'Cancel anytime']
    },
    {
        _id: '6',
        planName: 'Breakfast Special',
        description: 'Start your day right',
        category: 'veg',
        planType: 'monthly',
        price: 1500,
        meals: { breakfast: true, lunch: false, dinner: false },
        features: ['Healthy breakfast', 'Variety of options', 'Fresh juice included', 'Early delivery']
    }
];

const MealServicesPage = () => {
    const [mealPlans, setMealPlans] = useState(DUMMY_MEAL_DATA);
    const [filteredPlans, setFilteredPlans] = useState(DUMMY_MEAL_DATA);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchMealPlans();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedCategory, mealPlans]);

    const fetchMealPlans = async () => {
        try {
            setLoading(true);
            const response = await getAllMeals();
            // Standardize data from backend structure { success: true, data: [...] }
            let dataToUse = [];

            if (response.data && response.data.data) {
                dataToUse = response.data.data;
            } else if (Array.isArray(response.data)) {
                dataToUse = response.data;
            } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                dataToUse = response.data.data;
            }

            if (dataToUse.length > 0) {
                setMealPlans(dataToUse);
                // We don't verify against dummy data length, if backend sends 1 plan, we show 1 plan.
                setFilteredPlans(dataToUse);
            }
        } catch (error) {
            console.log('Using dummy data - backend not available');
            setMealPlans(DUMMY_MEAL_DATA);
            setFilteredPlans(DUMMY_MEAL_DATA);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (selectedCategory === 'all') {
            setFilteredPlans(mealPlans);
        } else {
            setFilteredPlans(mealPlans.filter(plan => plan.category === selectedCategory || plan.category === 'both'));
        }
    };

    const handleSubscribe = (plan) => {
        if (!isAuthenticated) {
            alert('Please login to subscribe to a meal plan');
            return;
        }
        alert(`Subscribing to ${plan.planName}. Redirecting to payment...`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Healthy & Affordable Meal Plans
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Daily & monthly food plans for students - Fresh, hygienic, and home-cooked
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${selectedCategory === 'all'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            All Plans
                        </button>
                        <button
                            onClick={() => setSelectedCategory('veg')}
                            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${selectedCategory === 'veg'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            🥗 Vegetarian
                        </button>
                        <button
                            onClick={() => setSelectedCategory('non-veg')}
                            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${selectedCategory === 'non-veg'
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            🍗 Non-Vegetarian
                        </button>
                    </div>
                </div>
            </section>

            {/* Meal Plans */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPlans.map((plan, index) => (
                                <div
                                    key={plan._id}
                                    className={`card card-hover relative transform transition-all duration-300 ${index === 1 ? 'lg:scale-105 ring-4 ring-green-500 shadow-2xl' : ''
                                        }`}
                                >
                                    {/* Best Value Badge */}
                                    {index === 1 && (
                                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                                            <span className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full text-sm font-black shadow-xl uppercase tracking-wide">
                                                ⭐ MOST POPULAR
                                            </span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="flex justify-between items-start mb-6">
                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${plan.category === 'veg'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : plan.category === 'non-veg'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                }`}
                                        >
                                            {plan.category === 'veg' ? '🥗 Veg' : plan.category === 'non-veg' ? '🍗 Non-Veg' : '🍽️ Both'}
                                        </span>
                                        <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200 dark:border-green-800">
                                            {plan.planType}
                                        </span>
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                        {plan.planName}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                                        {plan.description}
                                    </p>

                                    {/* Meal Times */}
                                    <div className="space-y-3 mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-3 h-3 rounded-full ${plan.meals.breakfast ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className={`text-base font-semibold ${plan.meals.breakfast ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                                                🌅 Breakfast
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-3 h-3 rounded-full ${plan.meals.lunch ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className={`text-base font-semibold ${plan.meals.lunch ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                                                ☀️ Lunch
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-3 h-3 rounded-full ${plan.meals.dinner ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className={`text-base font-semibold ${plan.meals.dinner ? 'text-gray-900 dark:text-white' : 'text-gray-400 line-through'}`}>
                                                🌙 Dinner
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {plan.features && plan.features.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">What's Included:</h4>
                                            <ul className="space-y-2">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                        <span className="text-green-500 mt-0.5 text-lg">✓</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                                        <div className="flex items-baseline gap-2 justify-center">
                                            <span className="text-5xl font-black text-gray-900 dark:text-white">
                                                ₹{plan.price}
                                            </span>
                                            <span className="text-xl text-gray-600 dark:text-gray-400 font-semibold">
                                                /{plan.planType === 'daily' ? 'day' : plan.planType === 'weekly' ? 'week' : 'month'}
                                            </span>
                                        </div>
                                        {plan.planType === 'monthly' && (
                                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center font-medium">
                                                ≈ ₹{Math.round(plan.price / 30)}/day
                                            </p>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        className={`btn w-full text-lg py-4 font-bold ${index === 1 ? 'btn-primary shadow-xl' : 'btn-outline'
                                            }`}
                                    >
                                        Subscribe Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Why Choose Our Meal Plans?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                🏠
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Home-Style Cooking</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Authentic home-cooked meals prepared with love and care
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                🥗
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Fresh Ingredients</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We use only fresh, quality ingredients sourced daily
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                💰
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Affordable Pricing</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Budget-friendly plans designed for students
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                🚚
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">On-Time Delivery</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Meals delivered fresh and right on schedule
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MealServicesPage;
