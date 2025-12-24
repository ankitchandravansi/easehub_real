import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MailCheck, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [resending, setResending] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error('Enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/verify-email', { email, otp });
            toast.success('Email verified successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await api.post('/auth/resend-otp', { email });
            toast.success('New code sent to your email');
            setTimeLeft(60);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4">
            <div className="max-w-md w-full animate-in zoom-in duration-500">
                <div className="bg-[#1E293B] p-10 rounded-3xl shadow-2xl border border-slate-700 text-center">
                    <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <MailCheck className="text-emerald-400 w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-slate-400 mb-8 px-4">
                        We've sent a 6-digit verification code to <br />
                        <span className="text-indigo-400 font-medium">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-[#0F172A] border-2 border-slate-700 text-white text-3xl font-bold tracking-[0.5em] text-center rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Verify Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10">
                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0 || resending}
                            className={`flex items-center justify-center gap-2 mx-auto text-sm font-bold transition-colors ${timeLeft > 0 || resending ? 'text-slate-600' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {resending ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend Verification Code'}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-500 text-xs">
                    Didn't receive the email? Check your spam folder or contact support.
                </p>
            </div>
        </div>
    );
};

export default OTPVerificationPage;
