# Elections Management System (EMS)

A web-based platform simulating a full election process — voter/candidate registration, multiple concurrently-running elections, role-based access control, and result declaration.

**Live app:** https://ems-ten-smoky.vercel.app
**Live API:** https://ems-tmm6.onrender.com

## Tech Stack

- **Backend:** Django + Django REST Framework, Python 3.12
- **Frontend:** React + Vite
- **Database:** PostgreSQL (SQLite fallback for local dev)
- **Containerization:** Docker + Docker Compose
- **Deployment:** Render (backend + Postgres), Vercel (frontend)

## Architecture

React (Vercel) ---- HTTPS/JSON (REST API) ----> Django + DRF (Render) ----> PostgreSQL (Render)


The frontend never talks to the database directly — all requests go through the Django API, where auth and business rules are enforced.

## Project Structure

EMS/
├── backend/ # Django project
│ ├── config/ # settings, urls, wsgi/asgi
│ ├── entrypoint.sh # runs migrations + superuser setup, then starts Gunicorn
│ ├── Dockerfile
│ └── requirements.txt
├── frontend/ # React + Vite project
│ ├── src/
│ └── Dockerfile
└── docker-compose.yml # runs backend + frontend + Postgres together, for local dev


## Local Development

### Prerequisites
- Git
- Docker Desktop (with WSL2 integration enabled, if on Windows)

### Setup

1. Clone the repo:
```bash
   git clone https://github.com/IshanBhagat/EMS.git
   cd EMS
```

2. Create `backend/.env`:

SECRET_KEY=django-insecure-local-dev-only
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173


3. Create `frontend/.env`:

VITE_API_URL=http://localhost:8000


4. Run everything:
```bash
   docker compose up --build
```

5. In a second terminal, apply migrations (first run only):
```bash
   docker compose exec backend python manage.py migrate
   docker compose exec backend python manage.py createsuperuser
```

6. Verify:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - Admin: http://localhost:8000/admin

### Running without Docker

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env` locally, Render dashboard in production)

| Variable | Purpose | Local default |
|---|---|---|
| `SECRET_KEY` | Django cryptographic signing key | dev placeholder |
| `DEBUG` | Show detailed error pages | `True` |
| `ALLOWED_HOSTS` | Domains allowed to serve the app | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Frontend domains allowed to call the API | `http://localhost:5173` |
| `DATABASE_URL` | Postgres connection string (falls back to SQLite if unset) | unset |
| `DJANGO_SUPERUSER_USERNAME` / `_EMAIL` / `_PASSWORD` | Auto-creates an admin user on container startup | unset locally |

### Frontend (`frontend/.env` locally, Vercel dashboard in production)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Deployment

- **Backend (Render):** deploys from `main`, builds via `backend/Dockerfile`. On every container start, `entrypoint.sh` runs migrations, attempts to create the superuser from env vars (safely skipped if it already exists), then starts Gunicorn.
- **Frontend (Vercel):** deploys from `main`, root directory set to `frontend/`, auto-detected as a Vite project.
- Pushing to `main` auto-redeploys both.

## Branching

- `main` — stable, deployed branch.
- `dev` — active development. Merge into `main` via pull request once verified locally.
