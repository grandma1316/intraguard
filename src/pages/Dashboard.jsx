import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectionAPI, cameraAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDetections: 0,
    activeCameras: 0,
    alertsToday: 0,
    recentDetections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's detections
      const detectionsResponse = await detectionAPI.getUserDetections(user.uid);
      const detections = detectionsResponse.data || {};
      
      // Fetch user's cameras
      const camerasResponse = await cameraAPI.getUserCameras(user.uid);
      const cameras = camerasResponse.data || {};
      
      // Calculate stats
      const totalDetections = Object.keys(detections).length;
      const activeCameras = Object.keys(cameras).length;
      
      // Calculate today's alerts
      const today = new Date().toDateString();
      const alertsToday = Object.values(detections).filter(detection => {
        const detectionDate = new Date(detection.timestamp).toDateString();
        return detectionDate === today;
      }).length;
      
      // Get recent detections (last 5)
      const recentDetections = Object.entries(detections)
        .sort(([,a], [,b]) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(([id, detection]) => ({
          id,
          ...detection
        }));

      setStats({
        totalDetections,
        activeCameras,
        alertsToday,
        recentDetections
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  const DetectionItem = ({ detection }) => (
    <div className="detection-item">
      <div className="detection-icon">
        {detection.object_class === 'knife' ? '🔪' : 
         detection.object_class === 'gun' ? '🔫' : '⚠️'}
      </div>
      <div className="detection-details">
        <h4>{detection.object_class.toUpperCase()}</h4>
        <p>{new Date(detection.timestamp).toLocaleString()}</p>
      </div>
      <div className="detection-status">
        <span className="status-badge">Detected</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>Here's what's happening with your surveillance system</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Detections"
            value={stats.totalDetections}
            icon="🔍"
            color="#00d4ff"
          />
          <StatCard
            title="Active Cameras"
            value={stats.activeCameras}
            icon="📹"
            color="#4CAF50"
          />
          <StatCard
            title="Alerts Today"
            value={stats.alertsToday}
            icon="⚠️"
            color="#ff4d4d"
          />
          <StatCard
            title="System Status"
            value="Online"
            icon="🟢"
            color="#4CAF50"
          />
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h2>Recent Detections</h2>
            <div className="detections-list">
              {stats.recentDetections.length > 0 ? (
                stats.recentDetections.map((detection) => (
                  <DetectionItem key={detection.id} detection={detection} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent detections</p>
                  <span>Your system is monitoring for threats</span>
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn primary">
                <span className="action-icon">📹</span>
                Go Live
              </button>
              <button className="action-btn secondary">
                <span className="action-icon">➕</span>
                Add Camera
              </button>
              <button className="action-btn secondary">
                <span className="action-icon">📊</span>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 