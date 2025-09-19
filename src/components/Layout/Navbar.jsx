import React from 'react';
import { logout } from '../../data/staticMockData';

const Navbar = ({ user, onLogout, currentPage, onNavigate }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          onClick={() => onNavigate('home')}
          className="logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          🏠 Emlak Mikroblog
        </button>
        
        {user && (
          <div className="nav-links">
            <button
              onClick={() => onNavigate('home')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'home' ? '#3b82f6' : '#64748b',
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Ana Sayfa
            </button>
            
            <button
              onClick={() => onNavigate('profile')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'profile' ? '#3b82f6' : '#64748b',
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Profilim
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.avatar && !user.avatar.includes('placeholder') && !user.avatar.includes('ui-avatars') ? (
                <img 
                  src={user.avatar} 
                  alt={`${user.name} avatar`}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ color: '#64748b' }}>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;