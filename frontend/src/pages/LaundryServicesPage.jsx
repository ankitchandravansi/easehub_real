import { useState, useEffect } from 'react';
import { getAllLaundry } from '../services/services';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

// Dummy data for when backend is unavailable
const DUMMY_LAUNDRY_DATA = [
    {
        _id: '1',
        serviceName: 'Per-KG Plan',
        description: 'Pay only for what you wash - perfect for occasional use',
        pricingType: 'per-kg',
        price: 40,
        turnaroundTime: '24-48 hours',
        features: ['Wash + Dry + Iron', 'Eco-friendly detergents', 'Stain removal', 'Doorstep pickup & delivery']
    },
    {
        _id: '2',
        serviceName: 'Monthly Unlimited',
        description: 'Unlimited laundry for a fixed monthly price',
        pricingType: 'monthly',
        price: 1200,
        turnaroundTime: '24 hours',
        features: ['Unlimited clothes', 'Priority service', 'Free pickup twice a week', 'Express delivery option', 'Premium fabric care']
    },
    {
        _id: '3',
        serviceName: 'Premium Care',
        description: 'Special care for delicate and premium fabrics',
        pricingType: 'per-item',
        price: 80,
        turnaroundTime: '48 hours',
        features: ['Hand wash available', 'Dry cleaning', 'Special fabric treatment', 'Careful handling', 'Quality guarantee']
    }
];

const LaundryServicesPage = () => {
    const [laundryServices, setLaundryServices] = useState(DUMMY_LAUNDRY_DATA);
    const [loading, setLoading] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        serviceId: '',
        pickupDate: '',
        pickupTime: '',
        specialInstructions: ''
    });
    const [selectedService, setSelectedService] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchLaundryServices();
    }, []);

    const fetchLaundryServices = async () => {
        try {
            setLoading(true);
            const response = await getAllLaundry();

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
                setLaundryServices(dataToUse);
            }
        } catch (error) {
            console.log('Using dummy data - backend not available');
            setLaundryServices(DUMMY_LAUNDRY_DATA);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedulePickup = (service) => {
        if (!isAuthenticated) {
            alert('Please login to schedule a pickup');
            return;
        }
        setSelectedService(service);
        setFormData({ ...formData, serviceId: service._id });
        setShowRequestForm(true);
        setTimeout(() => {
            const formElement = document.getElementById('pickup-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert('Please login to create a booking');
            return;
        }

        try {
            console.log('Submitting laundry request:', {
                serviceType: 'Laundry',
                serviceId: selectedService._id,
                serviceName: selectedService.serviceName,
                amount: selectedService.price,
                paymentDetails: {
                    ...formData,
                    pricingType: selectedService.pricingType,
                    turnaroundTime: selectedService.turnaroundTime
                }
            });

            const { createBooking } = await import('../services/bookingService');

            const bookingPayload = {
                serviceType: 'Laundry',
                serviceId: selectedService._id || selectedService.id,
                serviceName: selectedService.serviceName,
                amount: typeof selectedService.price === 'number' && !isNaN(selectedService.price) && selectedService.price > 0 ? selectedService.price : 0,
                paymentDetails: {
                    ...formData,
                    pricingType: selectedService.pricingType,
                    turnaroundTime: selectedService.turnaroundTime
                }
            };

            console.log('📤 Laundry Booking Payload:', bookingPayload);
            const response = await createBooking(bookingPayload);
            console.log('📥 Laundry Booking Response:', response);

            if (response.success && response.data && response.data.bookingId) {
                // Store booking info in sessionStorage for recovery
                sessionStorage.setItem('currentBookingId', response.data.bookingId);
                sessionStorage.setItem('currentBookingAmount', response.data.amount);
                sessionStorage.setItem('currentBookingService', 'Laundry');

                const whatsappNumber = '917765811327';
                const message = `New booking received ✅\nBooking ID: ${response.data.bookingId}\nService: Laundry\nAmount: ₹${response.data.amount}\nStatus: PAYMENT_PENDING`;
                const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappLink, '_blank');

                window.location.href = `/payment/${response.data.bookingId}`;
            } else {
                throw new Error(response.message || 'Invalid response from server');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please logout and login again.');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking. Please try again.';
                alert(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Laundry Pickup & Delivery
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Fast, affordable laundry for students - We pick up, wash, iron & deliver
                    </p>
                </div>
            </section>

            {/* Service Plans */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Choose Your Plan
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {laundryServices.map((service, index) => (
                                <div
                                    key={service._id}
                                    className={`card card-hover transform transition-all duration-300 ${service.pricingType === 'monthly' ? 'lg:scale-105 ring-4 ring-blue-500 shadow-2xl' : ''
                                        }`}
                                >
                                    {/* Recommended Badge */}
                                    {service.pricingType === 'monthly' && (
                                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                                            <span className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-black shadow-xl uppercase tracking-wide">
                                                💎 BEST VALUE
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl text-5xl mb-4 shadow-lg">
                                            {service.pricingType === 'per-kg' ? '⚖️' : service.pricingType === 'monthly' ? '📅' : '👔'}
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {service.serviceName}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8 text-lg">
                                        {service.description}
                                    </p>

                                    {/* Price */}
                                    <div className="text-center mb-8">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-6xl font-black text-gray-900 dark:text-white">
                                                ₹{service.price}
                                            </span>
                                            <span className="text-2xl text-gray-600 dark:text-gray-400 font-semibold">
                                                /{service.pricingType === 'per-kg' ? 'kg' : service.pricingType === 'monthly' ? 'month' : 'item'}
                                            </span>
                                        </div>
                                        {service.pricingType === 'monthly' && (
                                            <p className="text-base text-green-600 dark:text-green-400 mt-3 font-bold">
                                                Save up to 40% vs per-kg pricing!
                                            </p>
                                        )}
                                    </div>

                                    {/* Turnaround Time */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 mb-8 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center justify-center gap-3 text-blue-700 dark:text-blue-300">
                                            <span className="text-3xl">⏱️</span>
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-wide">Turnaround Time</p>
                                                <p className="text-2xl font-black">{service.turnaroundTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {service.features && service.features.length > 0 && (
                                        <ul className="space-y-3 mb-8">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <span className="text-green-500 mt-1 text-xl">✓</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSchedulePickup(service)}
                                        className={`btn w-full text-lg py-4 font-bold ${service.pricingType === 'monthly' ? 'btn-primary shadow-xl' : 'btn-outline'
                                            }`}
                                    >
                                        Schedule Pickup
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Request Form Section */}
                    {showRequestForm && (
                        <div id="pickup-form" className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                                Quick Pickup Request
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            className="input"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            pattern="[0-9]{10}"
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            className="input"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Pickup Address *</label>
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        className="input"
                                        rows="3"
                                        placeholder="Enter your complete address with landmarks..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Preferred Date *</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            required
                                            value={formData.pickupDate}
                                            onChange={handleFormChange}
                                            className="input"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Preferred Time *</label>
                                        <select
                                            name="pickupTime"
                                            required
                                            value={formData.pickupTime}
                                            onChange={handleFormChange}
                                            className="input"
                                        >
                                            <option value="">Select time slot</option>
                                            <option value="morning">Morning (8 AM - 12 PM)</option>
                                            <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                            <option value="evening">Evening (4 PM - 8 PM)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Special Instructions (Optional)</label>
                                    <textarea
                                        name="specialInstructions"
                                        value={formData.specialInstructions}
                                        onChange={handleFormChange}
                                        className="input"
                                        rows="2"
                                        placeholder="Any special care instructions for your clothes..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-full text-lg py-4 font-bold">
                                    Schedule Pickup Now
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                📱
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Schedule Pickup</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Choose your preferred date and time for pickup
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                🚚
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. We Collect</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our team picks up your laundry from your doorstep
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                ✨
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. We Clean</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Professional washing, drying, and ironing
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                🏠
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. We Deliver</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Fresh, clean clothes delivered back to you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl mb-3">🔒</div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">100% Safe</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Secure handling</p>
                        </div>
                        <div>
                            <div className="text-5xl mb-3">⚡</div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">Fast Service</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">24-48 hours</p>
                        </div>
                        <div>
                            <div className="text-5xl mb-3">💯</div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">Quality Assured</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Premium care</p>
                        </div>
                        <div>
                            <div className="text-5xl mb-3">🎯</div>
                            <p className="font-bold text-xl text-gray-900 dark:text-white">On-Time</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Guaranteed delivery</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LaundryServicesPage;
