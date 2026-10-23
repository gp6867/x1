import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import MessageActions from './MessageActions';
import CodeBlock from './CodeBlock';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  chatId?: string | null;
  messageIndex?: number;
  initialFeedback?: 'like' | 'dislike' | null;
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
  chatId,
  messageIndex,
  initialFeedback,
  onLike,
  onDislike,
  onCopy,
  onRegenerate 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageClick = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`group message-wrapper ${role}`}>
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
          {content && content !== '📎 Image' && content !== '📎 Sent an image' && (
            role === 'assistant' ? (
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    code(props: any) {
                      const { inline, className, children } = props;
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      const hasLang = !!match;
                      const hasNewlines = codeString.includes('\n');

                      // Multi-line block OR has language tag → code block
                      if (!inline && (hasLang || hasNewlines)) {
                        return (
                          <CodeBlock
                            language={match?.[1] || 'text'}
                            code={codeString}
                          />
                        );
                      }

                      // Inline code
                      return <code className="inline-code">{children}</code>;
                    },
                    a(props: any) {
                      return (
                        <a
                          href={props.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.children}
                        </a>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-[15px] leading-relaxed text-token-text-primary">
                {content}
              </p>
            )
          )}
          
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
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
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
          
          <span className="timestamp">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {role === 'assistant' && (
            <div className="mt-2">
              <MessageActions
                text={content}
                chatId={chatId}
                messageIndex={messageIndex}
                initialFeedback={initialFeedback}
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
