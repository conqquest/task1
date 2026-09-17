# JoinEazy - Student Group & Assignment Management System

A role-based web application designed for academic collaboration, group-based assignment submissions, and instructor oversight. JoinEazy allows students to form and manage teams, access assignment instructions and OneDrive submission links, perform two-step verified submissions, and monitor team progress in real time. Instructors and administrators can publish targeted assignments, monitor real-time group submissions, and evaluate cohort performance through an analytics dashboard.

---

## 📌 Features

- **Role-Based Authentication**: Secure authentication distinguishing **Student** and **Professor / Admin** roles using JSON Web Tokens (JWT) and salted bcrypt password hashing.
- **Group Creation & Management**: Students can create project groups with auto-generated unique alphanumeric join codes or invite peers directly via email.
- **Targeted Assignment Posting**: Instructors can create assignments with rich descriptions, deadlines, external OneDrive repository links, and custom audience targeting (all students or selected groups).
- **Two-Step Submission Verification**: Eliminates accidental or premature submissions by requiring students to (1) confirm their OneDrive upload and (2) verify final submission metadata before recording completion.
- **Real-Time Group Progress Tracking**: Dynamic visual completion badges and progress indicators calculated from group submission states.
- **Admin Analytics Dashboard**: High-level and granular reporting for professors featuring key metric cards, submission breakdown charts, and group performance matrices.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance single page application framework and bundler |
| | Tailwind CSS 3 | Utility-first responsive CSS styling with dark-mode aesthetic |
| | Lucide React | Modern, clean vector icon set |
| | Recharts | Composable SVG-based chart library for visual analytics |
| | Axios | Promise-based HTTP client with request/response interceptors |
| **Backend** | Node.js, Express | Fast, unopinionated REST API service |
| | JSON Web Tokens (`jsonwebtoken`) | Stateless bearer token authentication |
| | `bcryptjs` | Strong one-way password hashing algorithm |
| | `pg` (node-postgres) | PostgreSQL connection pool and query client |
| | CORS, Helmet, Morgan | API security headers, CORS policies, and HTTP request logging |
| **Database** | PostgreSQL 16 Alpine | Relational SQL database with foreign key constraints and UUID keys |
| **Infrastructure** | Docker, Docker Compose | Containerized multi-service environment with health-checked startup |

---

## 🏛 Architecture

JoinEazy follows a decoupled, 3-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                 Client Tier (Frontend)                  │
│       React 18 SPA + Tailwind CSS + Lucide + Recharts    │
│            Runs on Nginx / Vite (Port: 3000)            │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP / REST (JSON)
                             │  Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Application Tier (Backend)                │
│            Node.js + Express REST API Server            │
│                   (Port: 5000 /api)                     │
│  ├── Controllers (Auth, Groups, Assignments, Analytics) │
│  ├── Middleware (verifyToken, authorizeRole)            │
│  └── DB Pool Client (pg)                                │
└────────────────────────────┬────────────────────────────┘
                             │  PostgreSQL Protocol
                             │  (Port: 5432)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Tier (Database)                   │
│              PostgreSQL 16 Relational Engine            │
│      Persistent Volume: pgdata (/var/lib/postgresql)    │
└─────────────────────────────────────────────────────────┘
```

1. **Presentation Layer (React SPA)**: Manages application state, authentication tokens in `localStorage`, and role-based UI views. Requests are sent over HTTP using an Axios instance configured with bearer tokens and automated 401 unauthenticated redirect handling.
2. **Business Logic Layer (Express API)**: Validates input payloads, enforces role-based access control (`student` vs. `admin`), handles password hashing and token generation, and processes multi-step submission state transitions.
3. **Data Storage Layer (PostgreSQL)**: Enforces relational integrity across users, groups, memberships, assignments, and submissions with UUID primary keys and cascading foreign keys.

---

## 🗄 Database Schema (ER Diagram)

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar role "student | admin"
        timestamp created_at
    }

    GROUPS {
        uuid id PK
        varchar name
        varchar code UK
        uuid created_by FK
        timestamp created_at
    }

    GROUP_MEMBERS {
        uuid id PK
        uuid group_id FK
        uuid student_id FK
        timestamp joined_at
    }

    ASSIGNMENTS {
        uuid id PK
        varchar title
        text description
        timestamp due_date
        text onedrive_url
        varchar target_type "all | specific_groups"
        uuid created_by FK
        timestamp created_at
    }

    ASSIGNMENT_GROUPS {
        uuid assignment_id PK, FK
        uuid group_id PK, FK
    }

    SUBMISSIONS {
        uuid id PK
        uuid assignment_id FK
        uuid group_id FK
        uuid submitted_by FK
        varchar status "pending | confirmed"
        timestamp confirmed_at
        text notes
        timestamp created_at
    }

    USERS ||--o{ GROUPS : "creates"
    USERS ||--o{ GROUP_MEMBERS : "member of"
    GROUPS ||--o{ GROUP_MEMBERS : "contains"
    USERS ||--o{ ASSIGNMENTS : "authors (admin)"
    ASSIGNMENTS ||--o{ ASSIGNMENT_GROUPS : "targets"
    GROUPS ||--o{ ASSIGNMENT_GROUPS : "assigned to"
    ASSIGNMENTS ||--o{ SUBMISSIONS : "receives"
    GROUPS ||--o{ SUBMISSIONS : "submits"
    USERS ||--o{ SUBMISSIONS : "confirmed by"
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 24.0+) & [Docker Compose](https://docs.docker.com/compose/)
- **OR** for manual execution:
  - [Node.js](https://nodejs.org/) (v20.x or higher)
  - [npm](https://www.npmjs.com/) (v10.x or higher)
  - [PostgreSQL](https://www.postgresql.org/) (v16.x)

---

### Quick Start (Docker)

The fastest way to deploy and run JoinEazy with database initialization:

1. **Clone the repository and enter the directory**:
   ```bash
   git clone <repo-url>
   cd meowwwwwwwwwwwwwwwwwww
   ```

2. **Start the containers**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
   - **Database Port**: `localhost:5432`

To stop and remove containers:
```bash
docker-compose down -v
```

---

### Manual Setup (Without Docker)

#### 1. PostgreSQL Database Configuration
Create a local database named `joineazy`:
```bash
psql -U postgres -c "CREATE DATABASE joineazy;"
```

#### 2. Backend Setup
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables by creating `.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/joineazy
   JWT_SECRET=super-secret-key-change-in-production
   ```
4. Start the backend service (schema and seed data execute automatically upon startup):
   ```bash
   npm start
   # Or for hot reload during development:
   npm run dev
   ```

#### 3. Frontend Setup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) (or the Vite URL indicated in terminal).

---

## 🔑 Demo Credentials

The database is pre-seeded with instructor and student accounts for evaluation:

| Role | Name | Email | Password | Assigned Group |
| :--- | :--- | :--- | :--- | :--- |
| **Professor (Admin)** | Prof. Kumar | `prof@joineazy.com` | `password123` | *N/A (Instructor)* |
| **Student 1** | Alex Chen | `student1@joineazy.com` | `password123` | Alpha Coders (`ALPHA01`) |
| **Student 2** | Maya Patel | `student2@joineazy.com` | `password123` | Alpha Coders (`ALPHA01`) |
| **Student 3** | Sam Wilson | `student3@joineazy.com` | `password123` | Beta Builders (`BETA02`) |

---

## 📚 API Reference

All protected endpoints require an `Authorization: Bearer <token>` header.

### Authentication
| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | No | Public | Register new user account (`student` or `admin`) |
| `POST` | `/api/auth/login` | No | Public | Authenticate user and receive signed JWT |
| `GET` | `/api/auth/me` | Yes | Any | Retrieve authenticated profile details |

### Groups
| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/groups` | Yes | Student, Admin | Create a new group with auto-generated join code |
| `GET` | `/api/groups/my` | Yes | Student, Admin | List all groups the authenticated user belongs to |
| `GET` | `/api/groups` | Yes | Admin | List all existing student groups with member counts |
| `POST` | `/api/groups/join` | Yes | Student | Join an existing group using its 6-character code |
| `POST` | `/api/groups/:groupId/members` | Yes | Creator, Admin | Add a student to a group by email address |
| `DELETE` | `/api/groups/:groupId/members/:studentId`| Yes | Creator, Admin | Remove a student from a group |
| `GET` | `/api/groups/:groupId/members` | Yes | Member, Admin | List all students belonging to a specific group |

### Assignments
| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/assignments` | Yes | Admin | Create a new assignment with OneDrive link and group targeting |
| `GET` | `/api/assignments` | Yes | Student, Admin | List visible assignments (scoped to student's groups or all) |
| `GET` | `/api/assignments/:id` | Yes | Student, Admin | Get single assignment details and group submission status |
| `PUT` | `/api/assignments/:id` | Yes | Admin | Update an existing assignment's title, dates, or targeting |
| `DELETE` | `/api/assignments/:id` | Yes | Admin | Delete an assignment and cascade its associations |

### Submissions
| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/submissions/initiate` | Yes | Student | **Step 1**: Initiate submission, mark status as `pending` |
| `POST` | `/api/submissions/confirm` | Yes | Student | **Step 2**: Finalize submission, set status to `confirmed` with timestamp |
| `GET` | `/api/submissions/status/:assignmentId/:groupId` | Yes | Student, Admin | Fetch the current submission status for a group |
| `GET` | `/api/submissions/group/:groupId` | Yes | Student, Admin | List all submissions made by a specific group |

### Analytics
| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Yes | Admin | Aggregate counts (students, groups, assignments, completion rate) |
| `GET` | `/api/analytics/submissions-by-assignment` | Yes | Admin | Confirmed vs pending vs unsubmitted group distribution |
| `GET` | `/api/analytics/group-progress` | Yes | Admin | Per-group overall assignment completion percentages |

---

## 💡 Key Design Decisions

### 1. JSON Web Tokens (JWT) for Authentication
- **Stateless Scalability**: Eliminates the overhead of server-side session stores (like Redis or memory stores) in horizontal scaling configurations.
- **Role Ingestion**: User identity and authorization role (`student` or `admin`) are encoded directly into the payload, reducing database lookups on standard route guard checks.

### 2. Two-Step Submission Verification
- **Prevention of Accidental Submissions**: In academic group work, premature submissions cause grading discrepancies and administrative friction.
- **Auditability**: Step 1 validates that the student accessed the destination OneDrive link and acknowledges upload completion. Step 2 requires deliberate final confirmation, capturing the exact submitting student ID and timestamp.

### 3. Alphanumeric Group Codes for Team Formation
- **Frictionless Onboarding**: Rather than relying on professors to manually curate rosters, students can instantly form project squads by distributing short, collision-resistant 6-character codes (e.g., `ALPHA01`).
- **Flexible Management**: Group creators and professors maintain administrative authority to add peers by email or prune rosters if necessary.

### 4. OneDrive External Links vs. Direct File Uploads
- **Storage & Infrastructure Cost**: Large project archives (code bundles, high-resolution presentations, CAD models) impose heavy storage, bandwidth, and security liabilities on application servers.
- **Enterprise Integration**: Institutional OneDrive / SharePoint integration leverages existing institutional access policies, virus scanning, version history, and unlimited organizational quota without complicating application deployment.

---

## 📷 Screenshots

*UI screenshots demonstrating key application interfaces:*

| Student Dashboard | Submission Modal (2-Step) |
| :---: | :---: |
| ![Student Dashboard](https://placehold.co/600x350/0f172a/38bdf8?text=Student+Dashboard+Overview) | ![Two-Step Submission](https://placehold.co/600x350/0f172a/a855f7?text=Two-Step+Verification+Modal) |

| Admin Analytics Dashboard | Group Management |
| :---: | :---: |
| ![Admin Analytics](https://placehold.co/600x350/0f172a/22c55e?text=Admin+Analytics+%26+Charts) | ![Group Management](https://placehold.co/600x350/0f172a/eab308?text=Group+Roster+%26+Code+Management) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
