import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setIsEnabled(permission === 'granted');
      });
    }
  }, []);

  const addNotification = (title, body, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      body,
      type,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if enabled
    if (isEnabled && 'Notification' in window) {
      new Notification(title, { body });
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(notif => !notif.read));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'break': return '☕';
      case 'session': return '⏰';
      default: return 'ℹ️';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success': return 'notification-success';
      case 'warning': return 'notification-warning';
      case 'error': return 'notification-error';
      case 'break': return 'notification-break';
      case 'session': return 'notification-session';
      default: return 'notification-info';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>🔔 Smart Notifications</h3>
        <div className="notification-controls">
          <button 
            className={`permission-btn ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => {
              if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                  setIsEnabled(permission === 'granted');
                });
              }
            }}
          >
            {isEnabled ? '🔔 Enabled' : '🔕 Disabled'}
          </button>
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
          <button className="clear-read-btn" onClick={clearRead}>
            Clear Read
          </button>
        </div>
      </div>

      <div className="notification-demo">
        <h4>Test Notifications</h4>
        <div className="demo-buttons">
          <button 
            className="demo-btn session"
            onClick={() => addNotification('Session Started!', 'Time to focus for 25 minutes.', 'session')}
          >
            Start Session
          </button>
          <button 
            className="demo-btn break"
            onClick={() => addNotification('Break Time!', 'Take a 5-minute break.', 'break')}
          >
            Break Reminder
          </button>
          <button 
            className="demo-btn success"
            onClick={() => addNotification('Task Completed!', 'Great job on finishing your task.', 'success')}
          >
            Task Complete
          </button>
          <button 
            className="demo-btn warning"
            onClick={() => addNotification('Long Session', 'You\'ve been working for over 2 hours.', 'warning')}
          >
            Long Session
          </button>
        </div>
      </div>

      <div className="notifications-list">
        <h4>Recent Notifications ({notifications.length})</h4>
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet</p>
            <p>Try the demo buttons above to see notifications in action!</p>
          </div>
        ) : (
          <div className="notifications-grid">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card ${getNotificationClass(notification.type)} ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h5>{notification.title}</h5>
                  <p>{notification.body}</p>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="notification-settings">
        <h4>⚙️ Notification Settings</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Session start/end reminders
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Break time alerts
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Task completion notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Long session warnings
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Daily productivity summary
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Weekly progress reports
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 