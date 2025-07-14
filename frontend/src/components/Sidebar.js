import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Pomodoro</h2>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/">Pomodoro Timer</Link>
        <Link to="/">Tasks</Link>
        <Link to="/">Analytics</Link>
      </nav>
    </div>
  );
}

export default Sidebar;