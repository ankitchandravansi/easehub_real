import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        const bannerDismissed = localStorage.getItem('earlyUserBannerDismissed');
        if (bannerDismissed) {
            setShowBanner(false);
        }
    }, []);

    const dismissBanner = () => {
        localStorage.setItem('earlyUserBannerDismissed', 'true');
        setShowBanner(false);
    };

    const services = [
        {
            icon: '🏠',
            title: 'PG/Hostel',
            description: 'Find verified, safe, and affordable accommodations near your college',
            features: ['Verified listings', '24/7 security', 'Modern amenities', 'Flexible pricing'],
            gradient: 'from-blue-600 to-cyan-600',
            link: '/services/pg'
        },
        {
            icon: '🍽️',
            title: 'Meal Plans',
            description: 'Healthy, home-cooked meals delivered fresh to your doorstep',
            features: ['Daily & monthly plans', 'Veg & non-veg options', 'Fresh ingredients', 'On-time delivery'],
            gradient: 'from-green-600 to-emerald-600',
            link: '/services/meals'
        },
        {
            icon: '👕',
            title: 'Laundry Service',
            description: 'Hassle-free laundry pickup, wash, iron, and delivery',
            features: ['Doorstep pickup', 'Fast turnaround', 'Premium care', 'Affordable pricing'],
            gradient: 'from-purple-600 to-pink-600',
            link: '/services/laundry'
        },
        {
            icon: '⚡',
            title: 'Extra Services',
            description: 'From room cleaning to repairs - everything you need',
            features: ['Verified professionals', 'Quick response', 'Transparent pricing', 'Quality assured'],
            gradient: 'from-orange-600 to-red-600',
            link: '/services/extra'
        }
    ];

    const steps = [
        { icon: '📱', title: 'Browse Services', description: 'Explore our range of student-focused services' },
        { icon: '✅', title: 'Select & Request', description: 'Choose what you need and submit your request' },
        { icon: '🤝', title: 'Get Matched', description: 'We connect you with verified service providers' },
        { icon: '🎉', title: 'Enjoy Convenience', description: 'Sit back and let us handle the rest' }
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Engineering Student',
            avatar: '👩',
            rating: 5,
            text: 'EaseHub made my college life so much easier! No more worrying about meals or laundry.'
        },
        {
            name: 'Rahul Verma',
            role: 'MBA Student',
            avatar: '👨',
            rating: 5,
            text: 'Found an amazing PG through EaseHub. The verification process gave me peace of mind.'
        },
        {
            name: 'Ananya Patel',
            role: 'Medical Student',
            avatar: '👩',
            rating: 5,
            text: 'The meal plans are perfect for my busy schedule. Fresh, healthy, and always on time!'
        }
    ];

    const faqs = [
        {
            question: 'How does EaseHub work?',
            answer: 'EaseHub connects students with verified service providers for PG/Hostel, meals, laundry, and other essential services. Simply browse, select, and request - we handle the rest!'
        },
        {
            question: 'Is EaseHub free to use?',
            answer: 'Yes! Creating an account and browsing services is completely free. You only pay for the services you use.'
        },
        {
            question: 'Are all service providers verified?',
            answer: 'Absolutely! We thoroughly verify all service providers to ensure safety, quality, and reliability for our students.'
        },
        {
            question: 'What cities is EaseHub available in?',
            answer: 'We are currently available in major college cities across India and expanding rapidly. Check our services page for your city!'
        }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Light mode gradient - hidden in dark mode */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:opacity-0"></div>
                {/* Dark mode gradient - hidden in light mode */}
                <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
                {/* Animated blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Early User Banner */}
            {showBanner && (
                <div className="relative z-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎉</span>
                            <span className="font-bold">Early users get priority support</span>
                        </div>
                        <button
                            onClick={dismissBanner}
                            className="text-white/80 hover:text-white text-2xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
                            Your College Life,
                        </span>
                        <br />
                        <span className="text-gray-900 dark:text-white">Simplified</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        From finding the perfect PG to getting fresh meals delivered - EaseHub handles all your essential services in one place
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/signup"
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                        >
                            <span className="relative z-10">Get Started Free</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                        <Link
                            to="/services/pg"
                            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm"
                        >
                            Explore Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Everything You Need
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">All essential student services in one platform</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`group relative bg-white dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-2xl hover:shadow-${service.gradient.split('-')[1]}-500/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {service.icon}
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{service.description}</p>

                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                <span className="text-green-400 text-xl">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={service.link}
                                        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${service.gradient} rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:translate-x-2`}
                                    >
                                        Explore {service.title}
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                How It Works
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Get started in 4 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                                )}

                                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                                    {step.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                What Students Say
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">Trusted by thousands of students</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                    ))}
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{testimonial.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-8 py-6 text-left flex justify-between items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700/20 transition-colors duration-200"
                                >
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{faq.question}</span>
                                    <span className={`text-2xl transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-48' : 'max-h-0'}`}>
                                    <p className="px-8 pb-6 text-gray-700 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl shadow-purple-500/50">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
                            Ready to Simplify Your College Life?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who trust EaseHub for their daily needs
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                        >
                            Get Started Free →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
