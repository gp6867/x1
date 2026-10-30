import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import Sidebar from '../../components/layout/Sidebar';
import { useAuthStore } from '../../store/authStore';
import SEO from '../../components/SEO';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Chat: React.FC = () => {
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

  const effectiveChatId = currentChatId || chatIdFromUrl;

  useEffect(() => {
    if (!token) {
      if (!chatIdFromUrl) {
        setMessages([]);
        setFeedbackMap({});
      }
      return;
    }

    if (!chatIdFromUrl) {
      setCurrentChatId(null);
      setMessages([]);
      setFeedbackMap({});
      return;
    }

    loadChat(chatIdFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromUrl, token]);

  const loadChat = async (chatId: string) => {
    if (!token) return; 
    
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
          imageUrl: msg.image_url || undefined,
        }));
        setMessages(loadedMessages);

        try {
          const fbRes = await axios.get(`${API_URL}/chat/feedback/${chatId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (fbRes.data?.success) setFeedbackMap(fbRes.data.feedback || {});
        } catch (fbErr) {
          setFeedbackMap({});
        }
      } else {
        setCurrentChatId(chatId);
        setMessages([]);
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

    // ===== GUEST MODE LOGIC (BINA LOGIN) =====
    if (!token) {
      const count = parseInt(localStorage.getItem('guest_msg_count') || '0', 10);
      
      if (count >= 5) {
        alert("You have reached the limit of 5 free messages. Please login or register to continue.");
        window.location.href = '/register';
        return;
      }
      
      localStorage.setItem('guest_msg_count', (count + 1).toString());
      
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      try {
        const response = await axios.post(`${API_URL}/chat/guest`, { message: content });
        
        if (response.data.success) {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(), role: 'assistant', content: response.data.message, timestamp: new Date()
          }]);
        }
      } catch (error: any) {
        console.error('Guest Chat Error:', error);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date()
        }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ===== NORMAL LOGGED-IN LOGIC =====
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/send`, { message: content, chat_id: currentChatId }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        if (response.data.chat_id) setCurrentChatId(response.data.chat_id);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant', content: response.data.message, timestamp: new Date()
        }]);
      }
    } catch (error: any) {
      let errorText = 'Sorry, I encountered an error. Please try again.';
      if (error.response?.status === 401) {
        errorText = 'Session expired. Please login again.';
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: errorText, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!token) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
    let messagesWithoutLastAssistant = messages;
    if (lastAssistantIndex !== -1) {
      const actualIndex = messages.length - 1 - lastAssistantIndex;
      messagesWithoutLastAssistant = messages.filter((_, idx) => idx !== actualIndex);
    }

    setMessages(messagesWithoutLastAssistant);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/send`, { message: lastUserMessage.content, chat_id: currentChatId }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        if (response.data.chat_id) setCurrentChatId(response.data.chat_id);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant', content: response.data.message, timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Failed to regenerate response.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, text: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post(`${API_URL}/upload/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });

      if (!uploadRes.data.success || !uploadRes.data.url) throw new Error('Upload failed');
      const imageUrl = uploadRes.data.url;

      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text || '', timestamp: new Date(), imageUrl };
      setMessages(prev => [...prev, userMessage]);

      const chatRes = await axios.post(`${API_URL}/chat/send`, { message: text || 'What is in this image?', image_url: imageUrl, chat_id: currentChatId }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (chatRes.data.success) {
        if (chatRes.data.chat_id) setCurrentChatId(chatRes.data.chat_id);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: chatRes.data.message, timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Failed to process image.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <SEO
        title="Chat with MonsterX AI — Free AI Assistant"
        description="Chat with MonsterX AI. Real memory, coding agent, and image vision. Start free without a credit card."
        canonical="https://www.xoneai.in/chat"
        robots={chatIdFromUrl ? "noindex, follow" : "index, follow"}
      />
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content">
          <ChatHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} onThemeToggle={toggleTheme} isDarkMode={isDarkMode} userName={user?.name} />
          <div className="messages-container">
            {messages.length === 0 && !isLoading && (
              <MessageBubble content="Hello! How can I help you today?" role="assistant" timestamp={new Date()} chatId={null} messageIndex={undefined} initialFeedback={null} />
            )}
            {messages.map((message, index) => (
              <MessageBubble key={message.id} content={message.content} role={message.role} timestamp={message.timestamp} imageUrl={message.imageUrl} chatId={effectiveChatId} messageIndex={message.role === 'assistant' ? index : undefined} initialFeedback={feedbackMap[index] || null} onRegenerate={message.role === 'assistant' ? handleRegenerate : undefined} />
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-content">
                  <div className="avatar assistant"><span>AI</span></div>
                  <div className="message-bubble"><div className="thinking"><span></span><span></span><span></span></div></div>
                </div>
              </div>
            )}
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
        </div>
      </div>
    </>
  );
};

export default Chat;
