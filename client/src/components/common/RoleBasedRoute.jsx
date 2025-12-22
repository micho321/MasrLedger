import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('masrledger_user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    // Default role is 'user' if not specified
    const userRole = user?.role || 'user';

    console.log('RoleBasedRoute Debug:', { userRole, allowedRoles, path: window.location.pathname });

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Logged in but not authorized
        // Redirect to their appropriate dashboard based on their role
        if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (userRole === 'accountant') return <Navigate to="/accountant-dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    // Authorized
    return <Outlet />;
};

export default RoleBasedRoute;
