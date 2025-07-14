import React, { useState, useRef, useEffect } from 'react';
import './PomodoroTimer.css';

// Helper to show browser notification
// Notification logic works for both Standard and Long sessions
function showNotification(title, body) {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
}

function PomodoroTimer({ sessionType = 'Standard', longWorkMinutes = 50, longBreakMinutes = 15 }) {
  const [mode, setMode] = useState('Work');
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);
  const [notified, setNotified] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const intervalRef = useRef(null);
  const notifiedRef = useRef(false);

  // Session durations based on sessionType and user input
  const getDurations = () => {
    if (sessionType === 'Long') {
      return { Work: longWorkMinutes * 60, Break: longBreakMinutes * 60 };
    }
    // Standard: 25 min work, 5 min break
    return { Work: 25 * 60, Break: 5 * 60 };
  };
  const modes = getDurations();

  // Update timer when sessionType or mode changes
  useEffect(() => {
    setSeconds(modes[mode]);
    setRunning(false);
    setNotified(false);
    setSessionEnded(false);
    clearInterval(intervalRef.current);
  }, [sessionType, mode, longWorkMinutes, longBreakMinutes]);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    setNotified(false);
    setSessionEnded(false);
    notifiedRef.current = false;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          // Use ref to prevent double notification
          if (!notifiedRef.current) {
            notifiedRef.current = true;
            setNotified(true);
            setSessionEnded(true);
            saveSession(mode, modes[mode]);
            if (mode === 'Work') {
              showNotification('Break time!', 'Your work session is over. Take a break!');
            } else {
              showNotification('Back to work!', 'Break is over. Let\'s get back to work!');
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setSeconds(modes[mode]);
    setRunning(false);
    setNotified(false);
    setSessionEnded(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // setSeconds(modes[newMode]); // handled by useEffect
    setRunning(false);
    setNotified(false);
    setSessionEnded(false);
    clearInterval(intervalRef.current);
  };

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const saveSession = async (mode, duration) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/pomodoros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ mode, duration })
    });
  };

  return (
    <div className="pomodoro">
      <div className="pomodoro-modes">
        <button className={mode === 'Work' ? 'active' : ''} onClick={() => handleModeChange('Work')}>Work</button>
        <button className={mode === 'Break' ? 'active' : ''} onClick={() => handleModeChange('Break')}>Break</button>
      </div>
      <div className="pomodoro-timer">{formatTime(seconds)}</div>
      <div className="pomodoro-session-length">
        {mode === 'Work' && <span>Work: {sessionType === 'Long' ? longWorkMinutes : 25} min</span>}
        {mode === 'Break' && <span>Break: {sessionType === 'Long' ? longBreakMinutes : 5} min</span>}
      </div>
      <div className="pomodoro-controls">
        <button onClick={startTimer} disabled={running || sessionEnded}>Start</button>
        <button onClick={stopTimer} disabled={!running}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      {sessionEnded && (
        <div style={{ marginTop: '16px' }}>
          <button
            className="pomodoro-next-session-btn"
            onClick={() => {
              handleModeChange(mode === 'Work' ? 'Break' : 'Work');
            }}
          >
            Start Next Session ({mode === 'Work' ? 'Break' : 'Work'})
          </button>
        </div>
      )}
    </div>
  );
}

export default PomodoroTimer;