# Hackmate Chat Service — Dev Setup

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

```bash
cp .example.env .env
```

Then open `.env` and fill in your local PostgreSQL credentials the .env.example is already configured if you use docker-compose:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=hackmate_chat
```

> **Do not commit `.env`** — it's in `.gitignore`.

## 3. Start the Database (Docker)

If you don't have PostgreSQL locally:

```bash
docker compose up chat_db -d
```

Default credentials from `docker-compose.yml`:

- User: `hackmate_user`
- Password: `hackmate_password`
- DB: `db`
- Port: `5432`

Update your `.env` to match if using Docker.

## 4. Run Migrations

```bash
npm run migration:run
```

## 5. Start the App

```bash
npm run start:dev
```

App runs at: `http://localhost:3000`

## 6. Swagger API Docs (Non-Production Only)

```
http://localhost:3000/docs
```

---

# Design Overview

## Architecture

- NestJS HTTP API plus Socket.IO gateway for realtime messaging.
- PostgreSQL via TypeORM (relational persistence modules per feature).
- Auth is delegated to the main backend via `AUTH_ME_URL` or `BACKEND_DOMAIN`.

## Auth & Security

- HTTP endpoints are protected by a global auth guard.
- WebSocket connections validate tokens and attach `user.id` to `client.data`.
- Group membership is enforced for:
  - Listing group messages.
  - Sending messages.
  - Marking messages as read.
  - Joining WebSocket rooms.
- WebSocket events are emitted to per-group rooms (`group:{id}`) instead of the whole namespace.
- Non-production fake auth is disabled by default; enable it explicitly with `ALLOW_FAKE_AUTH=true`.
- CORS is restricted to `FRONTEND_DOMAIN` in production. For WebSockets, use `WS_CORS_ORIGIN` if different.

## Core Data Model

- `chat_groups`: group metadata and creator.
- `chat_group_members`: membership, roles, read state.
- `messaging_messages`: message payloads and timestamps.

## Runtime Flow (Happy Path)

1. Client authenticates with the main backend and obtains a token.
2. HTTP requests include `Authorization: Bearer <token>`.
3. Socket.IO connection passes the token via `auth.token` or `Authorization` header.
4. Client joins a group room with `group:join`.
5. Sending a message publishes to `group:{id}:message:new` in that room.

## Relevant Environment Variables

- `FRONTEND_DOMAIN`: allowed CORS origin for HTTP (required in production).
- `WS_CORS_ORIGIN`: allowed CORS origin for WebSockets (optional).
- `AUTH_ME_URL`: full URL to auth-me endpoint (optional).
- `AUTH_ME_TIMEOUT_MS`: auth request timeout in ms (default `2000`).
- `ALLOW_FAKE_AUTH`: enable `x-user-id` header in non-production.

---

# Docker Compose Build/Up

```sh
docker-compose build
docker-compose up # or docker-compose up -d (for detaching)

# OR

docker-compose up --build # or docker-compose up --build -d
```

## Other Useful Commands

| Command                      | Description                                |
| ---------------------------- | ------------------------------------------ |
| `npm run migration:generate` | Generate migration after changing entities |
| `npm run migration:revert`   | Revert the last migration                  |
| `npm run test`               | Run unit tests                             |
| `npm run test:e2e`           | Run e2e tests                              |
