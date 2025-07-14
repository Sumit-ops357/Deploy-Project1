import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TaskManager.css';

// Helper to show browser notification
function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [notified, setNotified] = useState(false);
  const prevTasksLength = useRef(0);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Show notification if all tasks completed or all tasks deleted (after having tasks)
    if (
      (tasks.length > 0 && tasks.every(task => task.completed)) ||
      (prevTasksLength.current > 0 && tasks.length === 0)
    ) {
      if (!notified) {
        console.log('All tasks completed or deleted. Showing notification.');
        showNotification(
          'Congratulations!',
          'You have completed all your todays tasks. Lets maintain the same consistency tmmr also'
        );
        setNotified(true);
      }
    } else {
      setNotified(false);
    }
    prevTasksLength.current = tasks.length;
    // eslint-disable-next-line
  }, [tasks]);

  const checkAllTasksCompleted = (tasksArr) => {
    if (tasksArr.length > 0 && tasksArr.every(task => task.completed)) {
      if (!notified) {
        showNotification(
          'Congratulations!',
          'You have completed all your todays tasks. Lets maintain the same consistency tmmr also'
        );
        setNotified(true);
      }
    } else {
      setNotified(false);
    }
  };

  const addTask = async () => {
    if (input.trim()) {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { text: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newTasks = [...tasks, res.data];
      setTasks(newTasks);
      setInput('');
      checkAllTasksCompleted(newTasks);
    }
  };

  const deleteTask = async idx => {
    const token = localStorage.getItem('token');
    const id = tasks[idx]._id;
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const newTasks = tasks.filter((_, i) => i !== idx);
    setTasks(newTasks);
    checkAllTasksCompleted(newTasks);
  };

  const handleToggleTask = async idx => {
    const token = localStorage.getItem('token');
    const id = tasks[idx]._id;
    const updatedTask = { ...tasks[idx], completed: !tasks[idx].completed };
    await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const newTasks = tasks.map((task, i) => i === idx ? { ...task, completed: !task.completed } : task);
    setTasks(newTasks);
    checkAllTasksCompleted(newTasks);
  };

  return (
    <div className="task-manager">
      <h3>Tasks</h3>
      <div className="task-input-row">
        <input
          type="text"
          placeholder="Add a new task"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, idx) => (
          <li key={task._id} className={task.completed ? 'completed-task' : ''}>
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => handleToggleTask(idx)}
              style={{ marginRight: '12px' }}
            />
            <span>{task.text}</span>
            <button className="delete-btn" onClick={() => deleteTask(idx)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;