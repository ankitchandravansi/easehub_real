import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ExtraServicesPage = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        serviceType: '',
        description: '',
        urgency: 'normal',
        preferredDate: '',
        preferredTime: '',
        contactNumber: '',
        address: ''
    });
    const { isAuthenticated } = useAuth();

    const services = [
        {
            id: 'room-cleaning',
            icon: '🧹',
            title: 'Room Cleaning',
            description: 'Professional deep cleaning service for your room',
            price: '₹300 - ₹500'
        },
        {
            id: 'water-can',
            icon: '💧',
            title: 'Water Can Delivery',
            description: '20L water can delivery to your doorstep',
            price: '₹40 - ₹60'
        },
        {
            id: 'electrician',
            icon: '⚡',
            title: 'Electrician Service',
            description: 'Electrical repairs and installations',
            price: '₹200 - ₹800'
        },
        {
            id: 'plumber',
            icon: '🔧',
            title: 'Plumber Service',
            description: 'Plumbing repairs and maintenance',
            price: '₹250 - ₹1000'
        },
        {
            id: 'internet-setup',
            icon: '📡',
            title: 'Internet Setup',
            description: 'WiFi router installation and configuration',
            price: '₹300 - ₹600'
        },
        {
            id: 'furniture-assembly',
            icon: '🪑',
            title: 'Furniture Assembly',
            description: 'Assembly and installation of furniture',
            price: '₹200 - ₹500'
        },
        {
            id: 'pest-control',
            icon: '🐛',
            title: 'Pest Control',
            description: 'Professional pest control services',
            price: '₹400 - ₹1200'
        },
        {
            id: 'ac-repair',
            icon: '❄️',
            title: 'AC Repair & Service',
            description: 'Air conditioner repair and maintenance',
            price: '₹350 - ₹1500'
        },
        {
            id: 'custom',
            icon: '✨',
            title: 'Custom Request',
            description: 'Any other service you need',
            price: 'Variable'
        }
    ];

    const handleRequestService = (service) => {
        if (!isAuthenticated) {
            alert('Please login to request a service');
            return;
        }
        setSelectedService(service);
        setFormData({ ...formData, serviceType: service.title });
        setShowRequestForm(true);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Service request submitted for ${selectedService.title}! We'll contact you shortly.`);
        setShowRequestForm(false);
        setSelectedService(null);
        setFormData({
            serviceType: '',
            description: '',
            urgency: 'normal',
            preferredDate: '',
            preferredTime: '',
            contactNumber: '',
            address: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Request Extra Services
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Everything beyond PG & meals, in one place - From room cleaning to repairs
                    </p>
                </div>
            </section>

            {/* Service Tiles */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Choose a Service
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="card card-hover group cursor-pointer bg-white dark:bg-gray-800 transform transition-all duration-300 hover:scale-105"
                                onClick={() => handleRequestService(service)}
                            >
                                {/* Icon */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl text-6xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {service.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-base">
                                    {service.description}
                                </p>

                                {/* Price */}
                                <div className="text-center mb-6">
                                    <span className="px-5 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-full text-base font-bold border border-purple-200 dark:border-purple-800">
                                        {service.price}
                                    </span>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRequestService(service);
                                    }}
                                    className="btn btn-primary w-full text-lg py-3 font-bold group-hover:shadow-xl"
                                >
                                    Request Service
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Request Form Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Need Something Else?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Submit a custom service request and we'll connect you with the right professional
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="label">Service Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="input"
                                    rows="4"
                                    placeholder="Describe what service you need in detail..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        required
                                        pattern="[0-9]{10}"
                                        value={formData.contactNumber}
                                        onChange={handleFormChange}
                                        className="input"
                                        placeholder="10-digit mobile number"
                                    />
                                </div>

                                <div>
                                    <label className="label">Urgency Level *</label>
                                    <select
                                        name="urgency"
                                        required
                                        value={formData.urgency}
                                        onChange={handleFormChange}
                                        className="input"
                                    >
                                        <option value="normal">Normal (2-3 days)</option>
                                        <option value="urgent">Urgent (24 hours)</option>
                                        <option value="emergency">Emergency (Same day)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Service Address *</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    className="input"
                                    rows="3"
                                    placeholder="Enter complete address with landmarks..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Preferred Date</label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleFormChange}
                                        className="input"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="label">Preferred Time</label>
                                    <select
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleFormChange}
                                        className="input"
                                    >
                                        <option value="">Any time</option>
                                        <option value="morning">Morning (8 AM - 12 PM)</option>
                                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                        <option value="evening">Evening (4 PM - 8 PM)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                    <strong>Note:</strong> Our team will contact you within 2 hours to confirm the service details and provide an exact quote.
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary w-full text-lg py-4 font-bold">
                                Submit Custom Request
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
                        Why Choose Our Services?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                ✅
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                Verified Professionals
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                All service providers are background-verified and trained
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                💰
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                Transparent Pricing
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No hidden charges, clear pricing before service
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl text-5xl mb-6 shadow-lg">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                Quick Response
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Fast response time and same-day service available
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Request Form Modal */}
            {showRequestForm && selectedService && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">{selectedService.icon}</span>
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {selectedService.title}
                                    </h3>
                                    <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                                        {selectedService.price}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRequestForm(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="label">Service Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="input"
                                    rows="4"
                                    placeholder="Describe what you need in detail..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Urgency Level *</label>
                                    <select
                                        name="urgency"
                                        required
                                        value={formData.urgency}
                                        onChange={handleFormChange}
                                        className="input"
                                    >
                                        <option value="normal">Normal (2-3 days)</option>
                                        <option value="urgent">Urgent (24 hours)</option>
                                        <option value="emergency">Emergency (Same day)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        required
                                        pattern="[0-9]{10}"
                                        value={formData.contactNumber}
                                        onChange={handleFormChange}
                                        className="input"
                                        placeholder="10-digit mobile number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Preferred Date</label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleFormChange}
                                        className="input"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="label">Preferred Time</label>
                                    <select
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleFormChange}
                                        className="input"
                                    >
                                        <option value="">Any time</option>
                                        <option value="morning">Morning (8 AM - 12 PM)</option>
                                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                        <option value="evening">Evening (4 PM - 8 PM)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Service Address *</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    className="input"
                                    rows="3"
                                    placeholder="Enter complete address with landmarks..."
                                ></textarea>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                    <strong>Note:</strong> Our team will contact you within 2 hours to confirm the service details and provide an exact quote.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRequestForm(false)}
                                    className="btn btn-outline flex-1 text-lg py-3"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1 text-lg py-3">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExtraServicesPage;
