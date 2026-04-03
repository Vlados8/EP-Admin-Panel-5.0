# Railway Deployment Guide: Empire Premium Bau

This guide provides instructions for deploying and configuring the **Empire Premium Bau** CRM on Railway.

## 1. Linked Repository
Ensure your Railway project is linked to the following GitHub repository:
`https://github.com/Vlados8/EP-Admin-Panel-5.0.git`

## 2. Environment Variables
You must set the following variables in the Railway dashboard (**Settings > Variables**):

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NODE_ENV` | Set to `production` | Manual |
| `DATABASE_URL` | MySQL Connection URL | Provided by Railway MySQL Service |
| `JWT_SECRET` | Strong random string for auth tokens | Manual |
| `PORT` | 3000 (default) | Automatic (Railway) |
| `MAILGUN_API_KEY` | For email functionality | Mailgun Dashboard |
| `MAILGUN_DOMAIN` | For email functionality | Mailgun Dashboard |
| `SESSION_SECRET` | Strong random string | Manual |

## 3. Persistent Volumes (CRITICAL)
The application stores user-uploaded files in the `uploads/` directory. By default, Railway's filesystem is ephemeral. To prevent data loss:
1. Go to your service **Settings > Volumes**.
2. Click **Add Volume**.
3. Set the **Mount Path** to: `/app/uploads`
4. Click **Create Volume**.

## 4. Build & Start Configuration
The project is already configured via `railway.json`. The root `package.json` contains the orchestration scripts:
- **Build Command**: `npm run build` (Installs all dependencies and builds the React frontend).
- **Start Command**: `npm start` (Runs the Node.js backend which serves the built frontend).
- **Healthcheck**: `/api/v1/health` (Automatically monitored by Railway).

## 5. First-Time Setup
On the first deployment, the backend will automatically:
1. Synchronize the database schema with the models.
2. Run any necessary schema fixes (e.g., adding missing columns).
3. Seed the initial data if the database is empty.

---
> [!TIP]
> Use the **Railway CLI** (`railway logs`) to monitor the initial bootstrap and database synchronization status.
