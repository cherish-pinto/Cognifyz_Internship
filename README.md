# Task 6: Database Integration and User Authentication

A full-stack web application with user authentication and form data management using MongoDB and JWT tokens.

## Features

- User registration and login with JWT authentication
- Secure API endpoints with authorization checks
- Form submission and data management
- MongoDB database integration
- Blue and gold theme UI
- Responsive design

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── FormData.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── form.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        ├── auth.js
        └── app.js
```

## Setup Instructions

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Ensure MongoDB is running on `localhost:27017`
5. Start the server: `npm start`

### Frontend

1. Open `frontend/index.html` in a web browser
2. The app connects to the backend API at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Form Data (Protected)
- `POST /api/form/submit` - Submit form data
- `GET /api/form/data` - Get all user form data
- `GET /api/form/data/:id` - Get specific form entry
- `DELETE /api/form/data/:id` - Delete form entry

## Technology Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Password hashing with bcryptjs

## Theme

The application uses a professional blue and gold color scheme:
- Primary Blue: `#1e3a8a`
- Secondary Blue: `#3b82f6`
- Gold: `#fbbf24`
- Dark Gold: `#d97706`
