import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Lock, X, User, Shield } from 'lucide-react';
import api from '../../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateAccountant, setShowCreateAccountant] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            if (res.data.success) {
                console.log("Fetched users count:", res.data.data.length);
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // Polling every 5 seconds for real-time updates as requested
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">User Management ({users.length})</h1>
                    <p className="text-gray-500 font-medium text-lg">Manage and audit all platform accounts • <span className="text-indigo-600 animate-pulse">Live Updating</span></p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchUsers}
                        className="bg-white text-indigo-600 px-6 py-4 rounded-2xl font-bold border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        Refresh Now
                    </button>
                    <button
                        onClick={() => setShowCreateAccountant(true)}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-100"
                    >
                        <UserPlus size={20} />
                        Create Accountant
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Business</th>
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{u.username}</p>
                                                <p className="text-sm text-gray-500 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                                            u.role === 'accountant' ? 'bg-purple-100 text-purple-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-600 font-bold">{u.businessType || '-'}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateAccountant && (
                <CreateAccountantModal
                    onClose={() => setShowCreateAccountant(false)}
                    onSuccess={() => {
                        setShowCreateAccountant(false);
                        fetchUsers(); // Real-time refresh
                    }}
                />
            )}
        </div>
    );
}

function CreateAccountantModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/auth/register', {
                username: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: 'accountant',
                businessType: 'other'
            });
            if (res.data.success) {
                onSuccess();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating accountant');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[200] animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md aspect-square flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">New Accountant</h3>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Professional Provisioning</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <Input icon={<User />} placeholder="e.g. Jean Doe" value={formData.fullName} onChange={v => setFormData({ ...formData, fullName: v })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <Input icon={<Mail />} placeholder="accountant@masrledger.com" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
                            <Input icon={<Lock />} placeholder="••••••••" type="password" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Shield size={20} />
                                Confirm & Deploy
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Input({ icon, placeholder, value, onChange, type = "text" }) {
    return (
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900"
                required
            />
        </div>
    );
}
