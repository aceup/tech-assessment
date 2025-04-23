# Aceup Tech Assessment

This repository contains two projects:
- **frontend/**: React 19 + Vite application
- **backend/**: Ruby on Rails 7.2 API-only application (Ruby 3.2)

All services run in Docker using `docker-compose`.

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick Start

1. **Build and start all services:**

```bash
make build
```

2. **Access the apps:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend (Rails API): [http://localhost:3000](http://localhost:3000)

3. **Database**
- Postgres runs in the `db` service.
- Default credentials (see `docker-compose.yml`):
  - Host: `db`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `aceup_db`

4. **First-time Rails setup** (run in another terminal):

```bash
make db.init
```

## Useful Commands

- **Rebuild images after dependency changes:**
  ```bash
  make build
  ```

- **Start the services:**
  ```bash
  make start
  ```

- **Stop all services:**
  ```bash
  make stop
  ```

- **Go into rails console:**
  ```bash
  make rails.c
  ```

- **Go into bash console:**
  ```bash
  make sh
  ```

- **Run migrations:**
  ```bash
  make db.migrate
  ```

## Exercise

Following the MVCS pattern (Model, View, Controller, Service), create a very simple order management system.

**Frontend**

- Create a Dashboard with at least 1 stat (# of orders created)
- Create an order table | New Order button | New Order dialog
- Refresh orders after new is created

**Backend**

- Orders crud
- Send an email after order is created
