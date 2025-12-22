import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, X, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import api from '../services/api';

const AccountantRequests = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRequest, setNewRequest] = useState({
        topic: '',
        notes: '',
        preferredDate: new Date().toISOString().split('T')[0]
    });

    const [requests, setRequests] = useState([]);

    // Fetch Requests
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/accountant/requests');
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRequest = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post('/accountant/requests', newRequest);
            if (response.data.success) {
                setRequests([response.data.data, ...requests]);
                setIsModalOpen(false);
                setNewRequest({ topic: '', notes: '', preferredDate: new Date().toISOString().split('T')[0] });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to submit request');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Accountant Support</h1>
                    <p className="text-muted">Request professional help for your finances</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} className="mr-2" />
                    New Request
                </button>
            </div>

            {error && !isModalOpen && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center p-8 text-muted">Loading requests...</div>
                        ) : requests.length > 0 ? (
                            requests.map((req) => (
                                <Card key={req._id} className="hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{req.topic}</h3>
                                        <span className={`badge ${req.status === 'completed' ? 'badge-success' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'badge-warning'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="text-muted text-sm mb-4">
                                        Requested on: {new Date(req.preferredDate).toLocaleDateString()}
                                    </div>
                                    <p className="text-gray-700">{req.notes}</p>
                                    {req.status === 'completed' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="text-sm font-medium text-emerald-700 flex items-center">
                                                <CheckCircle size={16} className="mr-2" />
                                                Resolved
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-gray-50 rounded-lg text-muted border border-dashed border-gray-200">
                                No requests found. Create one to get started!
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Card title="How it works">
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                                <p className="text-sm text-gray-600">Submit a request with your questions or topic.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                                <p className="text-sm text-gray-600">An accountant will review and schedule a consultation.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">3</div>
                                <p className="text-sm text-gray-600">Get expert advice tailored to your business.</p>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-muted text-center">
                            Available 9 AM - 5 PM, Sunday to Thursday
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">New Accountant Request</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddRequest} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Tax Declaration Help"
                                    value={newRequest.topic}
                                    onChange={(e) => setNewRequest({ ...newRequest, topic: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Details / Notes</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="input-field"
                                    placeholder="Describe what you need help with..."
                                    value={newRequest.notes}
                                    onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={newRequest.preferredDate}
                                    onChange={(e) => setNewRequest({ ...newRequest, preferredDate: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary flex-1 justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1 justify-center"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountantRequests;
