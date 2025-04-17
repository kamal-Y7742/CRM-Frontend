import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://164.52.223.86:3013/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // Only include these if your backend expects them and has CORS configured
    if (process.env.NODE_ENV === 'production') {
      config.headers['X-Client-IP'] = localStorage.getItem('lastKnownIP') || 'unknown';
      config.headers['X-Client-Time'] = new Date().toISOString();
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.message === 'Network Error' && !error.response) {
      console.error('CORS/Network Error - Check backend configuration');
      return Promise.reject({ 
        ...error, 
        message: 'Network error. Please check your connection or contact support.' 
      });
    }

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshAPI = axios.create({
            baseURL: API_URL,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const response = await refreshAPI.post('/auth/refresh', {
            refreshToken,
            systemInfo: await getSystemInfo()
          });

          localStorage.setItem('auth_token', response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem('refresh_token', response.data.refreshToken);
          }
          
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Clear tokens and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login?session_expired=true';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// System info helper function
async function getSystemInfo() {
  return {
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export default API;