import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, ExternalLink } from 'lucide-react';
import MessageActions from './MessageActions';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  role, 
  timestamp,
  imageUrl,
  onLike,
  onDislike,
  onCopy,
  onRegenerate 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image click to open in new tab
  const handleImageClick = () => {
    if (imageUrl) {
      console.log('🖼️ Opening image:', imageUrl);
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`group message-wrapper ${role}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="message-content">
        {role === 'assistant' && (
          <div className="avatar assistant">
            <Sparkles size={18} />
          </div>
        )}
        {role === 'user' && (
          <div className="avatar user">
            <span>U</span>
          </div>
        )}
        <div className="message-bubble relative">
          {/* Message Text */}
          {content && content !== '📎 Image' && content !== '📎 Sent an image' && (
            <p className="text-[15px] leading-relaxed text-token-text-primary">
              {content}
            </p>
          )}
          
          {/* Image Display - with click to open */}
          {imageUrl && !imageError && (
            <div className="mt-2 mb-1">
              <div 
                onClick={handleImageClick}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  cursor: 'pointer',
                  maxWidth: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb'
                }}
                title="Click to open full size"
              >
                <img 
                  src={imageUrl}
                  alt="Uploaded content"
                  style={{
                    maxWidth: '300px',
                    maxHeight: '300px',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.2s'
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', imageUrl);
                    setImageLoaded(true);
                  }}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', imageUrl);
                    setImageError(true);
                  }}
                  loading="lazy"
                />
                
                {/* Hover effect indicator */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none'
                }}
                className="image-open-indicator">
                  <ExternalLink size={12} />
                  <span>Open</span>
                </div>
              </div>
              
              {/* Style for hover effect */}
              <style>{`
                .message-bubble div:hover .image-open-indicator {
                  opacity: 1 !important;
                }
                .message-bubble img:hover {
                  transform: scale(1.02);
                }
              `}</style>
            </div>
          )}
          
          {/* Image Error Fallback */}
          {imageError && (
            <div style={{
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              color: '#6b7280',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <ImageIcon size={18} />
              <span>Image failed to load</span>
            </div>
          )}
          
          {/* Timestamp */}
          <span className="timestamp">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {/* Actions - LEFT side (ChatGPT style) */}
          {role === 'assistant' && (
            <div className={`absolute -bottom-8 left-0 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <MessageActions
                text={content}
                onLike={onLike}
                onDislike={onDislike}
                onCopy={onCopy}
                onRegenerate={onRegenerate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
