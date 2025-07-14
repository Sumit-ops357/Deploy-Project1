import React, { useState, useEffect } from 'react';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    
    useEffect(() => {
        // Fetch tasks from the backend when the component mounts
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        if (!taskInput) return;

        const newTask = { name: taskInput, completed: false };
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
        setTaskInput('');
    };

    const handleDeleteTask = async (id) => {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(task => task._id !== id));
    };

    const handleToggleTask = async (id) => {
        const taskToUpdate = tasks.find(task => task._id === id);
        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
        setTasks(tasks.map(task => (task._id === id ? updatedTask : task)));
    };

    return (
        <div className="task-manager">
            <h2>Task Manager</h2>
            <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <span
                            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                            onClick={() => handleToggleTask(task._id)}
                        >
                            {task.name}
                        </span>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;