import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const { token, user } = response.data.data;
                // Save user session
                localStorage.setItem('masrledger_user', JSON.stringify({ ...user, token }));

                // Redirect based on role
                if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (user.role === 'accountant') {
                    navigate('/accountant-dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Logo and Back to Home */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-4">
                        <BookOpen className="w-8 h-8" />
                        <span className="text-2xl font-bold">MasrLedger</span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-indigo-100">Sign in to your MasrLedger account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New to MasrLedger?</span>
                            </div>
                        </div>

                        {/* Create Account Link */}
                        <div className="text-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                            >
                                Create an account
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    © 2025 MasrLedger. Tailored for the Egyptian market.
                </p>
            </div>
        </div>
    );
}
