import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectionAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import './Detections.css';

const Detections = () => {
  const { user } = useAuth();
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchDetections();
    }
  }, [user]);

  const fetchDetections = async () => {
    try {
      setLoading(true);
      const response = await detectionAPI.getUserDetections(user.uid);
      const detectionsData = response.data || {};
      const detectionsArray = Object.entries(detectionsData).map(([id, detection]) => ({
        id,
        ...detection
      }));
      setDetections(detectionsArray);
    } catch (error) {
      console.error('Error fetching detections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDetectionIcon = (objectClass) => {
    switch (objectClass.toLowerCase()) {
      case 'knife':
        return '🔪';
      case 'gun':
      case 'pistol':
      case 'rifle':
        return '🔫';
      case 'weapon':
        return '⚠️';
      default:
        return '🔍';
    }
  };

  const getDetectionColor = (objectClass) => {
    switch (objectClass.toLowerCase()) {
      case 'knife':
      case 'gun':
      case 'pistol':
      case 'rifle':
      case 'weapon':
        return '#ff4d4d';
      default:
        return '#00d4ff';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredDetections = detections.filter(detection => {
    if (filter === 'all') return true;
    return detection.object_class.toLowerCase() === filter.toLowerCase();
  });

  const DetectionItem = ({ detection }) => (
    <div className="detection-item" style={{ borderLeftColor: getDetectionColor(detection.object_class) }}>
      <div className="detection-icon">
        {getDetectionIcon(detection.object_class)}
      </div>
      <div className="detection-content">
        <h4>{detection.object_class.toUpperCase()}</h4>
        <p>Detected on {formatTimestamp(detection.timestamp)}</p>
      </div>
      <div className="detection-status">
        <span className="status-badge" style={{ backgroundColor: getDetectionColor(detection.object_class) }}>
          Detected
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="detections-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading detections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detections-container">
      <Sidebar />
      <div className="main-content">
        <div className="detections-header">
          <div>
            <h1>Detection History</h1>
            <p>View all weapon detections from your surveillance system</p>
          </div>
          <div className="filter-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Detections</option>
              <option value="knife">Knife</option>
              <option value="gun">Gun</option>
              <option value="pistol">Pistol</option>
              <option value="rifle">Rifle</option>
              <option value="weapon">Weapon</option>
            </select>
          </div>
        </div>

        <div className="detections-content">
          {filteredDetections.length > 0 ? (
            <div className="detections-list">
              {filteredDetections.map((detection) => (
                <DetectionItem key={detection.id} detection={detection} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No detections found</h3>
              <p>
                {filter === 'all' 
                  ? "No weapon detections have been recorded yet."
                  : `No ${filter} detections found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detections; 