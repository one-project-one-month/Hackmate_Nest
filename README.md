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

## 6. Swagger API Docs

```
http://localhost:3000/docs
```

---

# Docker Compose Build/Up

```sh
docker-compose build
docker-compose up # or docker-compose up -d (for detaching)

# OR

docker-compose up --build # or docker-compose up --build -d
```

## Other Useful Commands

| Command | Description |
|---|---|
| `npm run migration:generate` | Generate migration after changing entities |
| `npm run migration:revert` | Revert the last migration |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
