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

const Chat: React.FC = () => {
  // ✅ FIX: Initial state khali — welcome message render-only hoga
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<number, 'like' | 'dislike'>>({});
  const { user, token } = useAuthStore();
  const location = useLocation();

  const chatIdFromUrl = (() => {
    const match = location.pathname.match(/\/chat\/([a-f0-9-]{36}|\d+)/i);
    return match ? match[1] : null;
  })();

  useEffect(() => {
    if (!token) return;

    if (!chatIdFromUrl) {
      setCurrentChatId(null);
      setMessages([]);         // ✅ khali — welcome render-only
      setFeedbackMap({});
      return;
    }

    loadChat(chatIdFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromUrl, token]);

  const loadChat = async (chatId: string) => {
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

        // ✅ Feedback fetch — index ab backend ke messages array se match karega
        try {
          const fbRes = await axios.get(`${API_URL}/chat/feedback/${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (fbRes.data?.success) {
            setFeedbackMap(fbRes.data.feedback || {});
          }
        } catch (fbErr) {
          console.warn('Feedback load failed:', fbErr);
          setFeedbackMap({});
        }
      } else {
        setCurrentChatId(chatId);
        setMessages([]);         // ✅ khali — welcome render-only
        setFeedbackMap({});
      }
    } catch (error: any) {
      console.error('Failed to load chat:', error);
      setCurrentChatId(chatId);
      setMessages([]);
      setFeedbackMap({});
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
          {/* ✅ Welcome message — render-only, state mein count nahi hota */}
          {messages.length === 0 && !isLoading && (
            <MessageBubble
              content="Hello! How can I help you today?"
              role="assistant"
              timestamp={new Date()}
              chatId={null}
              messageIndex={undefined}
              initialFeedback={null}
            />
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              chatId={currentChatId}
              messageIndex={message.role === 'assistant' ? index : undefined}
              initialFeedback={feedbackMap[index] || null}
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
