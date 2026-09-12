# MediSync Project Context

## 1. Scope

MediSync is a single-user personal health dashboard built as a React frontend and Express API backed by MongoDB. The app stores health records, medicines, doctors, lifestyle assessments, medical images, and AI-generated summaries per authenticated user.

This repository is not a multi-tenant system and does not define role-based access beyond a single `User` account type.

## 2. Actual stack

### Frontend

- React 19 in `client/`
- Vite in `client/package.json`
- `react-router-dom` for routing
- `chart.js` + `react-chartjs-2` for charts
- Tailwind CSS v4 via `@tailwindcss/vite` and `client/src/index.css`
- `lucide-react` and `react-icons`

### Backend

- Node.js + Express in `server/`
- Mongoose + MongoDB
- JWT auth with `jsonwebtoken`
- bcrypt password hashing
- PDF generation via `pdfkit`
- Google Gemini via `@google/genai`

### Database models

- `server/models/User.js`
- `server/models/Profile.js`
- `server/models/Medicine.js`
- `server/models/HealthLog.js`
- `server/models/Doctor.js`
- `server/models/Prescription.js`
- `server/models/Report.js`
- `server/models/LifestyleAssessment.js`
- `server/models/AIReport.js`

## 3. Primary features implemented

### Auth and account

- `client/src/pages/Login.jsx`, `Signup.jsx`
- `client/src/context/AuthContext.jsx`
- `server/routes/auth.routes.js`
- `server/middleware/auth.js`

Behavior:

- signup creates a `User`
- login accepts `identifier` as either email or username
- JWT is signed as `{ id: user._id }`
- token is stored in `localStorage` by the client

### Profile and settings

- `client/src/pages/Profile.jsx`, `Settings.jsx`
- `client/src/context/ProfileContext.jsx`
- `server/routes/profile.routes.js`
- `server/models/Profile.js`

Behavior:

- one profile per authenticated user
- `User.name` is updated separately from profile fields
- profile is fetched as `{ user, profile }`

### Health tracking

- `client/src/pages/Health.jsx`
- `client/src/hooks/useHealthLogs.js`
- `server/routes/health.routes.js`
- `server/models/HealthLog.js`

Behavior:

- supported log types are `bp`, `diabetes`, and `weight`
- entries are scoped by `user: req.userId`

### Medicines

- `client/src/pages/Medicines.jsx`
- `client/src/context/MedicineContext.jsx`
- `server/routes/medicine.routes.js`
- `server/models/Medicine.js`

Behavior:

- `dosageTimes` is an array of `morning`, `noon`, `night`
- `startDate` is required; `endDate` is required only when `isActive` is false
- medicines are queried by `user: req.userId`

### Doctors

- `client/src/pages/Doctors.jsx`
- `client/src/context/DoctorContext.jsx`
- `server/routes/doctor.routes.js`
- `server/models/Doctor.js`

Behavior:

- doctor records are user-owned and include `degrees`, `specialities`, `chambers`, `contactInfo`

### Prescriptions and reports

- `client/src/pages/Prescriptions.jsx`, `Reports.jsx`
- `client/src/context/PrescriptionContext.jsx`, `ReportContext.jsx`
- `server/routes/prescription.routes.js`, `report.routes.js`
- `server/models/Prescription.js`, `Report.js`

Behavior:

- records include `title` and `imageUrl`
- AI summary is optional and stored on the model as `aiSummary`
- Gemini is used for summary generation only when the image is present

### Lifestyle score

- `client/src/pages/lifestyle/`
- `client/src/context/LifestyleContext.jsx`
- `server/routes/lifestyle.routes.js`
- `server/models/LifestyleAssessment.js`
- `server/utils/lifestyleScoring.js`

Behavior:

- the app saves a user assessment and keeps the newest 10 entries
- the server computes `categoryScores`, `totalScore`, `grade`, and `feedback`

### Dashboard and AI summary

- `client/src/pages/Dashboard.jsx`
- `server/routes/dashboard.routes.js`
- `server/routes/ai.routes.js`
- `server/services/dashboardService.js`
- `server/services/aiService.js`
- `server/models/AIReport.js`

Behavior:

- summary is cached per `user`
- `GET /api/ai/summary` returns cached data when fresh; otherwise it generates a new one
- `GET /api/export/health-report` creates a PDF for the authenticated user

## 4. Route shape

### Public UI routes

- `/`
- `/login`
- `/signup`
- `/lifestyle`

### Protected UI routes

- `/dashboard`
- `/medicines`
- `/health`
- `/prescriptions`
- `/reports`
- `/doctors`
- `/profile`
- `/settings`

### API prefixes

- `/api/auth`
- `/api/medicines`
- `/api/health`
- `/api/profile`
- `/api/prescriptions`
- `/api/doctors`
- `/api/reports`
- `/api/lifestyle`
- `/api/dashboard`
- `/api/ai`
- `/api/export`

## 5. Ownership model

The core invariant is: every user-owned record is filtered by `user: req.userId` in server routes.

Actual examples:

- `Profile.findOne({ user: req.userId })`
- `Medicine.find({ user: req.userId })`
- `Doctor.findOneAndUpdate({ _id: id, user: req.userId }, ...)`
- `LifestyleAssessment.find({ user: req.userId })`

This is the primary backend safety boundary; client-side checks are not sufficient for enforcement.

## 6. Important repo realities

- `client/src/App.jsx` wraps route pages with `AuthProvider`, `LifestyleProvider`, `ProfileProvider`, `MedicineProvider`, `PrescriptionProvider`, `ReportProvider`, and `DoctorProvider`.
- `ProtectedRoute` blocks access when `user` is absent.
- `node-cron` is in `server/package.json`, but the codebase does not currently wire a scheduled reminder service into the app flow.
- `client/src/pages/Home.jsx` still contains placeholder-style marketing sections; the reminder engine is commented out in `App.jsx`.
- No checked-in test suite or CI pipeline is present in the repository snapshot reviewed.

## 7. Safe-change rule

Before changing a feature, inspect the route, model, and client consumer together. This repository keeps the contract aligned across those layers and breaks when one side changes without the others.

- Preserve current behavior unless the requested change specifically requires a contract update.
- Reuse existing contexts, hooks, and utilities instead of creating parallel logic.
- Do not duplicate business logic across frontend and backend.
- Do not add dependencies without a clear reason and without checking whether an existing pattern already covers the need.
- Verify both frontend and backend contracts before changing API request shapes or model schemas.
- Preserve user ownership rules: all user-specific records must remain tied to `req.userId`.

## 9. Known Current Limitations

- The repository does not include a formal architecture doc or developer guide yet.
- Landing page has visible placeholders and “future” UI sketches.
- The reminder feature is commented out; no active medication reminder engine is currently wired.
- Some pages and contexts fetch tokens directly from `localStorage` rather than using a shared API utility.
- Lifestyle assessment route is public (`/lifestyle`), while the rest of the app is protected; that is a real route-level inconsistency in the current app.
- The app depends on valid environment variables for Cloudinary and Gemini; without them, media uploads and AI summaries will fail.
- No automated tests or lint enforcement is configured beyond the client ESLint setup.
- AI generation is rate-limited and may fail when API limits are reached or the `GEMINI_API_KEY` is missing.

## 10. Where To Start

Recommended reading order for future LLM agents or developers:

1. This file: `docs/PROJECT_CONTEXT.md`
2. `client/src/App.jsx` and `server/server.js` for app bootstrap and route registration
3. `client/src/context/` and `server/models/` for the app’s shared state/data model map
4. `server/routes/` and `server/services/` for API and business logic contracts
5. `client/package.json` and `server/package.json` for dependency and toolchain references

If a formal architecture doc or development guide is added later, it should sit next to this file and be read after this project context.

## Documentation Maintenance

Update this file when:

- a major feature is added or removed
- new routes, models, or auth flows are introduced
- data ownership changes or new user-specific entities appear
- AI or media integrations change materially
- the project moves from MVP/prototype to a more production-oriented stage

This document should track the actual repository state, not aspirational architecture. If the app changes, this file should be revised to match the current codebase exactly.
