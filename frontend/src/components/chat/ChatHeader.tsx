import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 👈 Add this
import { Menu, Sun, Moon, Crown } from 'lucide-react';

interface ChatHeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  userName?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onMenuClick, 
  onThemeToggle, 
  isDarkMode,
  userName 
}) => {
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const navigate = useNavigate();  // 👈 Add this

  const handleUpgrade = () => {
    setShowUpgradeMenu(false);
    navigate('/pricing');  // 👈 Go to pricing page
  };

  const handleBrandClick = () => {
    setShowUpgradeMenu(!showUpgradeMenu);
  };

  return (
    <div className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
      </div>
      
      <div className="header-center">
        <div 
          className="brand-container cursor-pointer hover:opacity-80 transition"
          onClick={handleBrandClick}
        >
          <span className="brand-name">Xone AI</span>  {/* 👈 Name changed */}
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
        <button className="theme-toggle" onClick={onThemeToggle}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
