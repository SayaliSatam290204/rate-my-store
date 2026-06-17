# RateMyStore — Project Challenge Submission

RateMyStore is a full-stack web application designed for store discovery and peer-reviewed store ratings. It supports role-based features for **Normal Users** (browse, paginate, and rate stores), **Store Owners** (monitor average ratings, rater logs, and sort reviews), and **Admins** (manage, search, sort, and add new users/stores).

---

## 🚀 Tech Stack

*   **Frontend**: React (Vite + TypeScript), Tailwind CSS, React Router v7, `@tanstack/react-query`, `react-hook-form` + `zod`
*   **Backend**: Node.js, Express, TypeScript, Sequelize (using `sequelize-typescript`), PostgreSQL, `express-validator`
*   **Testing**: Jest + Supertest (Backend Integration), Vitest + React Testing Library + jsdom (Frontend Unit)
*   **Orchestration**: Docker Compose (PostgreSQL 16)

---

## 🛠️ Quick Setup (One-Command Reviewer Setup)

Follow these steps to get the project up and running locally.

### 1. Database Setup (Docker Compose)
Spin up the preconfigured PostgreSQL database at the root of the project:
```bash
docker-compose up -d
```
*(Alternatively, configure your local PostgreSQL server on port `5432` and specify matching details in the `.env` file.)*

### 2. Backend Setup & Data Seeding
Open a new terminal window:
```bash
cd backend
npm install
cp .env.example .env
npm run seed     # Truncates tables and seeds initial users and stores
npm run dev      # Starts development server on port 5000
```

### 3. Frontend Setup
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts development server on port 5173
```
Now, navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Pre-Seeded Accounts

| User Role | Email Address | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@ratemystore.com` | `Admin@123` |
| **Store Owner** | `owner@ratemystore.com` | `Owner@123` |
| **Normal User** | `user1@ratemystore.com` | `User1@123` |

---

## 🧪 Running Tests

### Backend Tests (Jest + Supertest)
Verify backend controller validations, authentication, and error handling routes:
```bash
cd backend
npm run test
```

### Frontend Tests (Vitest + React Testing Library)
Verify frontend layouts and validation states under simulated virtual DOM:
```bash
cd frontend
npm run test
```

---

## 🔒 Security Hardening & Architecture Decisions

1.  **Split Express Setup (`app.ts` vs `index.ts`)**: Extracted the Express application setup to a separate `app.ts` file, leaving the listener initialization in `index.ts`. This allows Supertest integration tests to run against the app in-memory without starting local ports, preventing port conflict issues.
2.  **Auth Rate Limiting**: Enabled rate-limiting on all `/api/auth` endpoints using `express-rate-limit` to defend against brute force registration or login attempts.
3.  **HTTP Headers**: Integrated `helmet` to apply secure HTTP response headers (e.g. XSS protection, MIME sniffing protection).
4.  **Backend Data Validation Trimming**: Standardized validator chains to perform sanitization (`.trim()`, `.normalizeEmail()`) *before* checking length limitations. This prevents spaces from passing constraints and throwing database validation errors downstream.
5.  **Deduplicated Store Fetching**: Refactored the `/stores` API controller to extract mapping loops into a single utility helper (`buildStoreResponse`), supporting both paginated and unpaginated requests.
6.  **Accessibility (a11y) & Modal UX**: Added proper `aria-labels` to the ratings inputs and ref-based modal focus capture/restoration controls to guarantee screen readers and keyboard navigation flows are compliant.
