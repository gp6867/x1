import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff, Chrome, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  
  // ========== LOGIN FORM STATES ==========
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // ========== UI STATES ==========
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // ========== FORGOT PASSWORD STATES ==========
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'new'>('email');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetTimer, setResetTimer] = useState(60);
  const [canResendReset, setCanResendReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // ========== LOGIN HANDLER ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========== FORGOT PASSWORD HANDLER ==========
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email');
      return;
    }

    setResetLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(resetEmail);
      
      if (response.data.success) {
        setResetStep('otp');
        startResetTimer();
        setSuccess('OTP sent to your email!');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setResetLoading(false);
    }
  };

  // ========== TIMER FOR RESEND ==========
  const startResetTimer = () => {
    setCanResendReset(false);
    setResetTimer(60);
    const interval = setInterval(() => {
      setResetTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResendReset(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ========== OTP CHANGE HANDLER ==========
  const handleResetOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // ========== RESET PASSWORD HANDLER ==========
  const handleResetPassword = async () => {
    const otpString = resetOtp.join('');
    
    if (resetStep === 'otp') {
      // Verify OTP step
      if (otpString.length !== 6) {
        setError('Please enter complete OTP');
        return;
      }
      
      setResetLoading(true);
      try {
        // Verify OTP API call
        const response = await authAPI.verifyOTP(resetEmail, otpString);
        
        if (response.data.success) {
          setResetStep('new');
          setError('');
        } else {
          setError(response.data.message || 'Invalid OTP');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'OTP verification failed');
      } finally {
        setResetLoading(false);
      }
    } else {
      // Set new password step
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setResetLoading(true);
      try {
        const response = await authAPI.resetPassword(resetEmail, resetOtp.join(''), newPassword);
        
        if (response.data.success) {
          setSuccess('Password reset successfully! Please login.');
          setTimeout(() => {
            // Reset all forgot password states
            setShowForgot(false);
            setResetStep('email');
            setResetOtp(['', '', '', '', '', '']);
            setNewPassword('');
            setResetEmail('');
            setError('');
          }, 2000);
        } else {
          setError(response.data.message || 'Failed to reset password');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setResetLoading(false);
      }
    }
  };

  // ========== GOOGLE LOGIN ==========
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // ========== APPLE LOGIN ==========
  const handleAppleLogin = () => {
    window.location.href = `${API_URL}/auth/apple`;
  };

  // ========== RESET FORGOT PASSWORD FORM ==========
  const resetForgotForm = () => {
    setShowForgot(false);
    setResetStep('email');
    setResetOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setResetEmail('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* ===== BRAND ===== */}
        <div className="auth-brand">
          <h1>Xone AI</h1>
          <p>Welcome back!</p>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        
        {/* ===== SUCCESS MESSAGE ===== */}
        {success && (
          <div className="auth-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* ===== LOGIN FORM ===== */}
        {!showForgot ? (
          <form onSubmit={handleLogin} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <button 
                type="button"
                onClick={() => setShowForgot(true)}
                className="forgot-link"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? <Loader size={16} className="spin" /> : 'Sign In'}
            </button>
          </form>
        ) : (
          /* ===== FORGOT PASSWORD FORM ===== */
          <div className="forgot-password-form">
            <h3>Reset Password</h3>
            
            {/* Step 1: Email Input */}
            {resetStep === 'email' && (
              <>
                <p>Enter your email to receive OTP</p>
                <div className="form-group">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={resetLoading}
                  />
                </div>
                <button 
                  className="auth-button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading || !resetEmail}
                >
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Send OTP'}
                </button>
              </>
            )}

            {/* Step 2: OTP Input */}
            {resetStep === 'otp' && (
              <>
                <p>Enter 6-digit OTP sent to <strong>{resetEmail}</strong></p>
                <div className="otp-inputs">
                  {resetOtp.map((digit, index) => (
                    <input
                      key={index}
                      id={`reset-otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleResetOtpChange(index, e.target.value)}
                      className="otp-input"
                      disabled={resetLoading}
                    />
                  ))}
                </div>
                <button 
                  className="auth-button"
                  onClick={handleResetPassword}
                  disabled={resetLoading || resetOtp.join('').length !== 6}
                >
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Verify OTP'}
                </button>

                {/* Resend OTP */}
                <div className="otp-resend">
                  {canResendReset ? (
                    <button 
                      onClick={handleForgotPassword} 
                      disabled={resetLoading}
                      className="resend-button"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="resend-timer">Resend in {resetTimer}s</span>
                  )}
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {resetStep === 'new' && (
              <>
                <p>Enter new password</p>
                <div className="form-group">
                  <div className="password-input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 characters)"
                      disabled={resetLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button 
                  className="auth-button"
                  onClick={handleResetPassword}
                  disabled={resetLoading || newPassword.length < 6}
                >
                  {resetLoading ? <Loader size={16} className="spin" /> : 'Reset Password'}
                </button>
              </>
            )}

            {/* Back to Login Button */}
            <button 
              className="back-button"
              onClick={resetForgotForm}
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* ===== SOCIAL LOGIN DIVIDER ===== */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        {/* ===== SOCIAL BUTTONS ===== */}
        <div className="social-buttons">
          <button 
            className="social-button google"
            onClick={handleGoogleLogin}
            disabled={loading || resetLoading}
          >
            <Chrome size={20} />
            <span>Google</span>
          </button>
          
          <button 
            className="social-button apple"
            onClick={handleAppleLogin}
            disabled={loading || resetLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.9-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* ===== SIGN UP LINK ===== */}
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
