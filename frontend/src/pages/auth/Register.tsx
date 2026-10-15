import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle, Loader, Eye, EyeOff, Chrome } from 'lucide-react';
import { authAPI } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Password validation
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false
  });

  // Handle password change with validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordChecks({
      length: value.length >= 6,
      number: /\d/.test(value),
      uppercase: /[A-Z]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    });
  };

  // Check if password is valid
  const isPasswordValid = () => {
    return password.length >= 6;
  };

  // Handle register submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isPasswordValid()) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.register(email, password);
      
      if (response.data.success) {
        setSuccess('OTP sent to your email!');
        setStep('otp');
        startTimer();
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Timer for OTP resend
  const startTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP submit
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP(email, otpString);
      
      if (response.data.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await authAPI.resendOTP(email);
      setSuccess('OTP resent successfully!');
      startTimer();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // Handle Apple Login
  const handleAppleLogin = () => {
    window.location.href = `${API_URL}/auth/apple`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo/Brand */}
        <div className="auth-brand">
          <h1>Xone AI</h1>
          <p>Welcome to the future of AI</p>
        </div>

        {/* Error/Success Messages */}
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

        {step === 'register' ? (
          /* Registration Form */
          <form onSubmit={handleRegister} className="auth-form">
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a password"
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
              
              {/* Password requirements */}
              <div className="password-checks">
                <div className={passwordChecks.length ? 'valid' : 'invalid'}>
                  • At least 6 characters
                </div>
                <div className={passwordChecks.number ? 'valid' : 'invalid'}>
                  • Contains number
                </div>
                <div className={passwordChecks.uppercase ? 'valid' : 'invalid'}>
                  • Contains uppercase letter
                </div>
                <div className={passwordChecks.special ? 'valid' : 'invalid'}>
                  • Contains special character
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading || !isPasswordValid()}
            >
              {loading ? <Loader size={16} className="spin" /> : 'Create Account'}
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <div className="otp-verification">
            <h3>Verify Your Email</h3>
            <p>We've sent a 6-digit OTP to <strong>{email}</strong></p>
            
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="otp-input"
                  disabled={loading}
                />
              ))}
            </div>

            <button 
              className="auth-button"
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? <Loader size={16} className="spin" /> : 'Verify Email'}
            </button>

            <div className="otp-resend">
              <p>Didn't receive OTP?</p>
              {canResend ? (
                <button onClick={handleResendOTP} disabled={loading}>
                  Resend OTP
                </button>
              ) : (
                <span>Resend in {timer}s</span>
              )}
            </div>
          </div>
        )}

        {/* 🔥 SOCIAL BUTTONS - YAHAN लाए (form के बाद) */}
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">
          <button 
            className="social-button google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome size={20} />
            <span>Google</span>
          </button>
          
          <button 
            className="social-button apple"
            onClick={handleAppleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.9-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
