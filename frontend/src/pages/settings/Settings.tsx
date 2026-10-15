import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, logout } = useAuthStore();
  const [localLoading, setLocalLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('-');

  useEffect(() => {
    if (isLoading) return;

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && user) {
      setFullName(user.name || user.given_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '-');
      setLocalLoading(false);
    }
    else if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFullName(parsedUser.name || parsedUser.given_name || '');
        setEmail(parsedUser.email || '');
        setPhone(parsedUser.phone || '-');
        setLocalLoading(false);
      } catch (e) {
        navigate('/login', { replace: true });
      }
    }
    else {
      navigate('/login', { replace: true });
    }
  }, [user, token, isAuthenticated, isLoading, navigate]);

  const handleDeleteAccount = async () => {
    const currentToken = token || localStorage.getItem('token');
    
    if (!currentToken) {
      navigate('/login', { replace: true });
      return;
    }

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLocalLoading(true);
        await axios.delete(`${API_URL}/user/profile`,
          { headers: { Authorization: `Bearer ${currentToken}` } }
        );
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/register', { replace: true });
      } catch (err: any) {
        console.error('Delete failed:', err);
        setLocalLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  if (isLoading || localLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #e5e7eb', borderTopColor: '#6b7280', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    header: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    },
    backButton: {
      padding: '8px',
      marginLeft: '-8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      marginLeft: '8px',
      fontSize: '17px',
      fontWeight: '500',
      color: '#000000'
    },
    content: {
      padding: '20px 24px',
      maxWidth: '500px',
      margin: '0 auto'
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    label: {
      fontSize: '15px',
      color: '#666666',
      width: '120px',
      flexShrink: 0
    },
    value: {
      fontSize: '15px',
      color: '#000000',
      flex: 1,
      marginLeft: '16px'
    },
    actionRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    actionLabel: {
      fontSize: '15px',
      color: '#ff3b30'
    },
    actionButton: {
      fontSize: '15px',
      color: '#ff3b30',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 8px',
      fontWeight: '400'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/chat')}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={22} color="#000000" />
        </button>
        <h1 style={styles.title}>Settings</h1>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Name Row */}
        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span style={styles.value}>{fullName || ''}</span>
        </div>

        {/* Email Row */}
        <div style={styles.row}>
          <span style={styles.label}>Email address</span>
          <span style={styles.value}>{email}</span>
        </div>

        {/* Phone Row */}
        <div style={styles.row}>
          <span style={styles.label}>Phone number</span>
          <span style={styles.value}>{phone}</span>
        </div>

        {/* Logout Row */}
        <div style={styles.actionRow}>
          <span style={styles.actionLabel}>Log out of all devices</span>
          <button 
            onClick={handleLogout}
            style={styles.actionButton}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Log out
          </button>
        </div>

        {/* Delete Row */}
        <div style={styles.actionRow}>
          <span style={styles.actionLabel}>Delete account</span>
          <button 
            onClick={handleDeleteAccount}
            style={styles.actionButton}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Settings;
