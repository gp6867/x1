import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH ENDPOINTS =============
export const authAPI = {
  // Register with email verification
  register: (email: string, password: string) => 
    api.post('/auth/register', { email, password }),
  
  // Verify OTP
  verifyOTP: (email: string, otp: string) => 
    api.post('/auth/verify-otp', { email, otp }),
  
  // Resend OTP
  resendOTP: (email: string) => 
    api.post('/auth/resend-otp', { email }),
  
  // Login
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  // Forgot Password
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  // Reset Password with OTP
  resetPassword: (email: string, otp: string, newPassword: string) => 
    api.post('/auth/reset-password', { email, otp, newPassword }),
  
  // Google Login
  googleLogin: (token: string) => 
    api.post('/auth/google', { token }),
  
  // Apple Login
  appleLogin: (token: string) => 
    api.post('/auth/apple', { token }),
  
  // Logout
  logout: () => 
    api.post('/auth/logout'),
};

export default api;
