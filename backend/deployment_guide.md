# Backend Deployment Guide (Render.com)

Since your backend is in a subfolder named `backend`, you need to configure Render to point to that specific directory. Follow these steps:

## 1. Prepare for Deployment
Ensure your `MONGO_URI` in `.env` is NOT pointing to `localhost`. Render cannot access your local computer's MongoDB.
> [!IMPORTANT]
> You must use a cloud database like **MongoDB Atlas**. Update your `MONGO_URI` in the Render dashboard (Environment Variables) with your Atlas connection string.

## 2. Render Configuration
When creating a new **Web Service** on Render, use these settings:

| Setting | Value |
| :--- | :--- |
| **Repository** | Connect your GitHub repo |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

## 3. Environment Variables
In the **Environment** tab on Render, add the following variables from your local `.env` file:
- `MONGO_URI` (Use your MongoDB Atlas string)
- `JWT_SECRET`
- `JWT_EXPIRE`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_USER`
- `SMTP_PASS`

## 4. Troubleshooting
- **CORS Errors**: If your frontend is on a different domain, ensure `cors()` in `server.js` allows it.
- **Port**: Render automatically provides a `PORT`. Your code `process.env.PORT || 5000` is already correct.
