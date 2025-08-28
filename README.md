# Backend App House

## Overview
This is a Node.js backend application using Express, Prisma, and Swagger for API documentation. It provides RESTful endpoints for resources such as users, cars, families, tasks, notes, recipes, and more. The project is designed for easy extension and clear API documentation for frontend and backend developers.

## Architecture
- **server.js**: Main entry point. Sets up Express, middleware, routes, and Swagger docs.
- **routes/**: Each resource (e.g., car, users) has its own route file. Routes map HTTP methods to controller functions and apply authentication.
- **controllers/**: Handle request logic, call service functions, process input, handle errors, and send JSON responses.
- **lib/services/**: Business logic and database access (via Prisma). Services validate input and perform queries.
- **docs/swagger/**: Swagger files for each resource describe API endpoints, request/response schemas, and parameters.

## Adding a New Route
1. **Create a Service**: Add business logic in `lib/services/[resource]Service.js`.
2. **Create a Controller**: Add controller functions in `controllers/[resource].js` that call your service.
3. **Create a Route**: Add a new route file in `routes/[resource].js`. Use Express Router to map endpoints to controller functions and apply authentication.
4. **Register the Route**: Import and mount your route in `server.js` (e.g., `app.use('/api/[resource]', [resource]Route);`).
5. **Document the API**: Add a Swagger file in `docs/swagger/[resource].js` describing endpoints, parameters, and schemas.
6. **Test Your Route**: Add tests in `controllers/__tests__/` and/or `routes/__tests__/`.

## API Documentation (for Frontend)
- All endpoints are under `/api/[resource]`.
- Standard REST methods: GET, POST, PUT, DELETE.
- Authentication required for most endpoints.
- Interactive Swagger docs available (when not in production).
- Request/response schemas are defined in Swagger files (see `#/components/schemas/[Resource]`).

## Running the Project
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in a `.env` file.
3. Run database migrations (if needed):
   ```bash
   npx prisma migrate deploy
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Access Swagger docs at `/api-docs` (development only).

## Testing
- Tests are located in `controllers/__tests__/`, `lib/services/__tests__/`, and `routes/__tests__/`.
- Run tests with:
   ```bash
   npm test
   ```

## Conventions
- Use single quotes, 2-space indentation, and semicolons.
- Prefer `const`/`let`, strict equality, and async/await.
- Always handle errors and validate input.
- Document new endpoints in Swagger.
- Add tests for all new features.

## Contact
For questions or contributions, please refer to the project maintainers.

## Existing Routes & Interfaces

Below is a summary of all available API routes, their endpoints, and the standard response object format. Each resource returns data in a consistent structure, making it easy for frontend and backend developers to integrate and extend.

### Routes & Endpoints

#### Auth (`/api/auth`)
- POST `/register` — Register a new user
- POST `/login` — Login and receive a token
- GET `/me` — Get current user info (authenticated)

#### Car (`/api/car`)
- GET `/` — Get all cars (authenticated)
- GET `/:id` — Get car by ID (authenticated)
- POST `/` — Create a new car (authenticated)
- PUT `/:id` — Update car by ID (authenticated)
- DELETE `/:id` — Delete car by ID (authenticated)

#### Car Location History (`/api/car-location-history`)
- GET `/` — Get all car location history (authenticated)
- GET `/:id` — Get car location history by ID (authenticated)
- POST `/` — Create a new car location history (authenticated)
- PUT `/:id` — Update car location history by ID (authenticated)
- DELETE `/:id` — Delete car location history by ID (authenticated)

#### Families (`/api/families`)
- POST `/` — Create a family (authenticated)
- GET `/members` — Get family members (authenticated)
- DELETE `/members/:userId` — Remove a family member (authenticated)
- POST `/invite` — Invite user to family (authenticated)

#### Goal (`/api/goal`)
- GET `/` — Get all goals (authenticated)
- GET `/:id` — Get goal by ID (authenticated)
- POST `/` — Create a new goal (authenticated)
- PUT `/:id` — Update goal by ID (authenticated)
- DELETE `/:id` — Delete goal by ID (authenticated)

#### Health (`/api/health`)
- GET `/` — Health check endpoint

#### Note (`/api/note`)
- GET `/` — Get all notes (authenticated)
- GET `/:id` — Get note by ID (authenticated)
- POST `/` — Create a new note (authenticated)
- PUT `/:id` — Update note by ID (authenticated)
- DELETE `/:id` — Delete note by ID (authenticated)

#### Recipe (`/api/recipe`)
- GET `/` — Get all recipes (authenticated)
- GET `/:id` — Get recipe by ID (authenticated)
- POST `/` — Create a new recipe (authenticated)
- PUT `/:id` — Update recipe by ID (authenticated)
- DELETE `/:id` — Delete recipe by ID (authenticated)

#### Tasks (`/api/tasks`)
- GET `/` — Get all tasks (authenticated)
- GET `/:id` — Get task by ID (authenticated)
- POST `/` — Create a new task (authenticated)
- PUT `/:id` — Update task by ID (authenticated)
- DELETE `/:id` — Delete task by ID (authenticated)

#### Users (`/api/users`)
- GET `/` — Get all users (authenticated)
- POST `/` — Create a new user

---

### Standard Response Object
All API responses follow this structure:
```json
{
  "data": {
    "success": true | false,
    "error": "Error message if any",
    // Resource(s) data
    "car": { ... },
    "cars": [ ... ],
    "user": { ... },
    "users": [ ... ],
    // ...other resources
  }
}
```
- For successful requests, `success` is `true` and the resource(s) are included.
- For errors, `success` is `false` and `error` contains the message.

---

### Main Interfaces (Resource Schemas)
Below are examples of the main data interfaces for each resource:

#### Car
```ts
interface Car {
  id: string;
  make: string;
  model: string;
  year?: number;
  licensePlate: string;
  userId: string;
  familyId?: string;
}
```

#### User
```ts
interface User {
  id: string;
  name: string;
  email: string;
  // ...other fields
}
```

#### Task
```ts
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  completed?: boolean;
  repeatFrequency?: string;
  categoryId?: string;
}
```

#### Note, Recipe, Goal, Family, CarLocationHistory
Each has a similar structure: `id`, main fields, and references to related resources (see Swagger docs for details).

---
