# 📦 Supply Chain Monitor - Back-End

Backend system for the **Supply Chain Monitor / Marketplace** platform built with **Node.js**, **TypeScript**, and **Express 5**, featuring **PostgreSQL** database support via **Sequelize ORM**, and **GraphQL** APIs via **Apollo Server v5**.

The project follows a modern, organized **Layered Architecture / Clean Architecture** to ensure scalability, maintainability, and ease of automated testing.

---

[🇸🇦 النسخة العربية](README.md) | [🇬🇧 English Version](README_EN.md)

---

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js with `tsx` for TypeScript execution during development.
- **Programming Language:** TypeScript (Strict Mode).
- **Web Framework:** Express 5.
- **Database & ORM:** PostgreSQL with Sequelize ORM.
- **API Interfaces:** RESTful APIs & GraphQL with Apollo Server v5 (`@apollo/server`).
- **Authentication & Security:** JSON Web Tokens (JWT) & password hashing using `bcrypt`.
- **Schema Validation:** Zod (v4).
- **Automated Testing:** Vitest (v5) as the test runner, Supertest for Express API integration testing, and Axios for HTTP requests.

---

## 📁 Project Structure

```text
Supply Chain Monitor-back-end/
├── .env                       # Environment variables
├── .gitignore                 # Files ignored by Git
├── package.json               # Package dependencies and scripts
├── tsconfig.json              # TypeScript compiler configuration
├── vitest.config.ts           # Vitest testing environment configuration
├── tests/                     # Automated testing suite
│   ├── helper.ts              # Testing utilities (seed, login, database reset)
│   ├── health ckheck/
│   │   └── health.test.ts     # Supertest health check verification
│   └── auth tests/
│       └── register.test.ts   # Authentication and registration tests
├── src/
│   ├── app.ts                 # Express application factory, middlewares & test routes
│   ├── server.ts              # Server bootstrap, DB connection & GraphQL integration
│   ├── db.ts                  # PostgreSQL connection setup via Sequelize
│   ├── config/
│   │   └── env.ts             # Safe environment variable parsing and validation
│   ├── graphql/
│   │   └── schema.ts          # GraphQL schema typeDefs and resolvers
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT authentication middleware
│   │   ├── error.middleware.ts    # Centralized error handling middleware
│   │   ├── validate.middleware.ts # Generic Zod request validation middleware
│   │   ├── jwtverf.ts             # (Legacy token verification)
│   │   └── middleware.ts          # (Legacy validation and error middleware)
│   ├── models/
│   │   └── user.ts            # Sequelize User model schema
│   └── modules/
│       └── auth/              # Authentication & User Management module
│           ├── auth.controller.ts # HTTP request/response handler
│           ├── auth.service.ts    # Core business logic
│           ├── auth.repository.ts # Database queries and Sequelize operations
│           ├── auth.routes.ts     # Route and endpoint definitions
│           ├── auth.validation.ts # Zod validation schemas
│           ├── auth.types.ts      # Enums, interfaces, and role types
│           └── auth.dto.ts        # Data Transfer Objects (Input & Output DTOs)
```

---

## 📄 File-by-File Guide

### 1. Root Configuration

| File | Description |
| :--- | :--- |
| `package.json` | Project metadata, scripts (`dev` using `tsx watch`, `build` using `tsc`, `start` using `tsx`, and `test` using `vitest run`), and all `dependencies` & `devDependencies`. |
| `tsconfig.json` | TypeScript compiler configuration (`ES2022`, `Bundler`), build output directory (`./dist`), strict type checking (`strict: true`), and global test typings (`vitest/globals`). |
| `vitest.config.ts` | Vitest testing configuration; sets test environment to `node`, enables `globals: true`, and injects isolated testing environment variables (`env`) for JWT, database credentials, and port. |
| `.env` | Local sensitive environment configuration (PostgreSQL database credentials, port `PORT`, and `JWT_SECRET`). |
| `.gitignore` | Defines files and folders ignored by Git such as `node_modules`, `dist`, and `.env`. |

---

### 2. Core & Application Setup

| File | Description |
| :--- | :--- |
| `src/server.ts` | **Application Entry Point:** Connects to PostgreSQL, instantiates the Express application, mounts Apollo Server at `/graphql`, and starts listening on the configured port (`env.port`). |
| `src/app.ts` | **Express Application Factory (`createApp`):** Sets up standard middlewares (CORS, Express JSON Body Parser), registers REST API routes under `/api`, the health check route (`/health`), and the test reset endpoint (`POST /reset`), and attaches centralized error handling. |
| `src/db.ts` | **Database Initialization:** Establishes the Sequelize connection to PostgreSQL and exports `connectDB()` to test the connection and synchronize models (`sequelize.sync()`). |
| `src/config/env.ts` | **Environment Variable Management:** Programmatically validates mandatory variables (`JWT_SECRET`, DB credentials) and exports a strongly-typed `env` object. |

---

### 3. GraphQL Layer (`src/graphql/`)

| File | Description |
| :--- | :--- |
| `src/graphql/schema.ts` | Contains GraphQL schema type definitions (`typeDefs`) using `gql` and initial query resolvers (`resolvers`), including a `health` check query. |

---

### 4. Middleware (`src/middleware/`)

| File | Description |
| :--- | :--- |
| `src/middleware/auth.middleware.ts` | Route protection middleware (`authenticateJWT`); extracts Bearer tokens from `Authorization: Bearer <token>`, verifies JWT validity, and attaches the authenticated user payload to `req.user`. |
| `src/middleware/validate.middleware.ts` | Higher-order validation middleware (`validate(schema)`); validates `req.body` against a given Zod schema and forwards validation failures to the centralized error handler. |
| `src/middleware/error.middleware.ts` | Centralized error handler (`errorMiddleware`); catches Zod validation errors to format field-level error responses with HTTP `400`, handles application errors, and returns consistent error JSON. |
| `src/middleware/jwtverf.ts` | *(Legacy)* Previous token verification helper replaced by `auth.middleware.ts`. |
| `src/middleware/middleware.ts` | *(Legacy)* Previous error and validation functions replaced by modular middlewares. |

---

### 5. Database Models (`src/models/`)

| File | Description |
| :--- | :--- |
| `src/models/user.ts` | Sequelize `User` model: defines the schema for the `users` table (`id` as UUID, `name`, unique `email`, hashed `password`, and `role` as an Enum of user roles). |

---

### 6. Authentication Module (`src/modules/auth/`)

Follows clean layered architecture for clear separation of concerns:

| File | Description |
| :--- | :--- |
| `src/modules/auth/auth.routes.ts` | Registers endpoints with corresponding middlewares and controllers: `POST /auth/register`, `POST /auth/login`, and `PATCH /auth/updaterole`. |
| `src/modules/auth/auth.controller.ts` | **Controller Layer:** Handles incoming HTTP requests, passes data to the service layer, and returns JSON responses with proper HTTP status codes (200, 201, 400, 401, 404, 500). |
| `src/modules/auth/auth.service.ts` | **Service Layer (Business Logic):** Validates email uniqueness, hashes passwords with `bcrypt`, validates credentials, issues signed JWT tokens, and enforces role update policies. |
| `src/modules/auth/auth.repository.ts` | **Repository Layer:** Encapsulates Sequelize database operations: `findByEmail`, `findById`, `create`, and `updateRole`. |
| `src/modules/auth/auth.validation.ts` | Zod validation schemas: `registerSchema`, `loginSchema`, and `updateRoleSchema`. |
| `src/modules/auth/auth.types.ts` | Base enums and types, including user roles `UserRole` (`CUSTOMER`, `MERCHANT`, `MANUFACTURER`, `LOGISTICS_PROVIDER`, `SUPER_ADMIN`) and `globalRole`. |
| `src/modules/auth/auth.dto.ts` | **Data Transfer Objects (DTOs):** Defines strong typings for request payloads and responses (`RegisterDto`, `LoginDto`, `UpdateRoleDto`, `UserResponseDto`, `LoginResponseDto`). |

---

### 7. Automated Tests (`tests/`)

| File / Folder | Description |
| :--- | :--- |
| `tests/helper.ts` | **Testing Utilities:** Helper functions for integration tests: `resetDatabase` (truncates tables via `/reset`), `createUser` (creates a test user via API), `login` (authenticates and extracts a JWT token), and `resetAndSeed` (resets DB and seeds test users/tokens). |
| `tests/health ckheck/health.test.ts` | **Health Check Test:** Verifies `GET /health` using `supertest` against in-memory `createApp()`, ensuring HTTP `200` and `{ status: 'ok', service: '...' }` response. |
| `tests/auth tests/register.test.ts` | **Authentication Tests:** Tests user registration endpoints and validation behavior for valid and invalid inputs. |

---

## 🌐 API Endpoints

All REST routes are prefixed with `/api` (except general/test endpoints):

### 1. General & Testing Endpoints
- `GET /health`
  - **Purpose:** Verifies server availability and health status.
- `POST /reset`
  - **Purpose:** Truncates database tables and resets identity counters (`TRUNCATE TABLE ... RESTART IDENTITY CASCADE`).
  - **Usage:** Testing and development helper to isolate test cases.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register`
  - **Purpose:** Registers a new user (defaults to `CUSTOMER` role).
  - **Access:** Public (validates request body against `registerSchema`).
  - **Body:** `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login`
  - **Purpose:** Authenticates user credentials and issues a signed JWT token.
  - **Access:** Public (validates request body against `loginSchema`).
  - **Body:** `{ "email": "...", "password": "..." }`
- `PATCH /api/auth/updaterole`
  - **Purpose:** Updates/upgrades a user's role.
  - **Access:** Protected (`Authorization: Bearer <token>`).
  - **Body:** `{ "email": "...", "role": "MERCHANT | MANUFACTURER | LOGISTICS_PROVIDER" }`
  - **Security Policies:**
    - Assigning `SUPER_ADMIN` role via API is strictly forbidden.
    - Only users with the current role of `CUSTOMER` are eligible for role modification. Once upgraded, roles cannot be modified.

### 3. GraphQL Endpoint
- `POST /graphql` (or open in browser for Apollo Sandbox):
  - Supports health check query:
    ```graphql
    query {
      health
    }
    ```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root with your database credentials:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=your_password

JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

### 5. Run Automated Tests
```bash
# Run all tests once
npm test

# Run tests in interactive watch mode
npx vitest
```
