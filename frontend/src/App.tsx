import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

// Core Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Terms from './pages/Terms';

// SEO & Comparison Pages
import CompareChatGPT from './pages/CompareChatGPT';
import ChatGPTAlternative from './pages/ChatGPTAlternative';

// App Pages
import Chat from './pages/chat/Chat';
import ChatNew from './pages/chat/ChatNew';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Settings from './pages/settings/Settings';
import OAuthCallback from './pages/oauth/Callback';

// AI Pages
import AIVideo from './pages/ai/AIVideo';
import AIImages from './pages/ai/AIImages';

import './App.css';

// GA4 Page View Tracker
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
        {/* SEO & Marketing */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Comparison & Alternatives */}
        <Route path="/compare/monsterx-vs-chatgpt" element={<CompareChatGPT />} />
        <Route path="/alternatives/chatgpt" element={<ChatGPTAlternative />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        
        {/* Chat */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/chat/new" element={<ChatNew />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* AI Features */}
        <Route path="/ai-video" element={<AIVideo />} />
        <Route path="/ai-images" element={<AIImages />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
