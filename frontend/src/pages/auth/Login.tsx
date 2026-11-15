import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'new'>('email');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetTimer, setResetTimer] = useState(60);
  const [canResendReset, setCanResendReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => { navigate('/chat'); }, 1500);
      } else { setError(response.data.message || 'Invalid credentials'); }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) { setError('Please enter your email'); return; }
    setResetLoading(true);
    setError('');
    try {
      const response = await authAPI.forgotPassword(resetEmail);
      if (response.data.success) {
        setResetStep('otp');
        startResetTimer();
        setSuccess('OTP sent to your email!');
      } else { setError(response.data.message || 'Failed to send OTP'); }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setResetLoading(false); }
  };

  const startResetTimer = () => {
    setCanResendReset(false);
    setResetTimer(60);
    const interval = setInterval(() => {
      setResetTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResendReset(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetPassword = async () => {
    const otpString = resetOtp.join('');
    if (resetStep === 'otp') {
      if (otpString.length !== 6) { setError('Please enter complete OTP'); return; }
      setResetLoading(true);
      try {
        const response = await authAPI.verifyOTP(resetEmail, otpString);
        if (response.data.success) { setResetStep('new'); setError(''); }
        else { setError(response.data.message || 'Invalid OTP'); }
      } catch (err: any) {
        setError(err.response?.data?.message || 'OTP verification failed');
      } finally { setResetLoading(false); }
    } else {
      if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
      setResetLoading(true);
      try {
        const response = await authAPI.resetPassword(resetEmail, resetOtp.join(''), newPassword);
        if (response.data.success) {
          setSuccess('Password reset successfully! Please login.');
          setTimeout(() => {
            setShowForgot(false); setResetStep('email');
            setResetOtp(['', '', '', '', '', '']); setNewPassword('');
            setResetEmail(''); setError('');
          }, 2000);
        } else { setError(response.data.message || 'Failed to reset password'); }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to reset password');
      } finally { setResetLoading(false); }
    }
  };

  const resetForgotForm = () => {
    setShowForgot(false); setResetStep('email');
    setResetOtp(['', '', '', '', '', '']); setNewPassword('');
    setResetEmail(''); setError(''); setSuccess('');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Xone AI</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back!</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200">
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 font-bold text-lg leading-none">&times;</button>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span className="flex-1">{success}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" /> Email
                </label>
                <input 
                  type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" disabled={loading} required 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" /> Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your password" disabled={loading} required 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center disabled:opacity-50">
                {loading ? <Loader size={20} className="animate-spin" /> : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
              {resetStep === 'email' && (
                <>
                  <p className="text-sm text-slate-600">Enter your email to receive OTP</p>
                  <div>
                    <input 
                      type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} 
                      placeholder="Enter your email" disabled={resetLoading} 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                    />
                  </div>
                  <button onClick={handleForgotPassword} disabled={resetLoading || !resetEmail} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition flex justify-center disabled:opacity-50">
                    {resetLoading ? <Loader size={20} className="animate-spin" /> : 'Send OTP'}
                  </button>
                </>
              )}
              {resetStep === 'otp' && (
                <>
                  <p className="text-sm text-slate-600">Enter 6-digit OTP sent to <strong className="text-slate-900">{resetEmail}</strong></p>
                  <div className="flex justify-between gap-2">
                    {resetOtp.map((digit, index) => (
                      <input 
                        key={index} id={`reset-otp-${index}`} type="text" maxLength={1} value={digit} 
                        onChange={(e) => handleResetOtpChange(index, e.target.value)} disabled={resetLoading} 
                        className="w-12 h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                      />
                    ))}
                  </div>
                  <button onClick={handleResetPassword} disabled={resetLoading || resetOtp.join('').length !== 6} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition flex justify-center disabled:opacity-50">
                    {resetLoading ? <Loader size={20} className="animate-spin" /> : 'Verify OTP'}
                  </button>
                  <div className="text-center text-sm">
                    {canResendReset ? (
                      <button onClick={handleForgotPassword} disabled={resetLoading} className="text-emerald-600 hover:text-emerald-700 font-medium">Resend OTP</button>
                    ) : (<span className="text-slate-500">Resend in {resetTimer}s</span>)}
                  </div>
                </>
              )}
              {resetStep === 'new' && (
                <>
                  <p className="text-sm text-slate-600">Enter new password</p>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="New password (min 6 characters)" disabled={resetLoading} 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button onClick={handleResetPassword} disabled={resetLoading || newPassword.length < 6} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition flex justify-center disabled:opacity-50">
                    {resetLoading ? <Loader size={20} className="animate-spin" /> : 'Reset Password'}
                  </button>
                </>
              )}
              <button onClick={resetForgotForm} className="w-full text-sm text-slate-500 hover:text-slate-800 transition text-center block mt-2">
                ← Back to Login
              </button>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={handleGoogleLogin} disabled={loading || resetLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
