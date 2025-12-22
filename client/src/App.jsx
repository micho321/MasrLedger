import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AccountantRequests from './pages/AccountantRequests';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import AccountantDashboard from './pages/AccountantDashboard';

import UserManagement from './pages/admin/UserManagement';
import AllTransactions from './pages/admin/AllTransactions';
import AllRequests from './pages/admin/AllRequests';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes - Wrapped in Layout */}
      <Route element={<Layout />}>

        {/* Common Routes */}
        <Route path="/profile" element={<Profile />} />

        {/* User Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['user']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/requests" element={<AccountantRequests />} />
        </Route>

        {/* Accountant Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['accountant']} />}>
          <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/transactions" element={<AllTransactions />} />
          <Route path="/admin/requests" element={<AllRequests />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
