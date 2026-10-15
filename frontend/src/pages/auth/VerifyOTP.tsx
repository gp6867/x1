import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyOTP } from '../../services/authService';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await verifyOTP(email!, otp);
      navigate(`/reset-password?email=${encodeURIComponent(email!)}&otp=${otp}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <div>Redirecting...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-lg font-medium">Verify OTP</h1>
      </div>
      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-8">
          {email}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest"
            placeholder="••••••"
            maxLength={6}
            required
            autoFocus
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
