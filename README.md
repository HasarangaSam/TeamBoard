# TeamBoard — Full-Stack Task Management Platform

TeamBoard is a full-stack task management application built to practise NestJS fundamentals and modern full-stack development. It combines a React frontend with a NestJS REST API, Clerk authentication, Prisma ORM, and PostgreSQL.

The project focuses on practical application architecture, authentication, authorization, input validation, database access, and API documentation without unnecessary backend complexity.

## Features

### Authentication and Authorization

- Clerk authentication integrated with the React frontend.
- Backend verification of Clerk authentication tokens.
- Automatic synchronization of authenticated users with the local database.
- Account status checks for inactive users.
- Role-based access control using `USER` and `ADMIN` roles.
- Admin-only API endpoints protected by custom NestJS guards.

### Task Management

- Create, view, update, and delete tasks.
- Manage task status: `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- Set task priority: `LOW`, `MEDIUM`, and `HIGH`.
- Optional task descriptions and due dates.
- Search and filter tasks.
- Paginated task listing.
- Server-side task ownership checks to prevent access to other users' tasks.

### Backend Engineering

- Modular NestJS architecture.
- Controllers, services, modules, and dependency injection.
- DTO-based request validation and transformation.
- Authentication and authorization guards.
- Custom decorators and metadata using `SetMetadata()` and `Reflector`.
- Request logging middleware.
- Request timing interceptor.
- Global exception filter.
- Prisma ORM with PostgreSQL.
- Swagger API documentation.

## Tech Stack

| Area               | Technology                             |
| ------------------ | -------------------------------------- |
| Frontend           | React, TypeScript, Vite                |
| Styling            | Tailwind CSS v4                        |
| Routing            | React Router                           |
| Authentication     | Clerk                                  |
| HTTP client        | Axios                                  |
| Backend            | NestJS, TypeScript                     |
| API style          | REST                                   |
| ORM                | Prisma                                 |
| Database           | PostgreSQL                             |
| Validation         | `class-validator`, `class-transformer` |
| API documentation  | Swagger / OpenAPI                      |
| Package management | npm                                    |

## Architecture

```text
teamboard/
├── frontend/                 # React application
│   └── src/
│       ├── components/
│       │   └── tasks/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       ├── App.tsx            # Route definitions
│       └── main.tsx
│
├── backend/                  # NestJS REST API
│   ├── prisma/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   └── guards/
│   │   ├── users/
│   │   ├── tasks/
│   │   │   └── dto/
│   │   ├── admin/
│   │   ├── common/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── middleware/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env
│
├── .gitignore                # Shared ignore rules for both applications
└── README.md
```

The exact file structure may vary slightly depending on your implementation.
Git is initialized at the project root so the frontend and backend are managed
as one repository.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js compatible with your installed NestJS and Vite versions.
- npm.
- PostgreSQL.
- A Clerk application with its publishable and secret keys.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd teamboard
```

Replace `<your-repository-url>` with your actual repository URL.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` using the following template:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/teamboard?schema=public"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
PORT=3000
```

Replace the database credentials and Clerk keys with your own values. Create the `teamboard` PostgreSQL database if it does not already exist.

**Never commit `.env` files or expose the Clerk secret key.**

### 3. Set up the database

From the `backend/` directory, run the Prisma commands appropriate for the schema and migration state in your repository.

For a project using Prisma migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

If you have not created the initial migration yet, create it using your existing Prisma schema and a suitable migration name.

If your local database already has the migrations applied, do not create duplicate migrations unnecessarily.

### 4. Configure the frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Use the same Clerk application for the frontend and backend. Configure the local frontend URL (`http://localhost:5173`) in Clerk as required by your authentication setup.

### 5. Run the applications

Open two terminals.

**Terminal 1 — Backend**

```bash
cd backend
npm run start:dev
```

Backend base URL:

`http://localhost:3000/api/v1`

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Frontend URL:

`http://localhost:5173`

The frontend uses the backend API to load and manage tasks. Sign in through Clerk before accessing authenticated features.

## API Endpoints

All routes use the `/api/v1` prefix.

| Method   | Endpoint          | Purpose                             |
| -------- | ----------------- | ----------------------------------- |
| `GET`    | `/users/me`       | Retrieve the current local user     |
| `GET`    | `/tasks`          | List the authenticated user's tasks |
| `POST`   | `/tasks`          | Create a task                       |
| `GET`    | `/tasks/:id`      | Retrieve a task owned by the user   |
| `PATCH`  | `/tasks/:id`      | Update a task owned by the user     |
| `DELETE` | `/tasks/:id`      | Delete a task owned by the user     |
| `GET`    | `/admin/overview` | Retrieve admin overview statistics  |

Authenticated endpoints require a valid Clerk bearer token. The admin overview additionally requires the user's local database role to be `ADMIN`.

Task listing supports the filters and pagination defined by the corresponding query DTO. Refer to the Swagger documentation for the exact request parameters and schemas.

## API Documentation

After starting the backend, visit:

**http://localhost:3000/api/docs**

Swagger provides interactive API documentation generated from the NestJS application. The bearer authentication scheme documents the expected authentication mechanism; it does not bypass the application's Clerk verification or authorization guards.

## Key NestJS Concepts Demonstrated

| Concept                  | Implementation                                              |
| ------------------------ | ----------------------------------------------------------- |
| Modules                  | Organize authentication, users, tasks, and administration   |
| Controllers              | Define REST endpoints and handle HTTP requests              |
| Providers and services   | Encapsulate business logic and database operations          |
| Dependency injection     | Inject services such as `PrismaService`                     |
| DTOs                     | Define and validate incoming request data                   |
| Pipes                    | Validate and transform requests using `ValidationPipe`      |
| Guards                   | Verify authentication, account status, and role permissions |
| Custom decorators        | Provide role metadata and access the current user           |
| Metadata and `Reflector` | Read role requirements for protected routes                 |
| Middleware               | Assign request IDs and log incoming requests                |
| Interceptors             | Measure request processing time                             |
| Exception filters        | Return consistent JSON error responses                      |
| Configuration            | Load environment variables and configure the application    |
| Swagger                  | Generate interactive API documentation                      |

## Security Considerations

- Clerk tokens are verified on the backend.
- The backend uses a local user record for application-specific roles and account status.
- Role changes must be performed through a trusted administrative process, not by the user-facing frontend.
- Task queries are scoped to the authenticated user.
- DTO validation rejects unexpected properties and invalid inputs.
- Server-side guards protect restricted routes.
- Unexpected server errors do not expose internal stack traces in API responses.
- Secrets and database credentials belong in environment variables, not source control.

## Future Improvements

Possible extensions include:

- Automated tests for authentication, authorization, and task ownership.
- More detailed Swagger request and response schemas.
- Improved pagination and filtering UX.
- Account and profile management.
- Deployment with managed PostgreSQL and secure environment configuration.
- Structured logging and production monitoring.

These are potential extensions, not claims about features already implemented.

## Learning Outcomes

Building TeamBoard provided practical experience with:

- Structuring a REST API using NestJS modules, controllers, and services.
- Integrating Clerk authentication with a separate backend.
- Using Prisma to access PostgreSQL.
- Implementing DTO validation and server-side authorization.
- Protecting user-owned resources.
- Applying middleware, guards, interceptors, and exception filters.
- Documenting API endpoints with Swagger.
- Integrating a React frontend with an authenticated backend.

## License

Choose a license appropriate for your repository, such as MIT, before publishing the project publicly.
