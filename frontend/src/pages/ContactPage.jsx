import { useRef, useEffect } from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const ContactPage = () => {
    // 3D Tilt Effect on cards
    const cardRefs = useRef([]);
    const sectionRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            cardRefs.current.forEach((card) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        };

        const resetTransform = () => {
            cardRefs.current.forEach((card) => {
                if (card) card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        };

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('mousemove', handleMouseMove);
            section.addEventListener('mouseleave', resetTransform);
        }

        return () => {
            if (section) {
                section.removeEventListener('mousemove', handleMouseMove);
                section.removeEventListener('mouseleave', resetTransform);
            }
        }
    }, []);

    // Add cards to ref
    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                        We're here to help you with any questions or support you need. Reach out to us anytime.
                    </p>
                </div>
            </section>

            {/* Contact Cards Section */}
            <section ref={sectionRef} className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">

                {/* Phone Card */}
                <div ref={addToRefs} className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Call Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">We are available 24/7 for your assistance.</p>

                        <a href="tel:+916201614778" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">
                            +91 62016 14778
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                            Support Hotline
                        </span>
                    </div>
                </div>

                {/* Email Card */}
                <div ref={addToRefs} className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-default">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Email Us</h3>
                        <p className="text-gray-600 dark:text-gray-300">Drop us a line and we'll get back to you asap.</p>

                        <a href="mailto:easehub.team@gmail.com" className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform inline-block break-all">
                            easehub.team@gmail.com
                        </a>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                            General Inquiry
                        </span>
                    </div>
                </div>

            </section>

            {/* Additional Info / Footer decorative */}
            <div className="max-w-4xl mx-auto mt-20 px-4 text-center">
                <div className="inline-flex items-center justify-center space-x-2 text-gray-400 dark:text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Serving students across Bhilai & Durg</span>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
