import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/add-user', userData),
  logout: () => api.post('/logout'),
};

// User management endpoints
export const userAPI = {
  getUsers: () => api.get('/get-users'),
  getUserProfile: (userId) => api.get(`/api/user/${userId}`),
  updateUser: (userId, data) => api.put(`/api/users/${userId}`, data),
  deleteUser: (userId) => api.post('/delete-user', { uid: userId }),
};

// Camera management endpoints
export const cameraAPI = {
  getUserCameras: (userId) => api.get(`/api/cameras/${userId}`),
  addCamera: (userId, cameraData) => api.post(`/api/cameras/${userId}`, cameraData),
  deleteCamera: (cameraId) => api.delete(`/api/cameras/${cameraId}`),
};

// Detection endpoints
export const detectionAPI = {
  logDetection: (data) => api.post('/log-detection', data),
  getUserDetections: (userId) => api.get(`/api/detections/${userId}`),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: (userId) => api.get(`/api/notifications/${userId}`),
  storeFCMToken: (data) => api.post('/store-fcm-token', data),
};

// Video streaming
export const videoAPI = {
  getVideoStream: (deviceId, userId) => 
    `${API_BASE_URL}/video_feed?device=${deviceId}&user_id=${userId}`,
  stopCapture: () => api.post('/stop-capture'),
};

// Email confirmation
export const emailAPI = {
  confirmEmail: (email) => api.get(`/confirm-email?email=${email}`),
};

export default api; 