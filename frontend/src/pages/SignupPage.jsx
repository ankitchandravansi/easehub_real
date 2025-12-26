import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupService } from '../services/authService';

const SignupPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { name, email, password, confirmPassword } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateForm = () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (password !== confirmPassword) {
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

        try {
            // ✅ SEND ONLY WHAT BACKEND EXPECTS
            const payload = {
                name,
                email,
                password
            };

            const res = await signupService(payload);

            if (res?.success) {
                navigate('/verify-email', {
                    state: { email }
                });
            } else {
                setError(res?.message || 'Signup failed');
            }
        } catch (err) {
            // ✅ INSTANT ERROR (NO 30s TIMEOUT)
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                {error && (
                    <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={name}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
