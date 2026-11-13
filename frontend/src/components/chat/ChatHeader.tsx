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
    <div className="header" style={{ position: 'relative', zIndex: 10 }}>
      <div className="header-left flex items-center gap-2 shrink-0">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        
        {/* Guest ke liye Home Button - Solid Green Background */}
        {showHomeButton && (
          <button 
            style={{ 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#10b981', // Green background
              color: '#ffffff', // White icon
              borderRadius: '8px',
              marginLeft: '12px',
              border: 'none',
              cursor: 'pointer',
              zIndex: 999, // Taaki kisi ke piche na chhupe
              position: 'relative',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
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
        <button className="theme-toggle" onClick={onThemeToggle}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
