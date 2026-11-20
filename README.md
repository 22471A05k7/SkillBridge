# SkillBridge

SkillBridge is a career-readiness and skill-gap platform built with React and Spring Boot.

## Features

- Account registration, login and logout with Spring Security sessions
- Multi-step onboarding and a personal career dashboard
- Skill CRUD, filtering and proficiency management
- Career exploration and weighted skill-gap analysis
- Personalized learning roadmap
- Technical assessments and mock interviews
- Rule-based career assistant and keyword-based resume analysis
- Analytics, profile settings and simulated admin dashboard
- Per-account persistence for application data

## Requirements

- Node.js 20.19+ or 22.12+
- Java 17+

## Run locally

Start the backend in PowerShell. The Maven Wrapper downloads Maven automatically, so Maven does not need to be installed separately:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

In another terminal, install frontend dependencies and start Vite:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Its development server proxies `/api` requests to `http://localhost:8081`.

The backend uses a file-based H2 database at `backend/data/skillbridge`. Registration requires a valid email and a password of at least eight characters. Each account's profile, skills, roadmap, assessment and interview history, and other app state are saved separately.

## Backend API

- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — start a session
- `GET /api/auth/me` — get the signed-in account
- `POST /api/auth/logout` — end the session
- `GET /api/state` and `PUT /api/state` — read and save that account's application state
- `GET /api/auth/csrf` — obtain a CSRF token for write requests

Passwords are stored as BCrypt hashes. The browser uses an HTTP-only session cookie and CSRF tokens for state-changing requests.

## Other commands

```bash
npm run build
npm run preview
```

## Skill gap calculation

Every career skill has a weight and required proficiency. The app compares the user level (Beginner 1, Intermediate 2, Advanced 3, Expert 4) with the required level. Missing skills receive no score. The final readiness score is the weighted matched ratio divided by total career weight.

## Demo feature limitations

The career assistant is rule-based JavaScript and is not connected to an AI model. Mock interview feedback and resume matching are simulated, and resume matching is keyword-based rather than an ATS guarantee. The admin screen is still a simulated frontend view.
