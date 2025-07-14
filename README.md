# Productivity & Pomodoro Analytics Dashboard

## Overview
The Productivity & Pomodoro Analytics Dashboard is a web application designed to help users track their productivity sessions using the Pomodoro technique. It features a timer for work and break sessions, a task manager, and analytics visualizations such as a daily/weekly heatmap and trends.

## Features
- **Pomodoro Timer**: Start, pause, and reset work and break sessions.
- **Task Manager**: Create, edit, and delete tasks to manage your workload effectively.
- **Analytics Dashboard**: View productivity trends and heatmaps to analyze your work patterns.
- **Google Login Integration**: Easily log in using your Google account for a seamless experience.
- **Attractive UI**: A unique and user-friendly interface designed for optimal usability.

## Project Structure
```
productivity-pomodoro-dashboard
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── config
│   │   └── app.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
│   │   ├── utils
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
└── README.md
```

## Installation

### Backend
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Set up your MongoDB connection in `backend/src/config/db.js`.
4. Start the server with `npm start`.

### Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Start the React application with `npm start`.

## Usage
- Access the application in your browser at `http://localhost:3000`.
- Use the Google Login button to authenticate.
- Manage your tasks and track your productivity sessions using the dashboard.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.