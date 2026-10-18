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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>Xone AI</h1>
          <p>Welcome back!</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        
        {success && (
          <div className="auth-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email"><Mail size={16} />Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" disabled={loading} required />
            </div>
            <div className="form-group">
              <label htmlFor="password"><Lock size={16} />Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading} required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="forgot-password">
              <button type="button" onClick={() => setShowForgot(true)} className="forgot-link">Forgot password?</button>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? <Loader size={16} className="spin" /> : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className="forgot-password-form">
            <h3>Reset Password</h3>
            {resetStep === 'email' && (
              <>
                <p>Enter your email to receive OTP</p>
                <div className="form-group">
                  <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Enter your email" disabled={resetLoading} />
                </div>
                <button className="auth-button" onClick={handleForgotPassword} disabled={resetLoading || !resetEmail}>
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Send OTP'}
                </button>
              </>
            )}
            {resetStep === 'otp' && (
              <>
                <p>Enter 6-digit OTP sent to <strong>{resetEmail}</strong></p>
                <div className="otp-inputs">
                  {resetOtp.map((digit, index) => (
                    <input key={index} id={`reset-otp-${index}`} type="text" maxLength={1} value={digit} onChange={(e) => handleResetOtpChange(index, e.target.value)} className="otp-input" disabled={resetLoading} />
                  ))}
                </div>
                <button className="auth-button" onClick={handleResetPassword} disabled={resetLoading || resetOtp.join('').length !== 6}>
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Verify OTP'}
                </button>
                <div className="otp-resend">
                  {canResendReset ? (
                    <button onClick={handleForgotPassword} disabled={resetLoading} className="resend-button">Resend OTP</button>
                  ) : (<span className="resend-timer">Resend in {resetTimer}s</span>)}
                </div>
              </>
            )}
            {resetStep === 'new' && (
              <>
                <p>Enter new password</p>
                <div className="form-group">
                  <div className="password-input">
                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min 6 characters)" disabled={resetLoading} />
                    <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button className="auth-button" onClick={handleResetPassword} disabled={resetLoading || newPassword.length < 6}>
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Reset Password'}
                </button>
              </>
            )}
            <button className="back-button" onClick={resetForgotForm}>← Back to Login</button>
          </div>
        )}

        {/* ===== GOOGLE LOGIN - KEPT ===== */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button 
            className="social-button google"
            onClick={handleGoogleLogin}
            disabled={loading || resetLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          {/* ===== APPLE LOGIN - COMMENTED (keys nahi hain) ===== */}
          {/* 
          <button className="social-button apple" disabled={loading || resetLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.9-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z"/>
            </svg>
            <span>Apple</span>
          </button>
          */}
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
