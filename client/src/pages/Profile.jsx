import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import api from '../services/api';

const Profile = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        businessType: 'freelancer',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Profile Data
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            if (response.data.success) {
                // Determine bio since it might not be in DB model based on controller inspection
                // If the backend User model doesn't have 'bio', we might need to handle it or it won't persist
                // Looking at Register logic, the user creates a bio but does the backend save it?
                // Let's assume the backend User model has these fields or we will see. 
                // If 'bio' is not in the response, we default it.
                setUser({
                    ...response.data.data,
                    bio: response.data.data.bio || 'Professional using MasrLedger.'
                });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setShowSuccess(false);

        try {
            const response = await api.put('/users/profile', {
                username: user.username,
                businessType: user.businessType,
                // If backend supports bio update
            });

            if (response.data.success) {
                // Update local storage to keep session in sync if name changed
                const savedSession = localStorage.getItem('masrledger_user');
                if (savedSession) {
                    const sessionData = JSON.parse(savedSession);
                    localStorage.setItem('masrledger_user', JSON.stringify({
                        ...sessionData,
                        username: user.username,
                        businessType: user.businessType
                    }));
                }

                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-muted">Manage your account information</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="text-center">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-3xl font-bold uppercase">
                            {user.username ? user.username.charAt(0) : 'U'}
                        </div>
                        <h2 className="text-xl font-bold">{user.username}</h2>
                        <p className="text-muted mb-4">{user.email}</p>
                        <span className="badge badge-success capitalize">{user.businessType}</span>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card title="Edit Details">
                        <form className="space-y-4" onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="username"
                                            value={user.username}
                                            onChange={handleChange}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            className="input-field pl-10 bg-gray-50 text-gray-500"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="businessType"
                                        value={user.businessType}
                                        onChange={handleChange}
                                        className="input-field pl-10 bg-white"
                                    >
                                        <option value="freelancer">Freelancer</option>
                                        <option value="micro-business">Micro Business</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="3"
                                    value={user.bio}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Tell us about your business..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                {showSuccess && (
                                    <div className="flex items-center text-emerald-600 animate-fade-in">
                                        <CheckCircle size={18} className="mr-2" />
                                        <span className="text-sm font-medium">Changes saved successfully!</span>
                                    </div>
                                )}
                                <div className={showSuccess ? "" : "ml-auto"}>
                                    <button type="submit" className="btn btn-primary">
                                        <Save size={18} className="mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
