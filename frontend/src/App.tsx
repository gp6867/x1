import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/new" element={<ChatNew />} />
        <Route path="/ai-video" element={<AIVideo />} />
        <Route path="/ai-images" element={<AIImages />} />
        <Route path="/pricing" element={<Pricing />} />       
        <Route path="/settings" element={<Settings />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
