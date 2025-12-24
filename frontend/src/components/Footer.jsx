import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-xl font-bold text-gradient">EaseHub</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your one-stop solution for all college student services. Manage PG/Hostel, Meals, Laundry, and more from a single platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li><Link to="/services/pg" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">PG/Hostel</Link></li>
                            <li><Link to="/services/meals" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Meal Plans</Link></li>
                            <li><Link to="/services/laundry" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Laundry</Link></li>
                            <li><Link to="/services/extra" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Extra Services</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/#about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">About Us</Link></li>
                            <li><Link to="/#contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Contact</Link></li>
                            <li><Link to="/#faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} EaseHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
