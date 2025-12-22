import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, X, Calendar, Tag, DollarSign, Edit2, Trash2, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import api from '../services/api';

const Transactions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState({ type: 'all', category: 'all' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Data
    const [transactions, setTransactions] = useState([]);

    // Fetch Transactions on Mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/transactions');
            if (response.data.success) {
                setTransactions(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    // Click outside handler for menus
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        if (activeMenuId) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenuId]);

    // New/Edit Transaction State
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Project',
        type: 'income',
        date: new Date().toISOString().split('T')[0]
    });

    // Filtering Logic
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = (tx.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory.category === 'all' || tx.category === filterCategory.category;
        const matchesType = filterCategory.type === 'all' || tx.type === filterCategory.type;

        return matchesSearch && matchesCategory && matchesType;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setFilterCategory({ type: 'all', category: 'all' });
    };

    const handleOpenModal = (transaction = null) => {
        setError(null);
        if (transaction) {
            setEditingId(transaction._id); // Use _id for MongoDB
            setFormData({
                title: transaction.title,
                amount: transaction.amount,
                category: transaction.category,
                type: transaction.type,
                date: transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                amount: '',
                category: 'Project',
                type: 'income',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (editingId) {
                // Update Existing
                const response = await api.put(`/transactions/${editingId}`, {
                    ...formData,
                    amount: Number(formData.amount)
                });

                if (response.data.success) {
                    setTransactions(transactions.map(tx =>
                        tx._id === editingId ? response.data.data : tx
                    ));
                    setIsModalOpen(false);
                }
            } else {
                // Create New
                const response = await api.post('/transactions', {
                    ...formData,
                    amount: Number(formData.amount)
                });

                if (response.data.success) {
                    setTransactions([response.data.data, ...transactions]);
                    setIsModalOpen(false);
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save transaction');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                const response = await api.delete(`/transactions/${id}`);
                if (response.data.success) {
                    setTransactions(transactions.filter(tx => tx._id !== id));
                    setActiveMenuId(null);
                }
            } catch (err) {
                console.error(err);
                alert('Failed to delete transaction');
            }
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const hasActiveFilters = searchTerm !== '' || filterCategory.type !== 'all' || filterCategory.category !== 'all';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    <p className="text-muted">Manage your income and expenses</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => handleOpenModal()}
                >
                    <Plus size={18} className="mr-2" />
                    Add Transaction
                </button>
            </div>

            {error && !isModalOpen && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <Card>
                {/* Search and Filter Controls */}
                <div className="flex flex-col space-y-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="input-field pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 relative">
                            {hasActiveFilters && (
                                <button
                                    className="btn btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={resetFilters}
                                >
                                    <X size={18} className="mr-2" />
                                    Clear
                                </button>
                            )}
                            <button
                                className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <Filter size={18} className="mr-2" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filter Options */}
                    {isFilterOpen && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="input-field bg-white"
                                    value={filterCategory.type}
                                    onChange={(e) => setFilterCategory({ ...filterCategory, type: e.target.value })}
                                >
                                    <option value="all">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="input-field bg-white"
                                    value={filterCategory.category}
                                    onChange={(e) => setFilterCategory({ ...filterCategory, category: e.target.value })}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Project">Project</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Design">Design</option>
                                    <option value="Software">Software</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Utilities">Utilities</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table/List */}
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64 text-muted">
                            Loading transactions...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-muted text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">Transaction</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        {tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{tx.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {tx.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-bold text-gray-900">
                                                EGP {tx.amount.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right relative">
                                                <button
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => toggleMenu(e, tx._id)}
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>

                                                {/* Action Menu */}
                                                {activeMenuId === tx._id && (
                                                    <div className="absolute right-4 top-12 z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-left animate-fade-in">
                                                        <button
                                                            onClick={() => handleOpenModal(tx)}
                                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit2 size={16} /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(tx._id)}
                                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 size={16} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-muted">
                                            No transactions found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Website Payment"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (EGP)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="input-field pl-9"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="input-field bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            className="input-field pl-9 bg-white"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Project">Project</option>
                                            <option value="Rent">Rent</option>
                                            <option value="Design">Design</option>
                                            <option value="Software">Software</option>
                                            <option value="Consulting">Consulting</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            required
                                            className="input-field pl-9"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>
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
                                    {editingId ? 'Save Changes' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
