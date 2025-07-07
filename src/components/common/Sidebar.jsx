import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" style={{ flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          
          {!isCollapsed && (
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#00bfff', letterSpacing: 1 }}>IntegraGuard</span>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <span className="icon">📊</span>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={isActive('/golive') ? 'active' : ''}>
            <Link to="/golive">
              <span className="icon">📹</span>
              {!isCollapsed && <span>Go Live</span>}
            </Link>
          </li>
          <li className={isActive('/notifications') ? 'active' : ''}>
            <Link to="/notifications">
              <span className="icon">🔔</span>
              {!isCollapsed && <span>Notifications</span>}
            </Link>
          </li>
          <li className={isActive('/profile') ? 'active' : ''}>
            <Link to="/profile">
              <span className="icon">👤</span>
              {!isCollapsed && <span>Profile</span>}
            </Link>
          </li>
          <li className={isActive('/detections') ? 'active' : ''}>
            <Link to="/detections">
              <span className="icon">🔍</span>
              {!isCollapsed && <span>Detections</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 