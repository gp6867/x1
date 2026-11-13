import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Crown, Home } from 'lucide-react';

interface ChatHeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  userName?: string;
  showHomeButton?: boolean; // Naya prop add kiya
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onMenuClick, 
  onThemeToggle, 
  isDarkMode,
  userName,
  showHomeButton // Destructure kiya
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
      <div className="header-left flex items-center">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        
        {/* Guest ke liye Home Button (Left side) */}
        {showHomeButton && (
          <button 
            className="mobile-menu-btn ml-2" 
            onClick={() => navigate('/home')}
            title="Go to Home Page"
          >
            <Home size={20} />
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
        <button className="theme-toggle" onClick={onThemeToggle}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
