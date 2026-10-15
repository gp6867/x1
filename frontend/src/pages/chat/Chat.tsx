import React, { useState, useEffect } from 'react';
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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  // Load chat from URL if exists
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const chatId = pathParts[pathParts.length - 1];
    if (chatId && !isNaN(Number(chatId))) {
      loadChat(Number(chatId));
    }
  }, []);

  const loadChat = async (chatId: number) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setCurrentChatId(chatId);
        const loadedMessages = response.data.chat.messages.map((msg: any, index: number) => ({
          id: `${chatId}-${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp || Date.now())
        }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend API with token
      const response = await axios.post(`${API_URL}/chat/send`, 
        { 
          message: content,
          chat_id: currentChatId 
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // ✅ Token added
          } 
        }
      );

      if (response.data.success) {
        // Save chat ID for future messages
        if (response.data.chat_id) {
          setCurrentChatId(response.data.chat_id);
        }

        // Add AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Show specific error message
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.status === 401) {
        errorText = 'Session expired. Please login again.';
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }
      
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('File selected:', file);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // ✅ Token for upload too
        }
      });

      if (response.data.success) {
        // Add image message
        const imageMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `📎 Image: ${file.name}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, imageMessage]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleVoiceInput = (audioBlob: Blob) => {
    console.log('Voice input received:', audioBlob);
    // You can implement voice-to-text here
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="main-content">
        <ChatHeader 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
          userName={user?.name}
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
                <div className="avatar assistant">
                  <span>AI</span>
                </div>
                <div className="message-bubble">
                  <div className="thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatInput 
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onVoiceInput={handleVoiceInput}
        />
      </div>
    </div>
  );
};

export default Chat;
