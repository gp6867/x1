import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, RotateCw } from "lucide-react";

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

  const copyText = () => {
    navigator.clipboard.writeText(text);
    onCopy?.();
  };

  // ChatGPT exact classes
  const buttonClass = "text-token-text-secondary hover:bg-token-bg-secondary rounded-lg";
  const iconWrapperClass = "flex items-center justify-center touch:w-10 h-8 w-8";

  return (
    <div className="flex items-center gap-1">
      {/* Like Button */}
      <button 
        className={buttonClass}
        aria-label="Good response"
        aria-pressed={liked}
        onClick={handleLike}
      >
        <span className={iconWrapperClass}>
          <ThumbsUp size={20} className={liked ? "text-[#10a37f]" : ""} />
        </span>
      </button>

      {/* Dislike Button */}
      <button 
        className={buttonClass}
        aria-label="Bad response"
        aria-pressed={disliked}
        onClick={handleDislike}
      >
        <span className={iconWrapperClass}>
          <ThumbsDown size={20} className={disliked ? "text-red-500" : ""} />
        </span>
      </button>

      {/* Copy Button */}
      <button 
        className={buttonClass}
        aria-label="Copy"
        onClick={copyText}
      >
        <span className={iconWrapperClass}>
          <Copy size={20} />
        </span>
      </button>

      {/* Regenerate Button */}
      <button 
        className={buttonClass}
        aria-label="Regenerate"
        onClick={onRegenerate}
      >
        <span className={iconWrapperClass}>
          <RotateCw size={20} />
        </span>
      </button>
    </div>
  );
}
