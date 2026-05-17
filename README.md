# Mini Service Request Board

A full-stack web application where homeowners can post service requests (e.g. plumbing, electrical, painting) and tradespeople can browse, manage, and update job statuses.

Built for the **GlobalTNA Full-Stack Developer Intern Technical Assessment**.

🔗 **Live Demo:** [https://fullstack-assessment2.app](https://fullstack-assessment2.vercel.app/)

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Next.js 15 (App Router)       |
| Backend  | Node.js + Express             |
| Database | MongoDB + Mongoose            |
| Styling  | Vanilla CSS (custom dark theme) |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| Testing  | Jest + Supertest              |

## Features

- **Browse Requests** - View all service requests in a responsive card grid
- **Filter & Search** - Filter by category, status, or search by keyword
- **Create Request** - Submit new service requests with client-side validation
- **View Details** - Full job details with contact info and metadata
- **Update Status** - Change status between Open → In Progress → Closed
- **Delete Request** - Remove requests with confirmation modal
- **JWT Authentication** - Register/login via popup modal to post, update, and delete
- **Unit Tests** - 10 automated API tests covering all endpoints
- **Seed Data** - Pre-populate the database with 8 sample jobs

## Project Structure

```
fullstack-assessment/
├── backend/               # Express REST API
│   ├── config/db.js       # MongoDB connection
│   ├── models/
│   │   ├── JobRequest.js  # Job schema
│   │   └── User.js        # User schema (auth)
│   ├── routes/
│   │   ├── jobs.js        # CRUD routes
│   │   └── auth.js        # Register/login routes
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── auth.js        # JWT verification
│   ├── tests/
│   │   └── jobs.test.js   # API unit tests
│   ├── server.js          # Entry point
│   └── seed.js            # Database seeder
├── frontend/              # Next.js App
│   ├── app/
│   │   ├── layout.js      # Root layout
│   │   ├── Navbar.js      # Auth-aware navigation
│   │   ├── AuthModal.js   # Login/register popup
│   │   ├── page.js        # Home - job listing
│   │   ├── new/page.js    # New job form
│   │   ├── jobs/[id]/page.js  # Job detail
│   │   ├── lib/api.js     # API client
│   │   ├── lib/auth.js    # Auth state management
│   │   └── globals.css    # Design system
│   └── ...
└── README.md
```

## Prerequisites

- **Node.js** v18 or later
- **MongoDB** - local install or [Atlas free tier](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                          | Default                                         |
| -------------- | ------------------------------------ | ------------------------------------------------ |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://localhost:27017/service-request-board` |
| `JWT_SECRET`   | Secret key for signing JWT tokens    | *(required)*                                     |
| `PORT`         | Express server port                  | `5000`                                           |

### Frontend (`frontend/.env.local`)

| Variable              | Description              | Default                        |
| --------------------- | ------------------------ | ------------------------------ |
| `NEXT_PUBLIC_API_URL`  | Express API base URL     | `http://localhost:5000/api`    |

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nithilamandiw/fullstack-assessment.git
cd fullstack-assessment
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env        # Edit .env with your MongoDB URI and JWT secret
npm install
```

### 3. Set up the frontend

```bash
cd ../frontend
cp .env.example .env.local  # Edit if backend is on a different port
npm install
```

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The API will be available at **http://localhost:5000**.

### Seed the database

```bash
cd backend
npm run seed
```

This inserts sample job requests across all categories and statuses.

### Start the frontend

```bash
cd frontend
npm run dev
```

The app will be available at **http://localhost:3000**.

### Run tests

```bash
cd backend
npm test
```

Runs 10 automated tests covering all API endpoints (GET, POST, PATCH, DELETE) including authentication enforcement.

## API Endpoints

| Method   | Endpoint             | Auth | Description                                  |
| -------- | -------------------- | ---- | -------------------------------------------- |
| `POST`   | `/api/auth/register` | -    | Register a new user, returns JWT             |
| `POST`   | `/api/auth/login`    | -    | Login, returns JWT                           |
| `GET`    | `/api/jobs`          | -    | List all jobs (supports `?category=`, `?status=`, `?search=`) |
| `GET`    | `/api/jobs/:id`      | -    | Get a single job by ID                       |
| `POST`   | `/api/jobs`          | 🔒   | Create a new job (validates required fields)  |
| `PATCH`  | `/api/jobs/:id`      | 🔒   | Update job status only                       |
| `DELETE` | `/api/jobs/:id`      | 🔒   | Delete a job                                 |


## Data Model - JobRequest

| Field          | Type   | Required | Notes                                          |
| -------------- | ------ | -------- | ---------------------------------------------- |
| `title`        | String | ✅       | Max 200 characters                              |
| `description`  | String | ✅       | Max 2000 characters                             |
| `category`     | String | -        | Enum: Plumbing, Electrical, Painting, Joinery, General |
| `location`     | String | -        | e.g. Glasgow, Colombo                         |
| `contactName`  | String | -        |                                                |
| `contactEmail` | String | -        | Validated email format                          |
| `status`       | String | -        | Enum: Open, In Progress, Closed (default: Open) |
| `createdAt`    | Date   | -        | Auto-set on creation                            |

## Data Model - User

| Field          | Type   | Required | Notes                                          |
| -------------- | ------ | -------- | ---------------------------------------------- |
| `email`        | String | ✅       | Unique, validated email format                  |
| `password`     | String | ✅       | Min 6 characters, hashed with bcrypt            |
| `name`         | String | ✅       |                                                |
| `createdAt`    | Date   | -        | Auto-set on creation                            |

## Bonus Features Implemented

- ✅ **Keyword search** - Search across title and description via `?search=` query parameter
- ✅ **JWT-based auth** - Register/login with bcrypt password hashing; protected POST, PATCH, DELETE endpoints
- ✅ **Unit tests** - 10 Jest + Supertest tests covering all API endpoints and auth enforcement
- ✅ **Seed script** - `npm run seed` populates sample jobs
# fullstack-assessment
