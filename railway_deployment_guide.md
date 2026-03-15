# Railway Deployment Guide

This project is configured as a unified monorepo. The backend serves the compiled frontend, allowing you to run the entire system as a single Railway service.

## 1. Prerequisites on Railway
In your Railway project, you need to add the following services:
- **MySQL Database**
- **Redis Internal Database**

## 2. Environment Variables
In the settings of your main application service (the GitHub repo), add these variables:

| Variable | Value/Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` (Railway usually sets this automatically) |
| `JWT_SECRET` | A long, secure random string for login security |
| `DATABASE_URL` | Use the reference to your MySQL service (e.g., `${{MySQL.MYSQL_URL}}`) |
| `REDIS_URL` | Use the reference to your Redis service (e.g., `${{Redis.REDIS_URL}}`) |

## 3. How the deployment works
- Railway detects the `railway.json` file.
- It runs `npm run build` from the root, which installs all dependencies and builds the production frontend.
- It runs `npm start`, which starts the Node.js backend.
- The backend serves the frontend from `frontend/dist`.

## 4. Troubleshooting
- **Build fails**: Ensure `npm` versions are compatible (Nixpacks usually handles this).
- **Database connection error**: Double check that `DATABASE_URL` is correctly linked to the MySQL service.
- **Styles missing**: I've already fixed the Tailwind production config, so this should work "out of the box".
