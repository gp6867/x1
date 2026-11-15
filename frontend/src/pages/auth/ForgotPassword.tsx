import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email); // Fixed import usage from original file
      navigate('/verify-otp', { state: { email } });
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="p-4 border-b border-slate-200 bg-white">
        <button onClick={() => navigate('/login')} className="p-2 text-slate-600 hover:text-slate-900 transition rounded-lg hover:bg-slate-100 inline-flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={18} /> Back to Login
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 w-full max-w-md mx-auto">
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h1>
          <p className="text-slate-600 mb-6 text-sm">Enter your email to receive OTP</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            {message && <p className="text-red-500 text-sm">{message}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
