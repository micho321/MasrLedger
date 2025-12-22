import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Shield,
    Users,
    DollarSign,
    FileText,
    Clock,
    Activity,
    UserPlus
} from 'lucide-react';
import api from '../services/api';
import UserManagement from './admin/UserManagement'; // Just for the modal if needed, but let's keep Dashboard clean

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAccountants: 0,
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        pendingRequests: 0,
        totalRequests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, transRes, reqRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/transactions'),
                    api.get('/accountant/requests/all')
                ]);

                if (usersRes.data.success && transRes.data.success && reqRes.data.success) {
                    const users = usersRes.data.data;
                    const transactions = transRes.data.data;
                    const requests = reqRes.data.data;

                    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

                    setStats({
                        totalUsers: users.filter(u => u.role === 'user').length,
                        totalAccountants: users.filter(u => u.role === 'accountant').length,
                        totalTransactions: transactions.length,
                        totalIncome: income,
                        pendingRequests: requests.filter(r => r.status === 'pending').length,
                        totalRequests: requests.length,
                        recentTransactions: transactions.slice(0, 5) // Last 5 transactions
                    });
                }
            } catch (error) {
                console.error("Dashboard stats error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Polling every 5 seconds for real-time updates
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">Loading System Overview...</div>;

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">System Overview</h1>
                    <p className="text-gray-500 font-medium text-lg">Real-time platform performance monitoring • <span className="text-indigo-600 animate-pulse font-bold">Live</span></p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-600"
                >
                    Refresh Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard icon={<Users className="text-blue-600" />} label="Platform Users" value={stats.totalUsers} bg="bg-blue-50" />
                <StatCard icon={<Shield className="text-purple-600" />} label="Accountants" value={stats.totalAccountants} bg="bg-purple-50" />
                <StatCard icon={<Activity className="text-emerald-600" />} label="Global Volume" value={`EGP ${stats.totalIncome.toLocaleString()}`} bg="bg-emerald-50" />
                <StatCard icon={<DollarSign className="text-indigo-600" />} label="Total Transactions" value={stats.totalTransactions} bg="bg-indigo-50" />
                <StatCard icon={<Clock className="text-amber-600" />} label="Pending Requests" value={stats.pendingRequests} bg="bg-amber-50" />
                <StatCard icon={<FileText className="text-rose-600" />} label="All Requests" value={stats.totalRequests} bg="bg-rose-50" />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Recent Platform Activity</h2>
                        <p className="text-gray-500 font-bold text-sm">Last 5 transactions across the platform</p>
                    </div>
                    <a href="/admin/transactions" className="text-indigo-600 font-black text-sm hover:underline">View All Transactions</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recentTransactions?.length > 0 ? (
                                stats.recentTransactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {t.user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900">{t.user?.username || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className={`px-8 py-6 font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}EGP {t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-600 font-bold">{t.category}</td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{new Date(t.createdAt).toLocaleTimeString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">No recent activity detected</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, bg }) {
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                {icon}
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">{label}</p>
            <p className="text-4xl font-black text-gray-900">{value}</p>
        </div>
    );
}

