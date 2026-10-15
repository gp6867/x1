import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    console.log('OAuth Callback - Token:', token);
    console.log('OAuth Callback - User:', userStr);

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('Parsed user:', user);
        
        // Save to localStorage and store
        login(user, token);
        
        // Redirect to chat
        navigate('/chat');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login');
      }
    } else {
      console.error('Missing token or user');
      navigate('/login');
    }
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Logging you in...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallback;
