import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const otpService = {
  async sendOtp(email: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyOtp(email: string, otp: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
