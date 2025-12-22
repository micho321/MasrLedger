import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    ArrowRight,
    Calendar,
    DollarSign,
    FileText,
    LogOut,
    X,
    Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        income: 0,
        expense: 0,
        balance: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [currentUser, setCurrentUser] = useState({ fullName: 'User', businessType: 'freelancer' });
    const [showAddTransaction, setShowAddTransaction] = useState(false);

    // Tax Estimate State (for the report modal)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [taxData, setTaxData] = useState({
        amount: 0,
        bracket: '0%',
        dueDate: '2026-03-31'
    });

    // Fetch Dashboard Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get User Info
                const savedUser = localStorage.getItem('masrledger_user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    setCurrentUser({
                        fullName: parsed.username || 'User',
                        businessType: parsed.businessType || 'freelancer'
                    });
                }

                // Fetch Summary
                const summaryRes = await api.get('/summary/monthly');
                if (summaryRes.data.success) {
                    const { totalIncome, totalExpense, netIncome } = summaryRes.data.data.summary;
                    setSummary({
                        income: totalIncome,
                        expense: totalExpense,
                        balance: netIncome
                    });

                    // Simple tax calc for the state (could also fetch from /summary/tax)
                    setTaxData({
                        amount: totalIncome * 0.025,
                        bracket: '2.5%',
                        dueDate: '2026-03-31'
                    });
                }

                // Fetch Recent Transactions
                const txRes = await api.get('/transactions');
                if (txRes.data.success) {
                    setRecentTransactions(txRes.data.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('masrledger_user');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Header - Merged with User's Design Language */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {currentUser.fullName}! 👋
                    </h1>
                    <p className="text-gray-600">Here's your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Income */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Recorded
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {summary.income.toLocaleString()}</p>
                </div>

                {/* Total Expenses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            Recorded
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">EGP {summary.expense.toLocaleString()}</p>
                </div>

                {/* Current Balance */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm text-indigo-100 mb-1">Current Balance</p>
                    <p className="text-2xl font-bold">EGP {summary.balance.toLocaleString()}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* For now, linking to Transactions Page for Adding */}
                <Link to="/transactions" className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all group block">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                            <Plus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Add Transaction</p>
                            <p className="text-sm text-gray-600">Record income or expense</p>
                        </div>
                    </div>
                </Link>

                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">View Summary</p>
                            <p className="text-sm text-gray-600">Monthly reports & tax</p>
                        </div>
                    </div>
                </button>

                <Link to="/requests" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all block">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Request Accountant</p>
                            <p className="text-sm text-gray-600">Get expert help</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <Link to="/transactions" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((tx) => (
                            <div key={tx._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${tx.type === 'income'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                        }`}>
                                        <DollarSign className={`w-5 h-5 ${tx.type === 'income'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{tx.title || 'Untitled'}</p>
                                        <p className="text-sm text-gray-500 capitalize">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${tx.type === 'income'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}>
                                        {tx.type === 'income' ? '+' : ''} EGP {tx.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No recent transactions found. Start by adding one!
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Report Modal - Unified Square Card */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md aspect-square flex flex-col p-10 relative animate-scale-in">
                        {/* Integrated X Button */}
                        <button
                            onClick={() => setIsReportModalOpen(false)}
                            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex-1 flex flex-col justify-between">
                            {/* Title Section */}
                            <div className="text-center mt-4">
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">Tax Summary</h2>
                                <p className="text-gray-500 font-medium">Monthly Financial Estimate</p>
                            </div>

                            {/* Main Stat */}
                            <div className="text-center py-6">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2">Estimated Tax Due</p>
                                <div className="text-6xl font-black text-indigo-600 flex items-baseline justify-center">
                                    <span className="text-2xl font-bold mr-1">EGP</span>
                                    {taxData.amount.toLocaleString()}
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="text-gray-500 text-sm font-semibold">Taxable Income</span>
                                    <span className="text-gray-900 font-bold">EGP {summary.income.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="text-gray-500 text-sm font-semibold">Tax Bracket</span>
                                    <span className="text-indigo-600 font-bold">{taxData.bracket}</span>
                                </div>
                            </div>

                            {/* Primary Action - The "Close" button inside the square */}
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="mt-8 w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
