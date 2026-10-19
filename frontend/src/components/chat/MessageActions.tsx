import { useState } from "react";
import { Heart, Copy, RotateCw, Check } from "lucide-react";

interface MessageActionsProps {
  text: string;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export default function MessageActions({ 
  text, 
  onLike, 
  onDislike, 
  onCopy,
  onRegenerate 
}: MessageActionsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    onLike?.();
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
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

  // ChatGPT exact classes
  const buttonClass = "text-token-text-secondary hover:bg-token-bg-secondary rounded-lg";
  const iconWrapperClass = "flex items-center justify-center touch:w-10 h-8 w-8";

  return (
    <div className="flex items-center gap-1 justify-start">
      {/* Like Button - LEFT SIDE + RED HEART */}
      <button 
        className={buttonClass}
        aria-label="Good response"
        aria-pressed={liked}
        onClick={handleLike}
        title={liked ? "Unlike" : "Like"}
      >
        <span className={iconWrapperClass}>
          <Heart 
            size={20} 
            className={liked ? "text-red-500 fill-red-500" : "text-gray-400"} 
          />
        </span>
      </button>

      {/* Dislike Button */}
      <button 
        className={buttonClass}
        aria-label="Bad response"
        aria-pressed={disliked}
        onClick={handleDislike}
        title={disliked ? "Remove dislike" : "Dislike"}
      >
        <span className={iconWrapperClass}>
          <Heart 
            size={20} 
            className={disliked ? "text-gray-600 fill-gray-600 rotate-180" : "text-gray-400 rotate-180"} 
          />
        </span>
      </button>

      {/* Copy Button - with copied feedback */}
      <button 
        className={buttonClass}
        aria-label="Copy"
        onClick={copyText}
        title={copied ? "Copied!" : "Copy"}
      >
        <span className={iconWrapperClass}>
          {copied ? (
            <Check size={20} className="text-green-500" />
          ) : (
            <Copy size={20} />
          )}
        </span>
      </button>

      {/* Regenerate Button */}
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
