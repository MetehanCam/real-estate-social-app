import React, { useState, useEffect } from 'react';
import { getCurrentUser } from './data/staticMockData';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Timeline from './components/Posts/Timeline';
import Profile from './components/Profile/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setAuthMode('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        Loading...
      </div>
    );
  }

  // If user is not logged in, show auth forms
  if (!user) {
    return (
      <div className="App">
        <Navbar user={null} />
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          {authMode === 'login' ? (
            <Login 
              onLogin={handleLogin}
              onSwitchToSignup={() => setAuthMode('signup')}
            />
          ) : (
            <Signup 
              onSignup={handleSignup}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </main>
      </div>
    );
  }

  // User is logged in, show main app
  return (
    <div className="App">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {currentPage === 'home' && <Timeline />}
        {currentPage === 'profile' && <Profile user={user} />}
      </main>
    </div>
  );
}

export default App;