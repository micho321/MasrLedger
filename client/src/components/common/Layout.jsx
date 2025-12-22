import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Calculator,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
  Users,
  FileText,
  Shield
} from 'lucide-react';
import clsx from 'clsx';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    const savedUser = localStorage.getItem('masrledger_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserRole(user.role || 'user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('masrledger_user');
    navigate('/login');
  };

  // Define navigation items per role
  const getNavItems = () => {
    const commonItems = [
      { icon: User, label: 'Profile', path: '/profile' },
    ];

    switch (userRole) {
      case 'admin':
        return [
          { icon: Shield, label: 'System Overview', path: '/admin-dashboard' },
          { icon: Users, label: 'User Management', path: '/admin/users' },
          { icon: Receipt, label: 'All Transactions', path: '/admin/transactions' },
          { icon: Calculator, label: 'All Requests', path: '/admin/requests' },
          ...commonItems
        ];
      case 'accountant':
        return [
          { icon: LayoutDashboard, label: 'Requests Dashboard', path: '/accountant-dashboard' },
          ...commonItems
        ];
      case 'user':
      default:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Receipt, label: 'Transactions', path: '/transactions' },
          { icon: Calculator, label: 'Accountant', path: '/requests' },
          ...commonItems
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="logo">
          <Wallet className="logo-icon" />
          <span>MasrLedger</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={clsx('sidebar', { 'open': sidebarOpen })}>
        <div className="sidebar-header">
          <Wallet className="logo-icon" />
          <div className="flex flex-col">
            <h1>MasrLedger</h1>
            <span className="text-xs text-gray-400 font-normal capitalize">{userRole} Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => clsx('nav-link', { 'active': isActive })}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
