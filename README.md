# Dragon Vault

Website created to manage Dungeon & Dragon sessions remotely and easily.

## Env Variables

__Backend__:
```env
PORT=8080
CORS_ORIGIN=http://host:port
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=
DATABASE_URL=
```

__Frontend__:
```env
REACT_APP_BACKEND_PATH=http://host:port/api
```

## Running for Development

### Requirements
- Node.js `^20.19.0 || >=22.12.0`
- npm `>=9.x`

__This requires a pre-existing service/container of postgres to be running.__
If you do not have a PostgreSQL instance running, follow these steps to set it up for Dragon Vault:

1. Startup/create an instance of Postgres with default settings.
2. Create this database `dragon_vault`.
3. Create a user named `dragon_vault_user` that can access the database. (__Make sure to keep the password as you'll need that in the `.env` file under `frontend/`__) 

Then, you will have to start the 2 layers separately.

> To start the frontend you must be using __Node 21.7.0+__!

To start the frontend:
```bash
cd frontend/;

npm install; # Make sure to install all the npm_modules

npm run dev;
```

To start the backend:
```bash
cd backend/;

npm install; # Make sure to install all the npm_modules

npm run dev;
```

## Running for Production

Simply run:

```bash
docker compose up -d --build;
```
