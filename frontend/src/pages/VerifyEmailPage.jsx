import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail as verifyEmailService, resendOTP } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (!email) {
            navigate('/signup');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp.trim() || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await verifyEmailService({ email, otp });

            if (response.success) {
                login(response.data.user, response.data.token);
                setSuccess('Email verified successfully! Redirecting...');

                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
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

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
                        <p className="text-gray-600">
                            We've sent a 6-digit OTP to<br />
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
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-center text-2xl font-semibold tracking-widest"
                                placeholder="000000"
                                disabled={loading}
                                maxLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-2">OTP expires in 5 minutes</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${loading || otp.length !== 6
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-600 mb-2">Didn't receive the OTP?</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
