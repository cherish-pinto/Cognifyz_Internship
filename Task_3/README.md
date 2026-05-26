# Task 6: Database Integration and User Authentication

A secure full-stack application with user authentication and form data management.

## Features

- User signup and login with JWT authentication
- MongoDB database integration for storing users and form submissions
- Secure API endpoints with authorization checks
- Form submission and management
- Blue and gold theme UI

## Prerequisites

- Node.js (v14+)
- MongoDB running locally or a MongoDB connection string

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task6
JWT_SECRET=your_jwt_secret_key_12345
NODE_ENV=development
```

## Running the Application

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

### Forms (Protected)
- `POST /api/forms/submit` - Submit a new form
- `GET /api/forms/my-submissions` - Get user's submissions
- `DELETE /api/forms/:formId` - Delete a submission

## Project Structure

```
├── server.js              # Main server file
├── models/
│   ├── User.js           # User schema
│   └── Form.js           # Form schema
├── routes/
│   ├── auth.js           # Authentication routes
│   └── forms.js          # Form routes with authorization
├── public/
│   ├── index.html        # Frontend HTML
│   ├── style.css         # Blue and gold theme styles
│   └── script.js         # Frontend JavaScript
├── package.json          # Project dependencies
└── .env                  # Environment variables
```

## Technologies

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin requests
