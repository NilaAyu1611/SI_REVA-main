# SIREVA Spring Boot Backend

This backend serves the whole SIREVA API (`/api/**`) with Spring Boot 3.x, Java 21 and PostgreSQL. The Nuxt frontend is a static SPA (`pnpm generate`) served by Nginx, which proxies `/api` to this service; see `deploy/nginx.conf.example`.

## Requirements

- Java 21
- Maven 3.9 or newer
- Network access to the PostgreSQL database

## Configure

Set these environment variables in the shell or deployment secret manager. Do not commit credentials:

- `DB_URL`: JDBC URL, for example `jdbc:postgresql://localhost:5432/postgres?currentSchema=sireva`
- `DB_USERNAME`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `SERVER_PORT`: optional; defaults to `8081`

The database must already have the `sireva.users` table. This backend does not modify database schema.

## Run

From this directory, start the backend with `mvn spring-boot:run`. In development, `pnpm dev` proxies `/api/**` to `http://localhost:8081` (override with `API_PROXY_TARGET`). In production, build the frontend with `pnpm generate` and serve it with Nginx using `deploy/nginx.conf.example`; package the backend with `mvn package` and run `java -jar target/*.jar`.

## Login API

`POST /api/auth/login`

Request:

```json
{
  "usernameOrEmail": "user-name",
  "password": "your-password"
}
```

Successful response keeps the shape consumed by the current frontend:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user-name",
    "alias": "User",
    "unit_kerja": "Unit",
    "role_id": 1,
    "role": "admin"
  },
  "message": "Login berhasil"
}
```

The current `users` schema has no email column, so login looks up the username even though the legacy request field is named `usernameOrEmail`. The `/api/users` endpoints preserve the legacy JSON field names and omit password hashes from responses. Session hardening and the remaining API modules are not yet migrated.
