import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import api from '../../services/api';

export default function AllTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const fetchTransactions = async () => {
        try {
            const params = {};
            if (typeFilter) params.type = typeFilter;
            // Note: category is also supported by backend if needed later

            const res = await api.get('/transactions', { params });
            if (res.data.success) {
                let data = res.data.data;
                // Client-side search for notes/category/username
                if (searchTerm) {
                    const lowSearch = searchTerm.toLowerCase();
                    data = data.filter(t =>
                        (t.notes && t.notes.toLowerCase().includes(lowSearch)) ||
                        (t.category && t.category.toLowerCase().includes(lowSearch)) ||
                        (t.user?.username && t.user.username.toLowerCase().includes(lowSearch))
                    );
                }
                setTransactions(data);
            }
        } catch (error) {
            console.error("Transactions fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, 5000);
        return () => clearInterval(interval);
    }, [searchTerm, typeFilter]); // Re-fetch or re-filter when state changes

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Global Transactions ({transactions.length})</h1>
                    <p className="text-gray-500 font-medium text-lg">Platform-wide audit log • <span className="text-indigo-600 animate-pulse font-bold">Live</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchTransactions}
                        className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors text-gray-500"
                        title="Manual Refresh"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, category, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-medium"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="hidden md:block"></div> {/* Spacer */}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name / Notes</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.length > 0 ? (
                                transactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {t.user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{t.user?.username || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-900">{t.notes || '—'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-gray-500 bg-gray-100/50 px-3 py-1 rounded-lg inline-block">{t.category}</p>
                                        </td>
                                        <td className={`px-8 py-6 font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}EGP {t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-400 font-medium">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-gray-400 font-bold">No transactions match your search/filters</p>
                                            <button
                                                onClick={() => { setSearchTerm(''); setTypeFilter(''); }}
                                                className="text-indigo-600 font-black text-sm hover:underline"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
