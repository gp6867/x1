import { useState, useEffect } from "react";
import { Heart, Copy, RotateCw, Check } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type Feedback = 'like' | 'dislike' | null;

interface MessageActionsProps {
  text: string;
  chatId?: string | null;
  messageIndex?: number;
  initialFeedback?: Feedback;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export default function MessageActions({ 
  text,
  chatId,
  messageIndex,
  initialFeedback = null,
  onLike, 
  onDislike, 
  onCopy,
  onRegenerate 
}: MessageActionsProps) {
  const { token } = useAuthStore();
  const [feedback, setFeedback] = useState<Feedback>(initialFeedback);
  const [copied, setCopied] = useState(false);

  // ✅ Debug — har render par
  console.log('[MessageActions] render:', {
    chatId,
    messageIndex,
    initialFeedback,
    currentFeedback: feedback,
    hasToken: !!token,
    tokenPreview: token ? token.slice(0, 20) + '...' : null,
  });

  useEffect(() => {
    setFeedback(initialFeedback);
  }, [initialFeedback]);

  const saveFeedback = async (newFeedback: Feedback) => {
    console.log('[FEEDBACK] saveFeedback called:', {
      chatId,
      messageIndex,
      hasToken: !!token,
      newFeedback,
    });

    // Optimistic update
    setFeedback(newFeedback);

    // Guard
    if (!chatId || messageIndex === undefined || !token) {
      console.warn('[FEEDBACK] Guard failed — missing:', {
        chatIdMissing: !chatId,
        messageIndexMissing: messageIndex === undefined,
        tokenMissing: !token,
      });
      return;
    }

    try {
      console.log('[FEEDBACK] POSTing...');
      const res = await axios.post(
        `${API_URL}/chat/feedback`,
        { 
          chat_id: chatId, 
          message_index: messageIndex, 
          feedback: newFeedback 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[FEEDBACK] Success:', res.status, res.data);
    } catch (err: any) {
      console.error('[FEEDBACK] Failed:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      // Revert on failure
      setFeedback(initialFeedback);
    }
  };

  const handleLike = () => {
    const newFeedback = feedback === 'like' ? null : 'like';
    saveFeedback(newFeedback);
    onLike?.();
  };

  const handleDislike = () => {
    const newFeedback = feedback === 'dislike' ? null : 'dislike';
    saveFeedback(newFeedback);
    onDislike?.();
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const buttonClass = "text-token-text-secondary hover:bg-token-bg-secondary rounded-lg";
  const iconWrapperClass = "flex items-center justify-center touch:w-10 h-8 w-8";

  return (
    <div className="flex items-center gap-1 justify-start">
      <button 
        className={buttonClass}
        aria-label="Good response"
        aria-pressed={feedback === 'like'}
        onClick={handleLike}
        title={feedback === 'like' ? "Unlike" : "Like"}
      >
        <span className={iconWrapperClass}>
          <Heart 
            size={20} 
            className={feedback === 'like' ? "text-red-500 fill-red-500" : "text-gray-400"} 
          />
        </span>
      </button>

      <button 
        className={buttonClass}
        aria-label="Bad response"
        aria-pressed={feedback === 'dislike'}
        onClick={handleDislike}
        title={feedback === 'dislike' ? "Remove dislike" : "Dislike"}
      >
        <span className={iconWrapperClass}>
          <Heart 
            size={20} 
            className={feedback === 'dislike' ? "text-gray-600 fill-gray-600 rotate-180" : "text-gray-400 rotate-180"} 
          />
        </span>
      </button>

      <button 
        className={buttonClass}
        aria-label="Copy"
        onClick={copyText}
        title={copied ? "Copied!" : "Copy"}
      >
        <span className={iconWrapperClass}>
          {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
        </span>
      </button>

      <button 
        className={buttonClass}
        aria-label="Regenerate"
        onClick={onRegenerate}
        title="Regenerate response"
      >
        <span className={iconWrapperClass}>
          <RotateCw size={20} />
        </span>
      </button>
    </div>
  );
}
