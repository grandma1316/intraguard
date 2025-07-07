import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cameraAPI, videoAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import './GoLive.css';

const GoLive = () => {
  const { user } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: '', webcamId: '' });
  const [availableWebcams, setAvailableWebcams] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCameras();
      getAvailableWebcams();
    }
  }, [user]);

  const fetchCameras = async () => {
    try {
      const response = await cameraAPI.getUserCameras(user.uid);
      const camerasData = response.data || {};
      const camerasArray = Object.entries(camerasData).map(([id, camera]) => ({
        id,
        ...camera
      }));
      setCameras(camerasArray);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableWebcams = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableWebcams(videoDevices);
    } catch (error) {
      console.error('Error getting webcams:', error);
    }
  };

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      await cameraAPI.addCamera(user.uid, newCamera);
      setNewCamera({ name: '', webcamId: '' });
      setShowAddModal(false);
      fetchCameras();
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        await cameraAPI.deleteCamera(cameraId);
        fetchCameras();
      } catch (error) {
        console.error('Error deleting camera:', error);
      }
    }
  };

  const VideoStream = ({ camera }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);

    const startStream = () => {
      setIsStreaming(true);
      setError(null);
    };

    const stopStream = () => {
      setIsStreaming(false);
    };

    return (
      <div className="video-card">
        <div className="video-header">
          <h3>{camera.name}</h3>
          <div className="video-controls">
            <button 
              className={`stream-btn ${isStreaming ? 'stop' : 'start'}`}
              onClick={isStreaming ? stopStream : startStream}
            >
              {isStreaming ? 'Stop' : 'Start'} Stream
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDeleteCamera(camera.id)}
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className="video-container">
          {isStreaming ? (
            <img 
              src={`${videoAPI.getVideoStream(camera.webcam, user.uid)}`}
              alt={`Live stream from ${camera.name}`}
              className="video-stream"
            />
          ) : (
            <div className="video-placeholder">
              <span className="placeholder-icon">📹</span>
              <p>Click "Start Stream" to begin</p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="golive-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading cameras...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="golive-container">
      <Sidebar />
      <div className="main-content">
        <div className="golive-header">
          <h1>Go Live</h1>
          <p>Monitor your cameras in real-time</p>
          <div className="header-buttons">
            <button 
              className="add-camera-btn"
              onClick={() => setShowAddModal(true)}
            >
              <span>➕</span>
              Add Camera
            </button>
            <button 
              className="test-gun-alert-btn"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/test-gun-alert/${user.uid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  alert('Test gun alert triggered! Check your notifications.');
                } catch (error) {
                  console.error('Error triggering test alert:', error);
                  alert('Error triggering test alert');
                }
              }}
            >
              <span>🔫</span>
              Test Gun Alert
            </button>
            <button 
              className="test-bat-alert-btn"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/test-baseball-bat-alert/${user.uid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  alert('Test baseball bat alert triggered! Check your notifications.');
                } catch (error) {
                  console.error('Error triggering test alert:', error);
                  alert('Error triggering test alert');
                }
              }}
            >
              <span>🏏</span>
              Test Baseball Bat Alert
            </button>
          </div>
        </div>

        <div className="cameras-grid">
          {cameras.length > 0 ? (
            cameras.map((camera) => (
              <VideoStream key={camera.id} camera={camera} />
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📹</span>
              <h3>No cameras added yet</h3>
              <p>Add your first camera to start monitoring</p>
              <button 
                className="add-first-camera-btn"
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Camera
              </button>
            </div>
          )}
        </div>

        {/* Add Camera Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Camera</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddCamera} className="camera-form">
                <div className="form-group">
                  <label htmlFor="cameraName">Camera Name</label>
                  <input
                    type="text"
                    id="cameraName"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                    placeholder="Enter camera name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="webcamSelect">Select Webcam</label>
                  <select
                    id="webcamSelect"
                    value={newCamera.webcamId}
                    onChange={(e) => setNewCamera({...newCamera, webcamId: e.target.value})}
                    required
                  >
                    <option value="">Select a webcam</option>
                    {availableWebcams.map((device, index) => (
                      <option key={device.deviceId} value={index}>
                        {device.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Add Camera
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoLive; 