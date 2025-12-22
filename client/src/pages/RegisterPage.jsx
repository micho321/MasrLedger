import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ArrowRight, User, Mail, Lock, Briefcase, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessType: 'freelancer'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                businessType: formData.businessType,
                role: 'user' // Default role for public registration
            });

            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('masrledger_user', JSON.stringify({ ...user, token }));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Register Card */}
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
                        <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
                        <p className="text-indigo-100">Join 500+ Egyptian freelancers managing their finances</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Business Type Select */}
                        <div>
                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value="freelancer">Freelancer</option>
                                    <option value="micro-business">Micro-Business Owner</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="online-seller">Online Seller</option>
                                </select>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Create Account
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
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                            >
                                Sign in instead
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
