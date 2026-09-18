# Build and Test Commands Reference

**Note:** This document is a manual smoke-test aid. It documents the actual build and test commands available in this repository's manifests, extracted from `package.json` files and Docker configurations. Use this as a reference when verifying the repository's build process or updating documentation.

## Overview

This three-tier application consists of:
- **Database layer** (`src/db`) — PostgreSQL migrations
- **API layer** (`src/api`) — Express.js backend
- **Web layer** (`src/web`) — Next.js frontend

## Full Stack: Docker Compose

Start all services (database, migrations, API, web frontend):

```bash
docker compose up --build
```

This starts four services in order:
1. **postgres** — PostgreSQL 18 database
2. **migrate** — runs `node-pg-migrate up` to apply schema migrations, then exits
3. **api** — Express API on port 3001 (internal only)
4. **web** — Next.js frontend on port 3000 (exposed to host)

Once running, open [http://localhost:3000](http://localhost:3000)

## Database Layer (`src/db`)

**Package:** `node-pg-migrate` v8.0.4

### Available Commands

```bash
# Apply pending migrations
npm run migrate

# Rollback the last migration
npm run migrate:down
```

### Docker Build

```bash
docker build ./src/db
```

The Dockerfile runs migrations automatically via `npx node-pg-migrate up`.

## API Layer (`src/api`)

**Package:** Express v5.2.1, pg v8.21.0

### Available Commands

```bash
# Start the server
npm start

# Start with auto-reload (development)
npm run dev

# Run tests (currently not implemented)
npm test
```

### Docker Build

```bash
docker build ./src/api
```

The Dockerfile exposes port 3001 and runs `node index.js`.

## Web Layer (`src/web`)

**Package:** Next.js v16.2.9, React v19.2.4

### Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint
npm run lint
```

### Docker Build

```bash
docker build ./src/web
```

The Dockerfile uses a multi-stage build:
1. **deps** — installs dependencies
2. **builder** — runs `npm run build` to create optimized Next.js output
3. **runner** — serves the production build on port 3000

## Local Development Workflow

### Prerequisites

- Docker and Docker Compose
- Node.js 22 (for local development outside containers)

### Start Everything

```bash
docker compose up --build
```

### Develop Individual Layers

If you want to run a layer locally (outside Docker) for faster iteration:

**Database migrations:**
```bash
cd src/db
npm install
npm run migrate
```

**API server:**
```bash
cd src/api
npm install
npm run dev
```

**Web frontend:**
```bash
cd src/web
npm install
npm run dev
```

### Build for Production

```bash
# Build all images
docker compose build

# Or build individual layers
docker build ./src/db
docker build ./src/api
docker build ./src/web
```

## Environment Variables

Each service reads configuration from environment variables:

- **postgres** — `POSTGRES_DB`, `POSTGRES_PASSWORD`, `POSTGRES_USER`
- **migrate** — `DATABASE_URL`
- **api** — `PORT`, `DATABASE_URL`
- **web** — `PORT`, `API_URL`

See `docker-compose.yml` for defaults.

## Testing

Currently, test suites are not implemented in this repository. The `npm test` commands in `src/api` and `src/db` are placeholders.

To add tests, update the `test` script in the respective `package.json` files.
