import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskManager from '../components/TaskManager';
import Analytics from '../components/Analytics';
import Notifications from '../components/Notifications';
import SessionHistory from '../components/SessionHistory';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickStats, setQuickStats] = useState(null);
  const [sessionType, setSessionType] = useState('Standard'); // 'Standard' or 'Long'
  const [longWorkMinutes, setLongWorkMinutes] = useState(50);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);

    // Fetch analytics for quick stats
    const fetchQuickStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const analyticsResponse = await axios.get('http://localhost:5000/api/analytics', { headers });
        setQuickStats(analyticsResponse.data);
      } catch (err) {
        setQuickStats(null);
      }
    };
    fetchQuickStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🍅 Pomodoro Pro</h1>
            <p>Boost your productivity</p>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{user?.username || 'User'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <nav className="dashboard-sidebar">
          <div className="nav-section">
            <h3>Navigation</h3>
            <ul className="nav-list">
              <li>
                <button 
                  className={`nav-item ${activeTab === 'timer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timer')}
                >
                  <span className="nav-icon">⏰</span>
                  <span className="nav-text">Timer</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tasks')}
                >
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">Tasks</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Analytics</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <span className="nav-icon">🔔</span>
                  <span className="nav-text">Notifications</span>
                </button>
              </li>
              <li>
                <button 
                  className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <span className="nav-icon">📈</span>
                  <span className="nav-text">History</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Quick Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-number">{quickStats ? quickStats.totalSessions : '--'}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{quickStats ? quickStats.focusTimePercentage + '%' : '--'}</span>
                <span className="stat-label">Focus Time</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{quickStats ? quickStats.productivityScore + '%' : '--'}</span>
                <span className="stat-label">Productivity</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="dashboard-content">
          <div className="content-wrapper">
            {activeTab === 'timer' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>⏰ Pomodoro Timer</h2>
                  <p>Focus on your tasks with the Pomodoro technique</p>
                </div>
                <div className="session-type-selector">
                  <label>
                    <input
                      type="radio"
                      value="Standard"
                      checked={sessionType === 'Standard'}
                      onChange={() => setSessionType('Standard')}
                    />
                    Standard
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Long"
                      checked={sessionType === 'Long'}
                      onChange={() => setSessionType('Long')}
                    />
                    Long
                  </label>
                </div>
                {sessionType === 'Long' && (
                  <div className="custom-long-session-inputs">
                    <label>
                      Work Duration:
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={longWorkMinutes}
                        onChange={e => setLongWorkMinutes(Number(e.target.value))}
                        className="custom-input"
                      />
                      min
                    </label>
                    <label>
                      Break Duration:
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={longBreakMinutes}
                        onChange={e => setLongBreakMinutes(Number(e.target.value))}
                        className="custom-input"
                      />
                      min
                    </label>
                  </div>
                )}
                <PomodoroTimer sessionType={sessionType} longWorkMinutes={longWorkMinutes} longBreakMinutes={longBreakMinutes} />
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>📝 Task Manager</h2>
                  <p>Organize and track your tasks efficiently</p>
                </div>
                <TaskManager />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="tab-content">
                <Analytics />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="tab-content">
                <Notifications />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>📈 Session History</h2>
                  <p>Review your past productivity sessions</p>
                </div>
                <SessionHistory />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;