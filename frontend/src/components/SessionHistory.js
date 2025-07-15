import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/api';

function SessionHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/pomodoros`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h3>Session History</h3>
      <ul>
        {sessions.map((s, idx) => (
          <li key={s._id}>
            {s.mode} - {Math.floor(s.duration / 60)} min - {new Date(s.completedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SessionHistory;