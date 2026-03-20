# Railway Deployment Guide (SAFE)

This project is configured as a unified monorepo. The backend serves the compiled frontend. This guide focus on **SAFE** deployment to protect your existing data.

## 1. Safety Measures (Data protection)
The system now includes a dedicated script: `backend/scripts/db_safe_sync.js`.
This script uses `alter: true`, which **guarantees** that:
- Tables `support_tickets`, `inquiries`, `categories`, and `api_keys` **will NOT be deleted or overwritten**.
- All existing data remains intact.
- New tables `email_accounts`, `emails`, and `attachments` will be created automatically.

## 2. Deployment Prompt (Copy & Paste)
Use this prompt for your Railway deployment assistant (or follow these steps manually):

> [!IMPORTANT]
> **Safe Deployment Prompt:**
> Perform a safe deployment of the EP-Admin-Panel to Railway:
> 1. **Environment Check**: Ensure `DATABASE_URL` (for MySQL) and `REDIS_URL` are correctly set in Railway variables.
> 2. **Safe Migration**: Run `node backend/scripts/db_safe_sync.js` to initialize the new E-Mail database schema WITHOUT affecting existing Support, Inquiry, or Category data.
> 3. **Build**: Run `npm run build` from the root to compile the frontend and install all backend dependencies.
> 4. **Start**: Ensure the start command is `npm start` (which runs `node src/app.js` in the backend).

## 3. Environment Variables (Reminder)
| Variable | Value/Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Use reference to MySQL service (e.g., `${{MySQL.MYSQL_URL}}`) |
| `FRONTEND_URL` | Your production URL (e.g., `https://admin.empire-premium.de`) |
| `MAILGUN_API_KEY` | Your Mailgun API Key |
| `MAILGUN_DOMAIN` | `mail.empire-premium.de` |

## 4. Troubleshooting
- **Build fails**: Ensure `npm` versions are compatible.
- **Database error**: Verify `DATABASE_URL`.
- **Logos missing**: Ensure `FRONTEND_URL` is correct in `.env`.
