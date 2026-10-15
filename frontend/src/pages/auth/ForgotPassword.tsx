// pages/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      // OTP sent - redirect to verify page with email
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4 border-b">
        <button onClick={() => navigate('/login')} className="p-2">
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-8">Enter your email to receive OTP</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          {message && <p className="text-red-500 text-sm">{message}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
