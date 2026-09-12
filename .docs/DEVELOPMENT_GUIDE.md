# MediSync Development Guide

## 1. Repository-specific rules

This repository is intentionally simple and pattern-driven. The safe change rule is: inspect the route, the model, and the client consumer together before editing anything.

The most important invariants are:

- JWT auth is required for user-owned data
- every user-owned record is filtered by `user: req.userId`
- the frontend reads and writes JSON through `fetch()` against the Express API
- `client/src/App.jsx` is the main routing and provider composition file
- styling is mainly handled through Tailwind utilities plus shared classes in `client/src/index.css`

## 2. Frontend conventions

### Files and responsibilities

- `client/src/pages/` contains route-level screens
- `client/src/components/` contains reusable UI blocks
- `client/src/context/` contains feature state and fetch logic
- `client/src/hooks/` contains custom hooks for data access or state orchestration

### Auth and state

- `AuthContext` is the source of auth state
- `localStorage` stores `token` and `user`
- `ProtectedRoute` gates access to authenticated pages

### Data access pattern

Most features follow this pattern:

- fetch from an API route in a context or hook
- attach `Authorization: Bearer <token>`
- parse JSON
- check `response.ok` before trusting the payload

### Styling pattern

- use the shared design classes already defined in `client/src/index.css`
- prefer `.card`, `.page-title`, `.section-title`, `.btn-primary`, `.stat-card`, and related classes over ad hoc CSS
- keep the layout consistent with the existing medical dashboard aesthetic

## 3. Backend conventions

### Auth and route rules

- `server/middleware/auth.js` is the expected auth gate
- protected routes should call it before reading or mutating user-owned data
- the server uses `req.userId` after JWT verification

### Query shape

Routes usually follow the same pattern:

- `find({ user: req.userId })` for list queries
- `findOne({ _id: id, user: req.userId })` for targeted reads
- `findOneAndUpdate({ _id: id, user: req.userId }, ...)` for updates
- `findOneAndDelete({ _id: id, user: req.userId })` for deletes

### Validation pattern

Validation in this repo is mostly route-level and model-level, not framework-enforced globally.
Examples:

- medicine date validation in `server/routes/medicine.routes.js`
- password checks in `server/routes/auth.routes.js`
- enum constraints in the Mongoose schema files

## 4. Important repository-specific invariants

Do not casually change these without checking the dependent files:

### Auth

- JWT payload is `{ id: user._id }`
- bearer token must remain `Authorization: Bearer <token>`
- `req.userId` is the server-side access boundary

### Models and enums

- `HealthLog.type` is `bp`, `diabetes`, or `weight`
- `Medicine.dosageTimes` is `morning`, `noon`, or `night`
- `LifestyleAssessment.grade` is one of `A+`, `A`, `A-`, `B`, `C`
- `Profile` enum fields must remain consistent with the frontend control values

### Document upload contract

- uploaded images are stored as `imageUrl`
- `Prescription` and `Report` records are user-owned and optionally include `aiSummary`

### Dashboard/AI summary contract

- `AIReport` is cached per user
- `GET /api/ai/summary` may return `cached: true` or `false`
- the route checks for existing summary freshness before generating a new one

## 5. Change workflow for this repo

When changing a feature, follow this order:

1. inspect the route in `server/routes/`
2. inspect the model in `server/models/`
3. inspect the page in `client/src/pages/`
4. inspect the provider or hook in `client/src/context/` or `client/src/hooks/`
5. inspect any service or utility used for the feature

This is the shortest route to the actual contract.

## 6. Safe patterns for edits

### Frontend edits

- prefer extending the same provider or hook instead of creating a parallel data layer
- keep page and component logic consistent with the current route patterns
- do not rewrite the styling system for a small UI change

### Backend edits

- keep user ownership checks intact
- preserve response keys and enum names unless all callers are updated
- prefer minimal route changes over large refactors

### Data model edits

- do not add or rename fields without checking route and client usage
- keep new fields optional when backward compatibility matters
- treat model changes as feature-wide contract changes

## 7. Files to inspect before touching common features

### Auth

- `client/src/App.jsx`
- `client/src/context/AuthContext.jsx`
- `server/routes/auth.routes.js`
- `server/middleware/auth.js`
- `server/models/User.js`

### Medicines

- `client/src/pages/Medicines.jsx`
- `client/src/context/MedicineContext.jsx`
- `server/routes/medicine.routes.js`
- `server/models/Medicine.js`

### Health logs

- `client/src/pages/Health.jsx`
- `client/src/hooks/useHealthLogs.js`
- `server/routes/health.routes.js`
- `server/models/HealthLog.js`

### Profile

- `client/src/pages/Profile.jsx`
- `client/src/pages/Settings.jsx`
- `client/src/context/ProfileContext.jsx`
- `server/routes/profile.routes.js`
- `server/models/Profile.js`

### Lifestyle

- `client/src/pages/lifestyle/`
- `client/src/context/LifestyleContext.jsx`
- `server/routes/lifestyle.routes.js`
- `server/models/LifestyleAssessment.js`
- `server/utils/lifestyleScoring.js`

### Dashboard and AI summary

- `client/src/pages/Dashboard.jsx`
- `server/routes/dashboard.routes.js`
- `server/routes/ai.routes.js`
- `server/services/dashboardService.js`
- `server/services/aiService.js`
- `server/models/AIReport.js`

## 8. Practical rule

If a change affects data shape, auth, or user ownership, treat it as a contract change and review every consumer before merging. This app keeps its business contracts spread across a small number of files; the route, model, and UI are not independent layers.

- context: inspect the provider that owns fetch/update logic
- page: see how the feature is rendered and what user actions trigger calls
- child components: verify form or chart behavior that depends on the data
- charts: ensure chart labels, series names, and data mapping still match the backend contract
- shared utilities: check for scoring, formatting, or data transformation rules that may be reused elsewhere

When a data contract is changed, inspect all dependency points together rather than altering one side in isolation.

## 8. Data / Health Logic Rules

The following rules are confirmed by the project and should be preserved:

- health data belongs to the authenticated user and is scoped by `user: req.userId`
- calculations that can be derived should be centralized instead of duplicated in multiple places
- shared scoring and domain calculation logic should live in utilities, not inline across components
- avoid storing data redundantly when the app can recompute it reliably from source records
- keep date formats consistent; for example, health logs use a `YYYY-MM-DD` date string in the `recordedAt` field
- document uploads should continue to use Cloudinary `secure_url` values stored in MongoDB as `imageUrl`
- preserve the app’s ownership model for medicines, doctors, health logs, reports, prescriptions, and lifestyle assessments
- keep API and model field names aligned across backend and frontend consumers

## 9. UI/UX Principles

MediSync follows a visual direction that is:

- modern
- minimal
- professional
- medical
- clean
- responsive
- grounded in sky/blue, slate, and white tones
- built around subtle borders and restrained shadows
- organized through reusable cards and section-based layouts
- intentionally uncluttered and usable on health-monitoring workflows

The app should not feel decorative or overloaded. The emphasis should be clarity, trust, and actionable information.

## 10. Refactoring Guidelines

### Good Refactoring

- removing duplicated business logic
- extracting reusable utilities from repeated code
- reducing repeated API calls or redundant fetch patterns
- separating feature responsibilities into clearer modules
- consolidating repeated UI patterns without altering the user experience

### Avoid

- large rewrites for a small feature request
- changing APIs or response contracts without checking every consumer
- changing working scoring logic without verifying the domain rules
- moving many files around without a concrete benefit
- introducing abstractions that solve no current problem

Refactor only when it improves maintainability or reduces duplication without changing behavior.

## 11. LLM / Agent Rules

When working on this repository, agents should:

- read the relevant documentation and source files before editing
- inspect existing implementations instead of assuming the architecture
- search for all consumers before changing shared code or response shapes
- preserve existing API contracts unless the work explicitly requires a protocol change
- ask for missing files or clarification when a required contract is unclear
- keep each change small and focused
- explain why architectural changes are needed before making them
- do not silently change business logic or scoring rules
- mention unrelated issues or risks that are noticed during review instead of making unrelated fixes
- prefer existing patterns over introducing new abstraction layers or dependencies

## 12. Verification Checklist

Before calling a change complete, verify the following:

- frontend compiles
- backend starts successfully
- lint passes where configured
- API contract remains valid
- authentication still works
- user ownership remains enforced
- existing feature behavior is preserved
- responsive UI remains usable
- no unrelated files were changed
- the change matches the repository’s established patterns

This guide reflects the current repository conventions and is intentionally conservative: it favors the patterns already in use over speculative or generalized best practices.
