import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Crown, Home } from 'lucide-react';

interface ChatHeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  userName?: string;
  showHomeButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onMenuClick, 
  onThemeToggle, 
  isDarkMode,
  userName,
  showHomeButton
}) => {
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = () => {
    setShowUpgradeMenu(false);
    navigate('/pricing');
  };

  const handleBrandClick = () => {
    setShowUpgradeMenu(!showUpgradeMenu);
  };

  return (
    <div className="header">
      {/* flex-shrink-0 aur gap-2 lagaya taaki button dabey nahi */}
      <div className="header-left flex items-center gap-2 shrink-0">
        <button className="mobile-menu-btn flex items-center justify-center" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        
        {/* Guest ke liye Home Button - Size aur alignment fix kiya */}
        {showHomeButton && (
          <button 
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200 ml-1" 
            onClick={() => navigate('/home')}
            title="Go to Home Page"
          >
            <Home size={22} />
          </button>
        )}
      </div>
      
      <div className="header-center">
        <div 
          className="brand-container cursor-pointer hover:opacity-80 transition"
          onClick={handleBrandClick}
        >
          <span className="brand-name">Xone AI</span>
          <Crown size={16} className="crown-icon" />
        </div>
        
        {showUpgradeMenu && (
          <div className="upgrade-menu">
            <button className="upgrade-option" onClick={handleUpgrade}>
              <Crown size={16} />
              <span>Upgrade to Pro</span>
              <span className="pro-badge">PRO</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="header-right">
        <button className="theme-toggle flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={onThemeToggle}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
