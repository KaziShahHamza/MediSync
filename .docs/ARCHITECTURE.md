# MediSync Architecture

## 1. Runtime flow

The app is a single-server React + Express architecture:

Browser UI
→ React Router in `client/src/App.jsx`
→ `fetch()` requests to Express API routes in `server/routes/`
→ Mongoose models in `server/models/`
→ MongoDB

This is not a microservice system. There is one Express server and one frontend SPA.

## 2. Frontend structure

### Entry points

- `client/src/main.jsx` mounts the app
- `client/src/App.jsx` composes providers, routing, navbar, and route guards

### Provider nesting in `App.jsx`

The actual nesting order is:

- `AuthProvider`
- `LifestyleProvider`
- `ProfileProvider`
- `MedicineProvider`
- `PrescriptionProvider`
- `ReportProvider`
- `DoctorProvider`
- `BrowserRouter`

Then the app renders:

- `ScrollToTop`
- `Navbar`
- route definitions for public and protected screens

### Route groups

Public routes:

- `/`
- `/login`
- `/signup`
- `/lifestyle`

Protected routes:

- `/dashboard`
- `/medicines`
- `/health`
- `/prescriptions`
- `/reports`
- `/doctors`
- `/profile`
- `/settings`

`client/src/components/ProtectedRoute.jsx` checks the authenticated `user` from `AuthContext` and redirects to `/login` when missing.

### Pages and responsibilities

- `client/src/pages/Home.jsx`: landing page
- `client/src/pages/Login.jsx` and `Signup.jsx`: auth UI
- `client/src/pages/Dashboard.jsx`: dashboard summary and PDF trigger
- `client/src/pages/Health.jsx`: BP, sugar, BMI, lifestyle-related UI
- `client/src/pages/Medicines.jsx`: medicine management
- `client/src/pages/Doctors.jsx`: doctor registry
- `client/src/pages/Prescriptions.jsx`: uploaded prescription images
- `client/src/pages/Reports.jsx`: uploaded report images
- `client/src/pages/Profile.jsx` and `Settings.jsx`: profile state
- `client/src/pages/lifestyle/`: lifestyle questionnaire and results

### Context responsibilities

- `client/src/context/AuthContext.jsx`: auth user + login/logout
- `client/src/context/LifestyleContext.jsx`: assessment fetch/save logic
- `client/src/context/ProfileContext.jsx`: user-profile fetch + state
- `client/src/context/MedicineContext.jsx`: medicines fetch and shared state
- `client/src/context/PrescriptionContext.jsx`: prescription list fetch
- `client/src/context/ReportContext.jsx`: report list fetch
- `client/src/context/DoctorContext.jsx`: doctors list fetch

### Hooks

- `client/src/hooks/useHealthLogs.js`: health record fetch and mutation flow
- `client/src/hooks/useMedicineReminder.js`: exists in the repo, but is not actively wired into `App.jsx` at the moment

### Styling

- `client/src/index.css` is the shared style entry with Tailwind and custom semantic classes
- actual design classes include `.card`, `.page-title`, `.section-title`, `.btn-primary`, `.stat-card`, and others
- the repo uses utility classes plus a small custom design system rather than a separate CSS framework

## 3. Auth flow

The actual auth contract is:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- JWT payload is `{ id: user._id }`
- client stores `localStorage.token` and `localStorage.user`
- `Authorization: Bearer <token>` is sent to protected API routes

The server auth gate is `server/middleware/auth.js` and it sets `req.userId` after verifying the JWT.

## 4. Backend structure

### API mount points in `server/server.js`

- `/api/dashboard`
- `/api/ai`
- `/api/export`
- `/api/medicines`
- `/api/auth`
- `/api/health`
- `/api/profile`
- `/api/prescriptions`
- `/api/doctors`
- `/api/reports`
- `/api/lifestyle`

### Middleware and route logic

- `server/middleware/auth.js`: JWT verification and `req.userId`
- route files under `server/routes/` handle CRUD and user-scoped filtering
- there is no central API router beyond route mounting in `server/server.js`

### Service layer

- `server/services/dashboardService.js`: dashboard aggregation + AI health-data preparation
- `server/services/aiService.js`: dashboard summary generation via Gemini
- `server/services/reportAiService.js`: report image summary generation
- `server/services/prescriptionAiService.js`: prescription image summary generation
- `server/services/pdfService.js`: PDF assembly for export

### Utility logic

- `server/utils/healthCalculations.js`: BMI and category logic
- `server/utils/lifestyleScoring.js`: lifestyle score calculation

## 5. Ownership and data invariants

The repository consistently follows this invariant:

- user-owned data is stored with a `user` field
- server-side route logic filters by `user: req.userId`
- the client is trusted for presentation only, not for enforcement

Examples:

- `Profile.findOne({ user: req.userId })`
- `Medicine.find({ user: req.userId })`
- `Doctor.findOneAndUpdate({ _id: id, user: req.userId }, ...)`
- `LifestyleAssessment.find({ user: req.userId })`

## 6. External integrations

### Cloudinary

Image uploads are performed from the browser flow, and the resulting `imageUrl` is stored in MongoDB. There is no server-managed upload endpoint in the checked-in code.

### Google Gemini

Gemini is used by backend services for AI summaries of dashboard health data and document images.

### `node-cron`

`node-cron` is listed in `server/package.json`, but no active scheduled reminder job is wired into `server/server.js` or app runtime flow in the current repo.

## 7. Architectural risks and constraints

- A lot of mutation logic is feature-local rather than centralized in a shared API client layer.
- Some pages still use direct token fetching from `localStorage` instead of a common wrapper.
- The app assumes a single authenticated user per browser session and stores credentials in localStorage.
- There is no refresh token or server-side session middleware in the current code.

This architecture is intentionally simple: one SPA, one API, one MongoDB database, and user-scoped records enforced on the backend.

- `server/utils/lifestyleScoring.js`: lifestyle assessment scoring logic

### Configuration

- `server/.env` is the environment config source for the server (not in the repo listing, but used via `dotenv`)
- `client/.env` includes frontend values such as `VITE_API_URL`, Cloudinary cloud name, and upload preset

## 5. Request Lifecycle

A typical request flows like this:

React component
→ context/hook/API helper
→ HTTP request
→ Express route
→ auth middleware
→ validation/business logic
→ Mongoose model
→ MongoDB
→ response
→ frontend state update

Concrete examples:

### Auth login

- `Login.jsx` calls `fetch("/api/auth/login")`
- `auth.routes.js` checks username/email, compares password via `bcryptjs`, generates JWT
- `AuthContext.login(data)` stores `token` and `user` in `localStorage`
- `ProtectedRoute` sees `user` and allows navigation to protected pages

### Health logging

- `Health.jsx` uses `useHealthLogs()`
- Hook fetches `/api/health` and posts to `/api/health`
- `health.routes.js` validates `recordedAt` for diabetes logs and attaches `req.userId`
- `HealthLog` model creates the record in MongoDB
- `setLogs` updates the UI and charts re-render

### AI summary generation

- `Dashboard.jsx` calls `/api/ai/summary` or `/api/ai/summary/generate`
- `ai.routes.js` checks caches and user data, then calls `generateAIHealthSummary()` from `aiService.js`
- `aiService.js` builds a prompt and uses Google Gemini `generateContent()`
- Result is saved to `AIReport` for the authenticated user

### Report upload and AI summary

- `Reports.jsx` first uploads the image directly to Cloudinary from the browser.
- Then it calls `POST /api/reports` to create the DB row.
- `POST /api/reports/:id/analyze` runs `generateReportSummary`, which downloads the Cloudinary image, converts it to base64, and sends it to Gemini.
- AI summary is saved on the `Report` model.

## 6. Feature Architecture

### Authentication

Frontend:

- `Login.jsx`, `Signup.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`
  Backend:
- `server/routes/auth.routes.js`, `server/middleware/auth.js`, `server/models/User.js`
  Data:
- user document with hashed password, username, email, name
  Flow:
- client posts credentials
- server verifies with `bcrypt.compare`
- server signs JWT using `JWT_SECRET`
- frontend persists token and user in localStorage

### Medicines

Frontend:

- `Medicines.jsx`, `MedicineForm.jsx`, `MedicineList.jsx`, `MedicineContext.jsx`
  Backend:
- `server/routes/medicine.routes.js`, `server/models/Medicine.js`
  Data:
- medicine records tied to `user`
  Flow:
- create/update/delete medicines by `user: req.userId`
- image URL may be uploaded to Cloudinary before DB save

### Health

Frontend:

- `Health.jsx`, chart components, `useHealthLogs.js`
  Backend:
- `server/routes/health.routes.js`, `server/models/HealthLog.js`
  Data:
- measurement types: `bp`, `diabetes`, `weight`
  Flow:
- user enters values in forms
- health data are saved as logs
- charts read the user’s logs and render time-based trends

### Profile

Frontend:

- `Settings.jsx`, `Profile.jsx`, `components/profile/*`
  Backend:
- `server/routes/profile.routes.js`, `server/models/Profile.js`
  Data:
- one profile per user with detailed medical metadata and emergency contact
  Flow:
- profile is created or updated by user
- `User.name` can also be updated from the same route

### Doctors

Frontend:

- `Doctors.jsx`, `DoctorForm.jsx`, `DoctorCard.jsx`, `DoctorModal.jsx`, `DoctorContext.jsx`
  Backend:
- `server/routes/doctor.routes.js`, `server/models/Doctor.js`
  Data:
- multiple doctors per user; chambers are embedded within each doctor
  Flow:
- user adds doctors and chambers
- doctor list is fetched by user and rendered in the UI

### Documents (Prescriptions and Reports)

Frontend:

- `Prescriptions.jsx`, `Reports.jsx`, `PrescriptionCard.jsx`, `ReportCard.jsx`
  Backend:
- `server/routes/prescription.routes.js`, `server/routes/report.routes.js`
  Models:
- `Prescription.js`, `Report.js`
  Flow:
- browser uploads image to Cloudinary
- saved record in MongoDB with `title`, `imageUrl`, and optional `aiSummary`
- AI analysis is triggered by the backend and cached on the document record

### Lifestyle

Frontend:

- `client/src/pages/lifestyle/*`, `LifestyleContext.jsx`, `LifestyleScoreCard.jsx`, `LifestyleScoreChart.jsx`
  Backend:
- `server/routes/lifestyle.routes.js`, `server/models/LifestyleAssessment.js`, `server/utils/lifestyleScoring.js`
  Flow:
- user answers are scored on the server
- score result is stored as a lifecycle record with `categoryScores`, `totalScore`, `grade`, `feedback`, `assessedAt`
- latest and history data are read back for charting

### AI

Frontend:

- dashboard and upload summaries are surfaced in `Dashboard.jsx`, `Reports.jsx`, `Prescriptions.jsx`
  Backend:
- `server/routes/ai.routes.js`, `server/services/aiService.js`, and document-specific AI services
  Flow:
- health summary is generated from aggregated data or reused from `AIReport`
- document summaries are generated by Gemini on the uploaded image

## 7. Data Flow

Where data originates:

- user input in pages/forms
- direct browser uploads to Cloudinary for image documents
- derived data from calculations (`BMI`, `lifestyle score`, `dashboard summary`)

Where it is stored:

- MongoDB documents under `server/models`
- Cloudinary for uploaded images
- localStorage for frontend auth token + user snapshot

How it is fetched:

- contexts fetch collections on mount or when auth changes
- custom hook `useHealthLogs` fetches logs by user
- pages also make direct API calls for create/update/delete actions

How it is mutated:

- POST/PUT/DELETE requests to route handlers
- models are updated with `findOneAndUpdate`, `create`, `findOneAndDelete`

How frontend state is synchronized:

- after a successful API call, the page or context refreshes relevant data with another fetch
- some pages update local state immediately after mutation and then call fetch to sync
- some routes rely on `ProfileProvider` and `LifestyleProvider` re-fetching on auth state changes

## 8. File Upload / External Services

Actual upload flow currently implemented:

Frontend
→ Cloudinary direct upload from browser
→ Cloudinary returns `secure_url`
→ frontend sends `{ title, imageUrl }` to the backend API
→ backend saves the document metadata in MongoDB
→ backend triggers Gemini-based AI summary generation for that document image

Relevant files:

- `client/src/pages/Medicines.jsx`
- `client/src/pages/Reports.jsx`
- `client/src/pages/Prescriptions.jsx`
- `server/routes/report.routes.js`
- `server/routes/prescription.routes.js`
- `server/services/reportAiService.js`
- `server/services/prescriptionAiService.js`

Important note: the server does not act as the file upload endpoint. It does not store the image file itself; it stores the Cloudinary URL and metadata in MongoDB.

## 9. Security Architecture

Actual implemented security measures:

- Passwords are hashed with `bcryptjs` in `server/routes/auth.routes.js`
- JWTs are used for authenticated requests
- `server/middleware/auth.js` verifies the token and sets `req.userId`
- User-specific routes filter by `user: req.userId` to enforce resource ownership
- `ProtectedRoute` prevents protected pages from rendering for unauthenticated users
- Environment variables are expected for `MONGO_URI`, `JWT_SECRET`, Cloudinary values, and Gemini keys

Obvious concerns that are visible in the codebase:

- JWT is stored in `localStorage` on the client; this is not httpOnly cookie-based auth
- The app uses raw `fetch` calls with direct token strings injected into headers instead of a structured API client
- User ownership checks are present, but not every route fully validates body ownership fields; some code strips `user` from request bodies, but this pattern is not centralized
- There is no real server-side file validation beyond Cloudinary upload and client-side accept restrictions
- AI-generated medical content is being surfaced directly to the user, but the code does not implement a content moderation or clinician review layer

## 10. Architectural Invariants

These are the rules the current repo is effectively built around and should be preserved by agents:

- Every user-owned database record must be scoped to the authenticated user via `req.userId`.
- Authentication belongs to the `User` model; profile, doctor, medicine, health, and lifestyle records are secondary data attached to that user.
- The app is single-user-per-account and does not model multi-tenant or admin roles.
- Protected UI pages are enforced by `ProtectedRoute`, but server-side auth is the real authority.
- AI summaries are not the source of truth; they are derivative outputs over stored user data and uploaded documents.
- Health and profile records must not silently change unrelated features or cross-user records.
- Dashboard data is intentionally read-oriented and aggregated, rather than a general-purpose transactional system.
- API contracts must stay synchronized between frontend calls and backend route expectations.
- Feature-specific contexts are the main client-side coordination layer; a new pattern should not bypass them casually.

## 11. Architectural Improvement Opportunities

### High Priority

1. Inconsistent client-side API patterns

- Current situation: some feature state lives in contexts, while other pages call `fetch` directly and repeat token handling.
- Why it could be improved: repeated token reads, duplicated fetch logic, inconsistent error handling, harder onboarding for agents.
- Suggested direction: centralize API helpers and standardize auth header usage.
- Files/areas affected: `client/src/pages/*`, `client/src/context/*`

2. Frontend auth state is not fully validated at startup

- Current situation: `AuthContext` reads `localStorage` directly and assumes the stored user is valid.
- Why it could be improved: stale or invalid sessions are not revalidated on reload.
- Suggested direction: server-side session verification or a lightweight auth bootstrap endpoint.
- Files/areas affected: `client/src/context/AuthContext.jsx`, `server/middleware/auth.js`

3. Upload logic is duplicated across features

- Current situation: Cloudinary upload logic repeats in medicine, prescription, and report pages.
- Why it could be improved: one upload helper would reduce drift and support validation/testing.
- Files/areas affected: `client/src/pages/Medicines.jsx`, `Reports.jsx`, `Prescriptions.jsx`

4. Public lifestyle route is inconsistent with protected app design

- Current situation: `/lifestyle` is public in `App.jsx` while the rest of the app is protected.
- Why it could be improved: the route policy should be intentional and consistent with the user authentication model.
- Files/areas affected: `client/src/App.jsx`, `server/routes/lifestyle.routes.js`

### Medium Priority

1. Domain logic is split between client and server in ways that can drift

- Current situation: scoring, validation, and some business logic exist in both frontend and backend.
- Why it could be improved: a more explicit shared contract or server-owned validation layer reduces mismatch risk.
- Files/areas affected: `server/utils/*`, `client/src/components/*`, `pages/*`

2. Provider responsibilities are adjacent but not fully unified

- Current situation: contexts fetch data, but some pages also do their own fetches after mutation.
- Why it could be improved: a single data orchestration pattern would be easier to reason about and test.
- Files/areas affected: `client/src/context/*`, `client/src/pages/*`

3. Route modules could be cleaner with more explicit controller/service separation

- Current situation: route handlers currently include validation and business logic inline.
- Why it could be improved: clearer separation would help maintainability and control logic reuse.
- Files/areas affected: `server/routes/*`

### Low Priority

1. Placeholder landing page content and commented-out reminder code

- Current situation: marketing sections and reminder engine placeholders still exist.
- Why it could be improved: clearer feature completeness and reduced confusion for new contributors.
- Files/areas affected: `client/src/pages/Home.jsx`, `client/src/App.jsx`

2. Styling and UI conventions are broad but not fully centralized

- Current situation: most UI styling is Tailwind utility classes with custom classes in the CSS file.
- Why it could be improved: design-system consistency would reduce drift as the app grows.
- Files/areas affected: `client/src/index.css`, page-level class usage

3. Test coverage and project tooling are minimal for a health app

- Current situation: no visible automated tests or pipeline.
- Why it could be improved: safer changes to medical-related logic.
- Files/areas affected: repository-wide configuration and CI

## 12. Things Agents Should NOT Refactor Casually

Before making changes in these areas, inspect carefully and ask for intent if required:

- authentication and token handling
- database ownership and user-scoping
- API contracts between frontend and backend
- scoring logic for health/lifestyle calculations
- provider hierarchy and state ownership in `App.jsx`
- file upload behavior to Cloudinary and linked MongoDB metadata
- AI/OCR behavior and prompt logic
- shared styling conventions used throughout the UI

This project is already a functional MVP with real data flows. The safest changes are narrow, need-driven, and contract-aware.
