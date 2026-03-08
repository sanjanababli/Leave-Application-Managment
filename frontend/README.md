# 🗓️ Leave Management Application

A full-stack web application where employees can request time off and employers can approve or reject those requests.

---

## 🚀 Live Demo

- **Frontend:** coming soon
- **Backend API:** coming soon

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Bonus Features](#bonus-features)

---

## ✨ Features

### For Employees

- Sign up and log in securely
- Apply for leave with details (leave type, start date, end date, reason)
- View their own leave application status (Pending / Approved / Rejected)
- See employer comments on their requests

### For Employers

- Sign up and log in securely
- View ALL employee leave requests
- Filter requests by status (All / Pending / Approved / Rejected)
- Approve or Reject requests with an optional comment

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| Vue.js 3     | JavaScript framework for UI |
| Tailwind CSS | Styling                     |
| Axios        | HTTP requests to backend    |
| Vue Router   | Page navigation             |
| Vite         | Frontend build tool         |

### Backend

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| Node.js              | Server runtime                  |
| Express.js           | REST API framework              |
| MongoDB Atlas        | Cloud database                  |
| Mongoose             | MongoDB object modeling         |
| JSON Web Token (JWT) | User authentication             |
| bcryptjs             | Password hashing                |
| dotenv               | Environment variables           |
| cors                 | Cross-origin requests           |
| nodemon              | Auto-restart during development |

---

## 📁 Folder Structure

```
leave-management-app/
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Signup & login logic
│   │   └── leaveController.js  # Leave request logic
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Leave.js            # Leave request schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth API routes
│   │   └── leaveRoutes.js      # Leave API routes
│   ├── utils/
│   │   └── authMiddleware.js   # JWT verification & role guard
│   ├── .env                    # Environment variables (keep secret!)
│   ├── package.json
│   └── server.js               # App entry point
│
└── frontend/
    ├── src/
    │   ├── views/
    │   │   ├── Login.vue               # Login page
    │   │   ├── Signup.vue              # Signup page
    │   │   ├── EmployeeDashboard.vue   # Employee dashboard
    │   │   └── EmployerDashboard.vue   # Employer dashboard
    │   ├── router/
    │   │   └── index.js        # Vue Router config
    │   ├── api.js              # Axios instance
    │   ├── App.vue             # Root component
    │   ├── main.js             # App entry point
    │   └── style.css           # Global styles with Tailwind
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) (v18 or higher)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/leave-management-app.git
cd leave-management-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

You should see:

```
✅ Connected to MongoDB Atlas
✅ Server running on http://localhost:5000
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder with the following:

| Variable      | Description                                 |
| ------------- | ------------------------------------------- |
| `MONGODB_URI` | Your MongoDB Atlas connection string        |
| `JWT_SECRET`  | A long random secret string for JWT         |
| `PORT`        | Port for the backend server (default: 5000) |

> ⚠️ Never share your `.env` file or push it to GitHub!

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint           | Description             | Access |
| ------ | ------------------ | ----------------------- | ------ |
| POST   | `/api/auth/signup` | Register a new account  | Public |
| POST   | `/api/auth/login`  | Login and get JWT token | Public |

### Leave Routes

| Method | Endpoint          | Description                 | Access   |
| ------ | ----------------- | --------------------------- | -------- |
| POST   | `/api/leaves`     | Apply for leave             | Employee |
| GET    | `/api/leaves/my`  | View my own leave requests  | Employee |
| GET    | `/api/leaves/all` | View all leave requests     | Employer |
| PUT    | `/api/leaves/:id` | Approve or Reject a request | Employer |

---

## 🏆 Bonus Features

| Feature                          | Status         |
| -------------------------------- | -------------- |
| JWT Authentication               | ✅ Implemented |
| Role-Based Access Control (RBAC) | ✅ Implemented |
| Input Validation                 | ✅ Implemented |
| Comprehensive README             | ✅ This file!  |

---

## 👥 User Roles

| Role         | Permissions                                                |
| ------------ | ---------------------------------------------------------- |
| **Employee** | Sign up, Login, Apply for leave, View own requests         |
| **Employer** | Sign up, Login, View all requests, Approve/Reject requests |

> Employees trying to access employer routes will get a `403 Access Denied` error.

---

## 📝 Leave Types Supported

- Annual Leave
- Sick Leave
- Emergency Leave
- Maternity/Paternity Leave
- Unpaid Leave

---

## 🌐 Deployment

- **Backend** deployed on [Render](https://render.com)
- **Frontend** deployed on [Vercel](https://vercel.com)

---

## 👩‍💻 Author

Made by **Sanjana** as part of a full-stack development assignment.
