# Smart School ERP

Full-stack Smart School ERP workspace with React frontend and Express backend.

## Structure

- `frontend/` — React + Vite + Tailwind app
- `backend/` — Node.js + Express API server

## Local setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Role-based access control

The application now supports separate role definitions and authorization.
- Roles are defined separately in `backend/src/data/roles.js`.
- Authorization middleware enforces route permissions.
- Frontend navigation and route access are filtered by the logged-in user's role.

## Notes

This scaffold is built for a Railway hosting flow, with the backend serving the built frontend from `frontend/dist`.

## Deployment

### Railway (recommended)
1. Push the repository to GitHub.
2. Create a new Railway project and connect your GitHub repository.
3. Set the environment variables in Railway:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Railway will run the root `railway.json` build commands:
   - `cd backend && npm install`
   - `cd frontend && npm install && npm run build`
5. Railway deploys using:
   - `cd backend && npm start`

### Alternative
- Use Vercel or Netlify for the frontend and Railway or another host for the backend API.
