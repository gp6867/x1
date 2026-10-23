import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
import Chat from './pages/chat/Chat';
import ChatNew from './pages/chat/ChatNew';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AIVideo from './pages/ai/AIVideo';
import AIImages from './pages/ai/AIImages';
import Pricing from './pages/Pricing';
import OAuthCallback from './pages/oauth/Callback';
import Settings from './pages/settings/Settings';
import './App.css';

// ✅ GA4 Page View Tracker — har route change par page view bhejta hai
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <PageViewTracker />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        {/* ✅ NEW: chat with specific ID — ye missing tha */}
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/chat/new" element={<ChatNew />} />
        <Route path="/ai-video" element={<AIVideo />} />
        <Route path="/ai-images" element={<AIImages />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
        {/* ✅ NEW: 404 fallback — galat URL par blank ke bajaye chat par bhejo */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
