import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

// Core Pages (Kept as standard imports so initial load is fast)
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Lazy Loaded Pages (Improves INP / Core Web Vitals)
const Chat = lazy(() => import('./pages/chat/Chat'));
const ChatNew = lazy(() => import('./pages/chat/ChatNew'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const CompareChatGPT = lazy(() => import('./pages/CompareChatGPT'));
const ChatGPTAlternative = lazy(() => import('./pages/ChatGPTAlternative'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const OAuthCallback = lazy(() => import('./pages/oauth/Callback'));
const AIVideo = lazy(() => import('./pages/ai/AIVideo'));
const AIImages = lazy(() => import('./pages/ai/AIImages'));

import './App.css';

// GA4 Page View Tracker
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

// Loading Fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <PageViewTracker />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* SEO & Marketing */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
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
      </Suspense>
    </Router>
  );
}

export default App;
