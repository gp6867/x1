import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import Sidebar from '../../components/layout/Sidebar';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatNew: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/send`,
        { message: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="main-content">
        <ChatHeader 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
        />
        
        <div className="messages-container">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-content">
                <div className="avatar assistant">AI</div>
                <div className="message-bubble">
                  <div className="thinking">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatNew;
