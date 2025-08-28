# Backend App House

## Overview
This is the backend for the App House project, built with Node.js, Express, and Prisma. It provides a RESTful API for managing users, tasks, notes, cars, families, recipes, health data, and more.

## API Conventions
- **Base URL:** `/api/<resource>` (e.g., `/api/tasks`, `/api/note`)
- **Response Format:**
  - Success: `{ data: ... }` (single object or array)
  - Error: `{ error: ... }`
- **Authentication:** Most endpoints require a Bearer token (JWT).

## Main Resources
- `/api/users` - User management
- `/api/tasks` - Task management
- `/api/note` - Note management
- `/api/car` - Car management
- `/api/families` - Family management
- `/api/recipe` - Recipe management
- `/api/goal` - Goal management
- `/api/health` - Health data

## Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in required values (DB, JWT, etc).
3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Start server:**
   ```bash
   npm start
   ```

## Testing
- **Run all tests:**
  ```bash
  npm test -- --coverage
  ```
- **Test API routes:**
  ```bash
  ./test_api.sh
  ```

## Documentation
- **Swagger docs:** See `docs/swagger/` for OpenAPI specs for all resources.
- **Response format:** All endpoints return `{ data: ... }` for success and `{ error: ... }` for errors.

## Contribution
- Follow code style in `.copilot-instructions`.
- Add/maintain tests for all changes.
- Keep swagger docs up to date.

---
For questions or issues, open a GitHub issue or contact the maintainer.

