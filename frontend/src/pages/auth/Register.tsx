import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordChecks({
      length: value.length >= 6,
    });
  };

  const isPasswordValid = () => password.length >= 6;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!isPasswordValid()) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(email, password);

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setSuccess('Registration successful! Welcome to Xone AI...');
        setTimeout(() => { window.location.href = '/chat'; }, 1000);
      } else if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => { navigate('/login'); }, 1500);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Xone AI</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome to the future of AI</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
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
                  type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} 
                  placeholder="Create a password" disabled={loading} required 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-xs">
                <span className={passwordChecks.length ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  • At least 6 characters
                </span>
              </div>
            </div>

            <button type="submit" disabled={loading || !isPasswordValid()} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center disabled:opacity-50 mt-2">
              {loading ? <Loader size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

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
                onClick={handleGoogleLogin} disabled={loading}
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
            Already have an account? <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
