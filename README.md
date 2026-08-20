# DevFusion — Enterprise Project & Team Collaboration SaaS


DevFusion is a full-stack project management and team collaboration platform built with Next.js, PostgreSQL, Prisma, and NextAuth.js.


It brings project management, Kanban boards, sprint planning, knowledge sharing, time tracking, activity monitoring, and AI-assisted task prioritization into one unified workspace.


---


## 🚀 Key Features


### 🔐 Authentication & RBAC
- Secure Credentials-based authentication with NextAuth.js
- JWT-based sessions
- Role-based access control
- Five workspace roles:
  - Workspace Owner
  - Project Manager
  - Team Member
  - Client
  - Admin
- Server-side authorization


### 📊 Project Dashboard
- Project overview
- Task statistics
- Sprint information
- Activity information
- Workspace-level project management


### 📋 Kanban Board
Six-stage workflow:


```text
Backlog
   ↓
To Do
   ↓
In Progress
   ↓
Code Review
   ↓
Testing
   ↓
Completed

Features:

Task status management
Priority levels
Story points
Task assignment
Optimistic UI updates
🏃 Sprint Management
Sprint planning
Sprint goals
Sprint capacity
Active/completed sprint states
Task tracking
Burndown visualization
📉 Sprint Burndown

Visualizes sprint progress using:

Sprint capacity
Story points
Completed tasks
Ideal progress
📚 Knowledge Wiki
Project-specific documentation
Wiki pages
Nested wiki structure
Markdown-based content
Live editing interface
⏱️ Time Tracking
Log time against tasks
Duration-based time entries
Optional notes
Personal time-log history
Total logged time
Today's logged time
PostgreSQL-backed persistence
🤖 AI Task Prioritization

AI-assisted task prioritization based on:

Deadline proximity
Task priority
Story points
Workload

A deterministic fallback is available when no AI API key is configured.

📝 Activity Logging

Tracks important workspace and project activity including task and time-log actions.

⚡ Command Palette

Quick application navigation using:

Ctrl + K

or

Cmd + K
🛠️ Tech Stack
Technology	Purpose
Next.js 14	Full-stack React framework
TypeScript	Type-safe development
React	User interface
Tailwind CSS	Styling
PostgreSQL	Relational database
Prisma ORM	Database access
NextAuth.js	Authentication
JWT	Session authentication
Recharts	Data visualization
Lucide React	Icons
🏗️ Architecture
                    ┌─────────────────────┐
                    │      DevFusion      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
        Next.js App Router                PostgreSQL
              │                                 │
       ┌──────┴──────┐                          │
       │             │                          │
     Pages          API                    Prisma ORM
       │             │                          │
       │       ┌─────┴─────┐                    │
       │       │           │                    │
   Dashboard  Auth      Business APIs           │
       │       │           │                    │
       └───────┴───────────┴────────────────────┘
                         │
                    NextAuth + RBAC
📁 Project Structure
devfusion/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   │   └── [projectId]/
│   │   │   │       ├── kanban/
│   │   │   │       ├── sprints/
│   │   │   │       └── wiki/
│   │   │   ├── settings/
│   │   │   └── time-logs/
│   │   │
│   │   └── api/
│   │       ├── ai/
│   │       ├── auth/
│   │       ├── register/
│   │       ├── tasks/
│   │       └── time-logs/
│   │
│   ├── components/
│   │   ├── AuthProvider.tsx
│   │   ├── BurndownChart.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TimeLogsClient.tsx
│   │   └── WikiEditor.tsx
│   │
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       ├── rbac.ts
│       └── ...
│
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
🗄️ Database

DevFusion uses:

PostgreSQL
      │
      ▼
Prisma ORM
      │
      ▼
Next.js Server Components / API Routes

The database contains models for:

Users
Workspaces
Workspace Members
Projects
Tasks
Subtasks
Sprints
Wiki Pages
Meetings
Milestones
Time Logs
Comments
Attachments
Notifications
Activity Logs
🔑 Environment Variables

Create a .env file in the project root.

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/devfusion"


NEXTAUTH_SECRET="your-long-random-secret"


NEXTAUTH_URL="http://localhost:3000"


OPENAI_API_KEY=""
Important

If your PostgreSQL password contains special characters such as:

@
:
/
?
#
&

they may need to be URL-encoded inside DATABASE_URL.

For example:

@ → %40
⚙️ Local Development
1. Install dependencies
npm install
2. Configure environment

Create:

.env

from:

.env.example

Then configure your PostgreSQL credentials.

3. Verify PostgreSQL
psql --version

Example:

psql (PostgreSQL) 18.6

Make sure the PostgreSQL server is running.

4. Synchronize Prisma schema
npx prisma db push
5. Seed demo data
npm run db:seed
6. Start DevFusion
npm run dev

Open:

http://localhost:3000
👤 Demo Accounts

All seeded accounts use:

Password: DemoPass2026!
Role	Email
Workspace Owner	owner@devfusion.io
Project Manager	pm@devfusion.io
Team Member	dev@devfusion.io
Client	client@devfusion.io
Admin	admin@devfusion.io

These credentials are intended for local/demo development only.

🔒 Security

DevFusion uses:

NextAuth.js Credentials authentication
JWT sessions
Server-side authentication checks
Role-based authorization
Workspace membership validation
Protected API routes
Database-level relational constraints

Authentication should never rely solely on client-side UI restrictions.

🤖 AI Prioritization

The AI prioritization engine can use an OpenAI API key when configured.

OPENAI_API_KEY="your-api-key"

Without an API key, DevFusion falls back to a deterministic prioritization strategy based on task properties.

This allows the application to remain functional during local development without requiring an external AI service.

📡 Main Routes
Application
/login
/register
/dashboard
/projects
/projects/[projectId]/kanban
/projects/[projectId]/sprints
/projects/[projectId]/wiki
/time-logs
/settings
API
/api/auth/[...nextauth]
/api/register
/api/tasks
/api/time-logs
/api/ai/prioritize
🧪 Development Commands
# Install dependencies
npm install


# Synchronize database
npx prisma db push


# Seed database
npm run db:seed


# Start development server
npm run dev


# Build production version
npm run build


# Start production server
npm start
🐳 Docker

The project includes Docker configuration for PostgreSQL/containerized development.

docker compose up -d

If using an existing local PostgreSQL installation, Docker is not required.

🗺️ Roadmap
Completed
 Authentication
 Registration
 Role-based access control
 Workspace structure
 Project management
 Kanban board
 Task management
 Sprint management
 Burndown visualization
 Knowledge Wiki
 AI task prioritization
 Activity logging
 Command palette
 Time logging
Planned Improvements
 Drag-and-drop Kanban
 Project creation UI
 Sprint creation UI
 Team member invitation system
 Real-time notifications
 Advanced time analytics
 Dashboard charts
 File attachments
 Automated testing
 Production deployment
 CI/CD improvements
📌 Current Status

DevFusion is currently a functional full-stack MVP.

The core application stack is running locally with:

Next.js
   +
PostgreSQL
   +
Prisma
   +
NextAuth
   +
Tailwind CSS

The database schema has been synchronized successfully and demo data can be seeded through Prisma.

👨‍💻 Development

DevFusion is being developed as a full-stack SaaS project focused on modern project management, collaboration, and AI-assisted productivity.

License

This project is intended for educational and development purposes.



### 🔥 A couple of deliberate changes


I removed the README's old assumption that **Docker must be used for PostgreSQL**. We already proved your local PostgreSQL setup works, so the README now supports either local PostgreSQL or Docker.


I also added **Time Logs**, because that's now part of the actual application rather than just something sitting in the Prisma schema.


And I changed the project status to **functional MVP** rather than pretending every roadmap item is finished.


**One thing I'd do immediately after saving this README:** run


```cmd
npm run build