# MediSync Codebase Map

## 1. Repository layout

```text
medicine_2/
├── client/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── assets/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── profile/
│       │   ├── BMIChart.jsx
│       │   ├── BMIForm.jsx
│       │   ├── BMIResult.jsx
│       │   ├── BloodPressureChart.jsx
│       │   ├── BloodPressureForm.jsx
│       │   ├── BloodSugarChart.jsx
│       │   ├── BloodSugarForm.jsx
│       │   ├── DoctorCard.jsx
│       │   ├── DoctorChamber.jsx
│       │   ├── DoctorForm.jsx
│       │   ├── DoctorInfo.jsx
│       │   ├── DoctorModal.jsx
│       │   ├── HealthCharts.jsx
│       │   ├── HealthLogForm.jsx
│       │   ├── LifestyleScoreCard.jsx
│       │   ├── LifestyleScoreChart.jsx
│       │   ├── MedicineForm.jsx
│       │   ├── MedicineImageModal.jsx
│       │   ├── MedicineList.jsx
│       │   ├── Navbar.jsx
│       │   ├── PrescriptionCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── ReportCard.jsx
│       │   └── ScrollToTop.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── DoctorContext.jsx
│       │   ├── LifestyleContext.jsx
│       │   ├── MedicineContext.jsx
│       │   ├── PrescriptionContext.jsx
│       │   ├── ProfileContext.jsx
│       │   └── ReportContext.jsx
│       ├── data/
│       │   ├── days.json
│       │   ├── degrees.json
│       │   ├── designations.json
│       │   ├── hospitals.json
│       │   └── specialties.json
│       ├── hooks/
│       │   ├── useHealthLogs.js
│       │   └── useMedicineReminder.js
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Doctors.jsx
│       │   ├── Health.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Medicines.jsx
│       │   ├── Prescriptions.jsx
│       │   ├── Profile.jsx
│       │   ├── Reports.jsx
│       │   ├── Settings.jsx
│       │   ├── Signup.jsx
│       │   ├── TestPage.jsx
│       │   ├── TestReminderPage.jsx
│       │   └── lifestyle/
│       └── utils/
│           └── timeMap.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CODEBASE_MAP.md
│   ├── DATA_API_REFERENCE.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── PROJECT_CONTEXT.md
├── server/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── AIReport.js
│   │   ├── Doctor.js
│   │   ├── HealthLog.js
│   │   ├── LifestyleAssessment.js
│   │   ├── Medicine.js
│   │   ├── Prescription.js
│   │   ├── Profile.js
│   │   ├── Report.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── doctor.routes.js
│   │   ├── export.routes.js
│   │   ├── health.routes.js
│   │   ├── lifestyle.routes.js
│   │   ├── medicine.routes.js
│   │   ├── prescription.routes.js
│   │   ├── profile.routes.js
│   │   └── report.routes.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── dashboardService.js
│   │   ├── pdfService.js
│   │   ├── prescriptionAiService.js
│   │   └── reportAiService.js
│   └── utils/
│       ├── healthCalculations.js
│       └── lifestyleScoring.js
└── .git/
```

## 2. Most important files to inspect

### Auth and app gate

- `client/src/App.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/components/ProtectedRoute.jsx`
- `server/middleware/auth.js`
- `server/routes/auth.routes.js`
- `server/models/User.js`

### Health feature

- `client/src/pages/Health.jsx`
- `client/src/hooks/useHealthLogs.js`
- `client/src/components/BMIForm.jsx`
- `client/src/components/BloodPressureChart.jsx`
- `client/src/components/BloodSugarChart.jsx`
- `server/routes/health.routes.js`
- `server/models/HealthLog.js`
- `server/utils/healthCalculations.js`

### Medicine feature

- `client/src/pages/Medicines.jsx`
- `client/src/context/MedicineContext.jsx`
- `client/src/components/MedicineForm.jsx`
- `client/src/components/MedicineList.jsx`
- `server/routes/medicine.routes.js`
- `server/models/Medicine.js`

### Profile feature

- `client/src/pages/Profile.jsx`
- `client/src/pages/Settings.jsx`
- `client/src/context/ProfileContext.jsx`
- `server/routes/profile.routes.js`
- `server/models/Profile.js`

### Lifestyle feature

- `client/src/pages/lifestyle/`
- `client/src/context/LifestyleContext.jsx`
- `server/routes/lifestyle.routes.js`
- `server/models/LifestyleAssessment.js`
- `server/utils/lifestyleScoring.js`

### Doctors

- `client/src/pages/Doctors.jsx`
- `client/src/context/DoctorContext.jsx`
- `server/routes/doctor.routes.js`
- `server/models/Doctor.js`

### Document image features

- `client/src/pages/Reports.jsx`
- `client/src/pages/Prescriptions.jsx`
- `server/routes/report.routes.js`
- `server/routes/prescription.routes.js`
- `server/services/reportAiService.js`
- `server/services/prescriptionAiService.js`

### Dashboard and AI summary

- `client/src/pages/Dashboard.jsx`
- `server/routes/dashboard.routes.js`
- `server/routes/ai.routes.js`
- `server/services/dashboardService.js`
- `server/services/aiService.js`
- `server/models/AIReport.js`
- `server/routes/export.routes.js`
- `server/services/pdfService.js`

## 3. Responsibility boundaries

### Frontend responsibilities

- render pages, forms, and charts
- call API routes with JWT bearer tokens
- hold UI state and feature-level shared state in contexts

### Backend responsibilities

- validate auth and ownership
- enforce `user: req.userId` filters
- compute business rules and AI summaries
- persist models in MongoDB
- generate PDF exports

### Shared invariants

- token auth is JWT-based
- protected routes require `Authorization: Bearer <token>`
- user-owned collections are keyed by a `user` field
- response shape changes must be checked across the route, model, and frontend consumer

## 4. Where a change usually starts

If a future agent asks, “which files should I inspect before changing feature X?” the correct starting points are:

1. route file in `server/routes/`
2. model file in `server/models/`
3. page file in `client/src/pages/`
4. context/provider in `client/src/context/`
5. any service or utility that computes the business logic

The app is organized around feature-local contracts, not a global service layer.

- Protects all authenticated flows and page access.

### `server/server.js`

- Global app bootstrap, route mounting, and DB connection.
- A change here affects the whole backend runtime.

### `server/middleware/auth.js`

- Guards all authenticated API routes.
- Critical for user validation and permission handling.

### `server/utils/healthCalculations.js`

- Shared calculation logic used by health and dashboard areas.
- Affects BMI summary logic and potentially dashboard data.

### `server/utils/lifestyleScoring.js`

- Shared calculation logic for lifestyle assessment scoring.
- Important for logic consistency across assessment pages and history.

## 7. Dependency / Responsibility Notes

Page → Context → API → Route → Model

Examples:

- `client/src/pages/Doctors.jsx` → `DoctorContext.jsx` → `GET /api/doctors` → `server/routes/doctor.routes.js` → `server/models/Doctor.js`
- `client/src/pages/Health.jsx` → `useHealthLogs.js` → `GET/POST /api/health` → `server/routes/health.routes.js` → `server/models/HealthLog.js`
- `client/src/pages/Medicines.jsx` → `MedicineContext.jsx` / direct fetch → `GET/POST/PUT/DELETE /api/medicines` → `server/routes/medicine.routes.js` → `server/models/Medicine.js`
- `client/src/pages/Dashboard.jsx` → `LifestyleContext.jsx` + direct fetches → `/api/dashboard`, `/api/ai/summary`, `/api/export/health-report` → `server/routes/*` → `server/models/*` / `server/services/*`
- `client/src/pages/Reports.jsx` → direct Cloudinary upload + API call → `POST /api/reports`, `POST /api/reports/:id/analyze` → `server/models/Report.js` → `server/services/reportAiService.js`

## 8. Refactoring Hotspots

- Repeated direct `fetch` + token code across pages and contexts.
- `client/src/pages/Medicines.jsx`, `Reports.jsx`, and `Prescriptions.jsx` each contain image upload logic with similar patterns.
- Context fetch behavior is similar across `DoctorContext.jsx`, `MedicineContext.jsx`, `PrescriptionContext.jsx`, and `ReportContext.jsx`.
- Some route logic is business-logic-heavy and could be moved into service/controller patterns later.
- The app mixes business logic in route handlers and some UI call sites rather than using one consistent API layer.
- The `Home.jsx` page retains placeholder content and is not yet a fully representative app page.
- UI styling is broadly spread through utility classes and custom classes rather than a component library.

## 9. Agent File-Inspection Strategy

Before changing a feature, inspect in this order:

1. the page file that renders it
2. its related components
3. the owning context or hook
4. the backend route handling it
5. the model schema that stores it
6. any shared utility or service used by the feature

Examples:

- Feature edits in the frontend usually require inspecting the page, component tree, and context.
- Feature edits in the API usually require inspecting the route, model, and service utilities as well.
- Health calculation changes should inspect both `server/utils/healthCalculations.js` and the chart/form components that display those derived values.
- AI changes should inspect the relevant route, service, and model storage location before editing prompt behavior or caching.
- Auth changes should inspect both client and server auth files together; do not patch one side only.

Key rule: if the feature is user-owned data, inspect the route and model before changing any client-side behavior.
