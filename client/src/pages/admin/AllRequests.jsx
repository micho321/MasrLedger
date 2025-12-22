import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, RefreshCcw, User } from 'lucide-react';
import api from '../../services/api';

export default function AllRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchRequests = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;

            const res = await api.get('/accountant/requests/all', { params });
            if (res.data.success) {
                let data = res.data.data;

                // Client-side search for topic or username
                if (searchTerm) {
                    const lowSearch = searchTerm.toLowerCase();
                    data = data.filter(r =>
                        (r.topic && r.topic.toLowerCase().includes(lowSearch)) ||
                        (r.user?.username && r.user.username.toLowerCase().includes(lowSearch))
                    );
                }
                setRequests(data);
            }
        } catch (error) {
            console.error("Requests fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, [searchTerm, statusFilter]);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Consultation Requests ({requests.length})</h1>
                    <p className="text-gray-500 font-medium text-lg">Monitoring all platform interactions • <span className="text-indigo-600 animate-pulse font-bold">Live</span></p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors text-gray-500"
                >
                    <RefreshCcw size={20} />
                </button>
            </div>

            {/* Filters Bar */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by topic or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-medium"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {requests.length > 0 ? (
                    requests.map(r => (
                        <div key={r._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className={`p-5 rounded-[1.5rem] transition-colors ${r.status === 'pending' ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' :
                                    r.status === 'completed' ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                                        'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                                    }`}>
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-1">{r.topic}</h3>
                                    <div className="flex items-center gap-3 text-gray-500 font-bold">
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className="text-gray-400" />
                                            <span className="text-indigo-600">{r.user?.username}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm">{r.user?.businessType || 'No Type'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-10 md:text-right">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Current Status</p>
                                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${r.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                        r.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                        }`}>
                                        {r.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Target Date</p>
                                    <p className="text-lg font-black text-gray-900">{new Date(r.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-32 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-400 mb-2">No matching requests</h2>
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
                            className="text-indigo-600 font-black hover:underline transition-all"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
