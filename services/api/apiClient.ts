import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// API base configuration - Default to local mock API path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Debug API configuration
console.log('API Client initialized with base URL:', API_BASE_URL);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // For development, try without credentials first if we have CORS issues
  withCredentials: false, // Changed from true to false for development
  // Add timeout to prevent long hanging requests
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get stored token
    const token = localStorage.getItem('accessToken');
    // If token exists, add to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug info for development
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { 
      headers: config.headers,
      withCredentials: config.withCredentials 
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, { 
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // Log detailed error info
    console.error('API Response Error:', { 
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 errors (unauthorized), try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          console.log('Attempting to refresh token...');
          
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          
          // Save new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Update Authorization header for failed request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          console.log('Token refreshed successfully, retrying request');
          
          // Resend failed request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        // Check if re-login is really needed
        const errorResponse = (refreshError as AxiosError).response;
        if (errorResponse?.status === 401 || errorResponse?.status === 403) {
          // Only clear auth info and redirect on explicit authentication errors
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Use setTimeout to prevent immediate redirect flash
          if (typeof window !== 'undefined') {
            console.log('Token expired, redirecting to login page');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          return Promise.reject(new Error('Authentication expired, please login again'));
        }
        // For other errors (like network issues), maintain current session
        console.error('Token refresh failed, but not an auth error, maintaining current session');
        return Promise.reject(refreshError);
      }
    }
    
    // Transform network errors to be more informative
    if (error.message === 'Network Error') {
      console.error('Network error detected - API server may be down or unreachable');
      const enhancedError = new Error('Unable to connect to server. Please check your internet connection or try again later.');
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;