# 🚀 Team Task Manager

A full-stack, role-based team task management system built with Node.js, Express, React, PostgreSQL, and Prisma.

## ✨ Features

- **Authentication** — Signup/Login with JWT tokens & bcrypt password hashing
- **Role-Based Access Control** — Admin & Member roles with server-side enforcement
- **Project Management** — Create, edit, delete projects; invite members by email
- **Task Management** — Create, assign, update, delete tasks with priority & due dates
- **Task Status Flow** — Todo → In Progress → Done
- **Dashboard** — Personal stats, task progress, overdue alerts
- **Responsive UI** — Dark theme, glassmorphism design, mobile-friendly

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT, bcryptjs |
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Deployment | Railway |

## 📦 Project Structure

```
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── projectController.js
│       │   ├── taskController.js
│       │   └── dashboardController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── roleCheck.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── projects.js
│       │   ├── tasks.js
│       │   └── dashboard.js
│       ├── lib/
│       │   └── prisma.js
│       └── index.js
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── README.md
```

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone the repo
```bash
git clone https://github.com/starkbbk/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Setup Server
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/team_task_manager"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the server:
```bash
npm run dev
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173`

## 🌐 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Projects (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project (Admin) |
| DELETE | `/api/projects/:id` | Delete project (Admin) |
| POST | `/api/projects/:id/members` | Add member (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (Admin) |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:projectId` | Get project tasks |
| POST | `/api/tasks/project/:projectId` | Create task (Admin) |
| PUT | `/api/tasks/:taskId` | Update task |
| DELETE | `/api/tasks/:taskId` | Delete task (Admin) |

### Dashboard (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard stats |

## 🚢 Railway Deployment

1. Push code to GitHub
2. Create a new Railway project
3. Add PostgreSQL plugin
4. Add a new service from your GitHub repo (server)
5. Set environment variables:
   - `DATABASE_URL` (from PostgreSQL plugin)
   - `JWT_SECRET`
   - `PORT=5000`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
6. Set build command: `npm install && npm run build && cd ../client && npm install && npm run build`
7. Set start command: `npm start`

## 🔗 Live URL

**Deployed at:** [Coming Soon — Railway Deployment]

## 📄 License

MIT
