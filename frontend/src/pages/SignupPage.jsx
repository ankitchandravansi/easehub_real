import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

export default function SignupPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = form;

        if (!name || !email || !password || !confirmPassword) {
            return setError('All fields are required');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const res = await signup({ name, email, password });

            if (res.success) {
                navigate('/verify-email', { state: { email } });
            } else {
                setError(res.message || 'Signup failed');
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Server error. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                {error && (
                    <div className="mb-4 text-red-600 bg-red-50 border px-3 py-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" />

                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
                        {loading ? 'Creating...' : 'Sign Up'}
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
}
