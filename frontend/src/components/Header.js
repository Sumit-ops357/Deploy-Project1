import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import './Header.css';

function Header() {
  const { dark, setDark } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <span>Productivity & Pomodoro Dashboard</span>
      <div>
        <button onClick={() => setDark(d => !d)} className="theme-toggle">
          {dark ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;