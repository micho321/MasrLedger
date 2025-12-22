import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Mail,
    FileText,
    LogOut,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AccountantDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState({
        fullName: 'Accountant',
        certification: 'CPA',
        role: 'accountant'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get Local User Info
                const savedUser = localStorage.getItem('masrledger_user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    setCurrentUser({
                        fullName: parsed.username || 'Accountant',
                        certification: 'Certified Public Accountant', // Placeholder or add to user model
                        role: parsed.role
                    });
                }

                // Fetch All Requests (Accountant View)
                const res = await api.get('/accountant/requests/all');
                if (res.data.success) {
                    setRequests(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching accountant data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const updateStatus = async (requestId, newStatus) => {
        try {
            const res = await api.put(`/accountant/requests/${requestId}`, {
                status: newStatus
            });

            if (res.data.success) {
                // Update local state
                setRequests(requests.map(r =>
                    r._id === requestId ? { ...r, status: newStatus } : r
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handleAccept = (requestId) => updateStatus(requestId, 'accepted');

    const handleReject = (requestId) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            updateStatus(requestId, 'rejected');
        }
    };

    const handleComplete = (requestId) => updateStatus(requestId, 'completed');

    const handleLogout = () => {
        localStorage.removeItem('masrledger_user');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const acceptedCount = requests.filter(r => r.status === 'accepted').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading accountant dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Consultation Requests
                    </h1>
                    <p className="text-gray-600">Manage client consultation requests and appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                        <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Accepted</p>
                        <p className="text-3xl font-bold text-gray-900">{acceptedCount}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{request.topic || 'No Topic'}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    <span>{request.user?.username || 'Unknown User'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{request.user?.email || 'No Email'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Preferred: {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <p className="text-sm text-gray-700">{request.notes || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(request._id)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request._id)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {request.status === 'accepted' && (
                                            <button
                                                onClick={() => handleComplete(request._id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Mark as Completed
                                            </button>
                                        )}
                                        {request.status === 'completed' && (
                                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Consultation Completed
                                            </span>
                                        )}
                                        {request.status === 'rejected' && (
                                            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Request Rejected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No requests found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountantDashboard;
