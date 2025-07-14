# Productivity & Pomodoro Analytics Dashboard - Backend

## Overview
The Productivity & Pomodoro Analytics Dashboard is a full-stack application designed to help users track their productivity sessions using the Pomodoro technique. This backend serves as the API for the application, handling user authentication, task management, and data storage.

## Features
- User registration and login with Google authentication
- Task management (create, edit, delete tasks)
- Session tracking for work and break periods
- Analytics for productivity trends and heatmaps

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB instance running

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd productivity-pomodoro-dashboard/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in `src/config/db.js`.

4. Set up environment variables for Google authentication and MongoDB URI.

### Running the Application
To start the server, run:
```
npm start
```
The server will run on `http://localhost:5000` by default.

## API Endpoints
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login an existing user
- `GET /api/users`: Fetch user data (protected route)

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.

## Frontend Integration
For the frontend integration, ensure that the frontend application is configured to communicate with this backend API. Update the API base URL in the frontend application to point to the backend server URL, typically `http://localhost:5000/api`.