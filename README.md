# ChatWave

ChatWave is a WhatsApp-style real-time messaging app built with a React frontend, an Express backend, MongoDB, Redis, and Docker Compose.

## Current Scope

- JWT based authentication: register, login, logout, refresh token, and get current user
- Protected backend routes with auth middleware
- MongoDB persistence for users, sessions, and conversations
- Redis support for cache/session-related backend work
- React frontend with feature-based structure
- Redux Toolkit auth state
- Vite proxy for frontend-to-backend API calls
- Docker Compose setup for frontend, backend, MongoDB, and Redis

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB |
| Cache | Redis with ioredis |
| DevOps | Docker, Docker Compose |

## Project Structure

```txt
ChatWave/
  backend/
    src/
      config/
      controllers/
      dao/
      middlewares/
      models/
      routes/
      services/
      utils/
      validator/
    server.js
    package.json

  frontend/
    src/
      app/
      features/
      shared/
    vite.config.js
    package.json

  docker-compose.yml
```

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://mongodb:27017/chatwave
REDIS_URL=redis://redis:6379
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

For local backend without Docker, use:

```env
MONGO_URI=mongodb://localhost:9000/chatwave
REDIS_URL=redis://localhost:6379
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

## Run With Docker

Start all services in background:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Watch logs:

```bash
docker compose logs -f
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove volumes:

```bash
docker compose down -v
```

Use `-v` only when you intentionally want to remove MongoDB and Redis stored data.

## Local Development Without Docker

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Service URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000/api` |
| MongoDB host port | `localhost:9000` |
| Redis host port | `localhost:6379` |

Inside Docker, the backend connects to MongoDB using `mongodb://mongodb:27017/chatwave` and Redis using `redis://redis:6379`.

## API Routes

Base URL:

```txt
/api
```

Auth:

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me
PUT    /auth/update-profile
DELETE /auth/delete-user
GET    /auth/user/search
GET    /auth/user/:id
```

Users:

```txt
GET /users
```

Conversations:

```txt
POST /conversations
POST /conversations/open
```

Protected routes require:

```txt
Authorization: Bearer <accessToken>
```

## Frontend API Flow

The frontend should call APIs with relative paths like:

```txt
/api/auth/login
/api/auth/me
```

Vite proxy forwards `/api` requests to the backend. This avoids browser CORS issues during development.

## Common Issues

### Port already allocated

Only one process/container can use the same host port at a time.

Check containers:

```bash
docker ps
```

Stop a container:

```bash
docker stop <container_name_or_id>
```

### 401 on `/api/auth/me`

This route is protected. It returns `401 Unauthorized` when the access token is missing, expired, or invalid.

Check that the request has:

```txt
Authorization: Bearer <accessToken>
```

### Frontend cannot reach backend

Use relative API paths from the frontend:

```txt
/api/auth/login
```

Do not hardcode `http://localhost:3000` in frontend API calls when using Vite proxy.

## Useful Commands

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
docker compose logs -f redis
docker compose down
```

## Learning Notes

- Docker Compose service names become DNS names inside the Docker network.
- `localhost` inside a container means that same container, not your host machine.
- MongoDB stores durable app data.
- Redis stores fast temporary data such as cache, session helpers, and presence.
- Redux stores frontend UI/auth state in browser memory.
- `localStorage` persists selected frontend data after refresh.
