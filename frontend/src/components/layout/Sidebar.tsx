import React, { useState, useEffect } from 'react';
import { Plus, Menu, MessageSquare, Settings, LogOut, Search, Image, Video } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

// ===== API BASE URL =====
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Chat {
  id: string;   // ✅ UUID string
  title: string;
  updated_at: string;
  created_at: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);   // ✅ string
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============= LOAD CHAT HISTORY =============
  useEffect(() => {
    if (isAuthenticated && token) {
      loadChatHistory();
    }
  }, [isAuthenticated, token]);

  // ============= SET ACTIVE CHAT FROM URL (UUID ya integer) =============
  useEffect(() => {
    const match = location.pathname.match(/\/chat\/([a-f0-9-]{36}|\d+)/i);
    setActiveChat(match ? match[1] : null);
  }, [location.pathname]);

  // ============= LOAD CHAT HISTORY FROM API =============
  const loadChatHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Fetching chat history from:', `${API_URL}/chat/history`);
      
      const response = await fetch(`${API_URL}/chat/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('📦 Raw response:', text.substring(0, 200));

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e);
        setChats([]);
        return;
      }

      console.log('✅ Parsed data:', data);

      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats);
        console.log(`✅ Loaded ${data.chats.length} chats`);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error('❌ Failed to load chats:', error);
      setError('Failed to load chats');
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  // ============= HANDLE NEW CHAT =============
  const handleNewChat = async () => {
    console.log('➕ New chat clicked');
    
    try {
      const response = await fetch(`${API_URL}/chat/new`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: "New conversation" })
      });
      
      const data = await response.json();
      if (data.success) {
        navigate(`/chat/${data.chat_id}`);
        loadChatHistory();
      } else {
        navigate('/chat/new');
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
      navigate('/chat/new');
    }
  };

  // ============= HANDLE LOGOUT =============
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ============= HANDLE AI IMAGES =============
  const handleAIImages = () => {
    console.log('🎨 AI Images clicked');
    navigate('/ai-images');
  };

  // ============= HANDLE AI VIDEO (NEW) =============
  const handleAIVideo = () => {
    console.log('🎬 AI Video clicked');
    navigate('/ai-video');
  };

  // ============= HANDLE SETTINGS =============
  const handleSettings = () => {
    console.log('⚙️ Settings clicked');
    navigate('/settings');
  };

  // ============= HANDLE CHAT SELECT (string - UUID ya integer) =============
  const handleChatSelect = (chatId: string) => {
    console.log(`💬 Selecting chat: ${chatId}`);
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  // ============= FILTER CHATS BY SEARCH =============
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============= FORMAT TIMESTAMP =============
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  };

  // ============= DON'T RENDER IF NOT AUTHENTICATED =============
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* ===== SIDEBAR HEADER ===== */}
      <div className="sidebar-header">
        <button 
          className="new-chat-btn" 
          onClick={handleNewChat} 
          title="Start new chat"
        >
          <Plus size={16} />
          <span>New chat</span>
        </button>
        <button 
          className="menu-toggle" 
          onClick={onToggle} 
          title="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="sidebar-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search chat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="clear-search"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* ===== AI IMAGES BUTTON - COMMENTED (baad mein kaam aa sakta hai) ===== */}
      {/* 
      <button 
        className="ai-images-btn" 
        onClick={handleAIImages}
        title="Generate AI Images"
      >
        <Image size={18} />
        <span>AI Images</span>
      </button>
      */}

      {/* ===== AI VIDEO BUTTON - COMMENTED (baad mein kaam aa sakta hai) ===== */}
      {/* 
      <button 
        className="ai-video-btn" 
        onClick={handleAIVideo}
        title="Generate AI Videos - Photo + Video = Magic!"
      >
        <Video size={18} />
        <span>AI Video</span>
      </button>
      */}

      {/* ===== RECENT CHATS SECTION ===== */}
      <div className="chat-history">
        <div className="history-header">
          <span className="history-title">Recent chats</span>
          {chats.length > 0 && (
            <span className="history-count">{chats.length}</span>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="history-item loading">
            <div className="loading-spinner"></div>
            <span>Loading chats...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="history-item error">
            <span className="error-text">{error}</span>
            <button 
              className="retry-btn"
              onClick={loadChatHistory}
              title="Retry"
            >
              ⟳
            </button>
          </div>
        )}

        {/* No Chats State */}
        {!loading && !error && filteredChats.length === 0 && (
          <div className="history-item empty">
            <MessageSquare size={16} className="empty-icon" />
            <span>
              {searchQuery 
                ? 'No chats found' 
                : 'Start a new conversation!'}
            </span>
          </div>
        )}

        {/* Chat History Items - REAL DATA */}
        {!loading && !error && filteredChats.map((chat) => (
          <div 
            key={chat.id}
            className={`history-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => handleChatSelect(chat.id)}
            title={chat.title}
          >
            <MessageSquare size={16} className="chat-icon" />
            <div className="chat-info">
              <span className="chat-title">{chat.title}</span>
              <span className="chat-time">
                {formatTime(chat.updated_at || chat.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== SIDEBAR FOOTER ===== */}
      <div className="sidebar-footer">
        <div 
          className={`history-item ${location.pathname === '/settings' ? 'active' : ''}`}
          onClick={handleSettings}
          title="Settings"
        >
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <div 
          className="history-item" 
          onClick={handleLogout}
          title="Log out"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
