import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword as resetPasswordService, resendOTP } from '../services/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || '');
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const { otp, newPassword, confirmPassword } = formData;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }

        if (location.state?.message) {
            setSuccess(location.state.message);
        }
    }, [email, navigate, location.state]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'otp') {
            const sanitized = value.replace(/\D/g, '').slice(0, 6);
            setFormData({ ...formData, [name]: sanitized });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setError('');
    };

    const validateForm = () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return false;
        }

        if (!newPassword || !confirmPassword) {
            setError('Please enter and confirm your new password');
            return false;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await resetPasswordService({
                email,
                otp,
                newPassword,
                confirmPassword
            });

            if (response.success) {
                setSuccess(response.message);

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (cooldown > 0) return;

        setResending(true);
        setError('');
        setSuccess('');

        try {
            const response = await resendOTP({ email });

            if (response.success) {
                setSuccess(response.message);
                setCooldown(60);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                        <p className="text-gray-600">
                            Enter the OTP sent to<br />
                            <span className="font-semibold text-gray-800">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-center text-2xl font-semibold tracking-widest"
                                placeholder="000000"
                                disabled={loading}
                                maxLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-2">OTP expires in 5 minutes</p>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="Enter new password (min. 6 characters)"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="Confirm your new password"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="text-center mt-6 space-y-2">
                        <p className="text-gray-600">Didn't receive the OTP?</p>
                        <button
                            onClick={handleResendOTP}
                            disabled={resending || cooldown > 0}
                            className={`text-indigo-600 hover:text-indigo-700 font-semibold ${resending || cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {resending
                                ? 'Resending...'
                                : cooldown > 0
                                    ? `Resend OTP (${cooldown}s)`
                                    : 'Resend OTP'}
                        </button>
                        <div className="pt-2">
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
