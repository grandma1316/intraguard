import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications(user.uid);
      const notificationsData = response.data || {};
      const notificationsArray = Object.entries(notificationsData).map(([id, notification]) => ({
        id,
        ...notification
      }));
      setNotifications(notificationsArray);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'weapon_detected':
        return '⚠️';
      case 'camera_added':
        return '📹';
      case 'camera_deleted':
        return '🗑️';
      case 'daily_summary':
        return '📊';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'weapon_detected':
        return '#ff4d4d';
      case 'camera_added':
        return '#4CAF50';
      case 'camera_deleted':
        return '#ff9800';
      case 'daily_summary':
        return '#00d4ff';
      default:
        return '#ccc';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const NotificationItem = ({ notification }) => (
    <div className="notification-item" style={{ borderLeftColor: getNotificationColor(notification.type) }}>
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="notification-time">
          {formatTimestamp(notification.timestamp)}
        </span>
      </div>
      <div className="notification-type">
        <span className="type-badge" style={{ backgroundColor: getNotificationColor(notification.type) }}>
          {notification.type.replace('_', ' ')}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="notifications-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <Sidebar />
      <div className="main-content">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your surveillance system</p>
          </div>
          <div className="filter-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Notifications</option>
              <option value="weapon_detected">Weapon Detected</option>
              <option value="camera_added">Camera Added</option>
              <option value="camera_deleted">Camera Deleted</option>
              <option value="daily_summary">Daily Summary</option>
            </select>
          </div>
        </div>

        <div className="notifications-content">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔔</span>
              <h3>No notifications</h3>
              <p>
                {filter === 'all' 
                  ? "You're all caught up! No notifications to show."
                  : `No ${filter.replace('_', ' ')} notifications found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 