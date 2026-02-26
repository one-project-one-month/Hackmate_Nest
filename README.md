# Hackmate Chat Service — Dev Setup

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

```bash
cp exampleEnv .env
```

Then open `.env` and fill in your local PostgreSQL credentials:

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
docker compose up -d
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

## 6. Swagger API Docs

```
http://localhost:3000/docs
```

---

## Other Useful Commands

| Command | Description |
|---|---|
| `npm run migration:generate` | Generate migration after changing entities |
| `npm run migration:revert` | Revert the last migration |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
