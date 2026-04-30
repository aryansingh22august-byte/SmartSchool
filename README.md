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

This scaffold is built for a Railway hosting flow, with CI via GitHub Actions.
