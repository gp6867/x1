import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const createWelcomeMessage = (): Message => ({
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! How can I help you today?',
  timestamp: new Date(),
});

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const { user, token } = useAuthStore();
  const location = useLocation();

  // ✅ Extract chatId from URL (reactive to navigation)
  const chatIdFromUrl = (() => {
    const match = location.pathname.match(/\/chat\/(\d+)/);
    return match ? Number(match[1]) : null;
  })();

  // ✅ Reload chat whenever URL or token changes
  useEffect(() => {
    if (!token) return; // wait for auth hydration

    if (!chatIdFromUrl) {
      // /chat or /chat/new — fresh conversation
      setCurrentChatId(null);
      setMessages([createWelcomeMessage()]);
      return;
    }

    loadChat(chatIdFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromUrl, token]);

  const loadChat = async (chatId: number) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const chatMessages = response.data?.chat?.messages;

      if (response.data?.success && Array.isArray(chatMessages) && chatMessages.length > 0) {
        setCurrentChatId(chatId);
        const loadedMessages: Message[] = chatMessages.map((msg: any, index: number) => ({
          id: `${chatId}-${index}`,
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: typeof msg.content === 'string' ? msg.content : '',
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
        setMessages(loadedMessages);
      } else {
        // Chat exists but empty, OR chat not found — show welcome
        setCurrentChatId(chatId);
        setMessages([createWelcomeMessage()]);
      }
    } catch (error: any) {
      console.error('Failed to load chat:', error);
      // ✅ Never blank the page — keep a friendly message
      setCurrentChatId(chatId);
      setMessages([{
        id: 'error',
        role: 'assistant',
        content: 'Could not load previous messages. You can still start a new conversation below.',
        timestamp: new Date(),
      }]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { message: content, chat_id: currentChatId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.chat_id) {
          setCurrentChatId(response.data.chat_id);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error: any) {
      console.error('Chat error:', error);

      let errorText = 'Sorry, I encountered an error. Please try again.';

      if (error.response?.status === 401) {
        errorText = 'Session expired. Please login again.';
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

    if (!lastUserMessage) {
      console.warn('No user message to regenerate from');
      return;
    }

    const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
    let messagesWithoutLastAssistant = messages;
    if (lastAssistantIndex !== -1) {
      const actualIndex = messages.length - 1 - lastAssistantIndex;
      messagesWithoutLastAssistant = messages.filter((_, idx) => idx !== actualIndex);
    }

    setMessages(messagesWithoutLastAssistant);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { message: lastUserMessage.content, chat_id: currentChatId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.chat_id) {
          setCurrentChatId(response.data.chat_id);
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to regenerate');
      }
    } catch (error: any) {
      console.error('Regenerate error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Failed to regenerate response. Please try again.',
        timestamp: new Date(),
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
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const imageMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `📎 Image: ${file.name}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, imageMessage]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleVoiceInput = (audioBlob: Blob) => {
    console.log('Voice input received:', audioBlob);
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
              onRegenerate={message.role === 'assistant' ? handleRegenerate : undefined}
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
