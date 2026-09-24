# MediSync Codebase Map

## 1. Repository layout

```text
medicine_2/
├── .gitignore
├── .docs/
│   ├── ARCHITECTURE.md
│   ├── CODEBASE_MAP.md
│   ├── DATA_API_REFERENCE.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── PROJECT_CONTEXT.md
├── client/
│   ├── assets/ (health_report.png, icon.png, icon_2.png, icon_3.png, logo.png)
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/fonts/ (NotoSansBengali-Bold.ttf, NotoSansBengali-Regular.ttf)
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── ai-assistant/ (AssistantSidebar, ChatEmptyState, ChatInput, ChatMessage)
│       │   ├── blood/ (BloodRequestForm, BloodRequestItem, BloodRequestList, BloodRequestModal, BloodSearchForm, DonorResultItem, DonorResults, ManagementTokenNotice)
│       │   ├── dashboard/ (HealthSummaryCard, QuickLinkCard, StatCard)
│       │   ├── doctor/ (DoctorCard, DoctorForm, DoctorFormFields, DoctorFormSection, DoctorInfo, DoctorModal)
│       │   ├── health/ (BMIResult, LifestyleScoreCard)
│       │   ├── lifestyle/ (AssessmentResults, lifestyleQuestions, lifestyleScoring, QuestionnaireSection, ScoreHeader)
│       │   ├── medicine/ (MedicineBasicInfo, MedicineCard, MedicineImageViewer, MedicineList, MedicineMonthlyCost, MedicinePricing, MedicineTreatment)
│       │   ├── navbar/ (Navbar, ProtectedRoute, ScrollToTop)
│       │   ├── profile/ (EmergencyCardExport, ProfileInput, ProfileSection, ProfileSelect, ProfileSummary)
│       │   ├── AuthLayout.jsx
│       │   ├── PrescriptionCard.jsx
│       │   ├── ReportCard.jsx
│       │   └── z.test-components/ (HealthCharts, HealthLogForm)
│       ├── context/ (AuthContext, ChatbotContext, DoctorContext, LifestyleContext, MedicineContext, PrescriptionContext, ProfileContext, ReportContext)
│       ├── data/
│       │   ├── doctor/ (doctorData, primaryHospitals)
│       │   ├── medicine/ (dosageOptions, medicineMonths, medicineTypes)
│       │   ├── z.test-data/ (districtsData_2)
│       │   ├── districtsData.js
│       │   └── hospitalsData.js
│       ├── hooks/ (useBloodRequests, useBloodSearch, useHealthLogs, useMedicineReminder, useMedicines)
│       │   └── doctor/useDoctorForm.js
│       ├── pages/ (Assistant, BloodNeed, BloodRequest, BloodSearch, Dashboard, Doctors, Health, Home, LifestyleScore, Login, Medicines, Prescriptions, Profile, Reports, Settings, Signup)
│       │   └── z.test-pages/ (TestPage, TestReminderPage)
│       └── utils/
│           ├── blood/ (bloodConstants, bloodRequestHelpers, bloodRequestStorage)
│           ├── doctor/ (doctorFormUtils, doctorFunctions)
│           ├── emergencyCard/ (emergencyCardData, emergencyCardPdf, emergencyCardTemplates)
│           ├── medicine/ (medicineCalculations, medicineHelpers, medicineValidation)
│           ├── emergencyWhatsApp.js
│           └── timeMap.js
└── server/
    ├── fonts/ (NotoSansBengali-Bold.ttf, NotoSansBengali-Regular.ttf)
    ├── middleware/auth.js
    ├── models/ (AIChat, AIChatData, AIReport, BloodRequest, BloodRequestRateLimit, Doctor, EmergencyAlert, HealthLog, LifestyleAssessment, Medicine, Prescription, Profile, Report, User)
    ├── package-lock.json
    ├── package.json
    ├── routes/ (ai, auth, blood, dashboard, doctor, export, health, lifestyle, medicine, prescription, profile, report)
    ├── server.js
    ├── services/ (aiChatDataService, aiChatService, aiService, dashboardService, emergencyEmailService, emergencyService, healthSummaryService, pdfService, prescriptionAiService, reportAiService)
    └── utils/ (healthCalculations, lifestyleScoring)
```

## 2. Most important files to inspect

### Auth and app gate

- `client/src/App.jsx`
- `client/src/context/AuthContext.jsx`
- `client/src/components/navbar/ProtectedRoute.jsx`
- `server/middlewares/auth.js`
- `server/routes/auth.routes.js`
- `server/models/User.js`

### Health feature

- `client/src/pages/Health.jsx`
- `client/src/hooks/useHealthLogs.js`
- `client/src/components/health/BMIResult.jsx`
- `server/routes/health.routes.js`
- `server/models/HealthLog.js`
- `server/utils/healthCalculations.js`

### Medicine feature

- `client/src/pages/Medicines.jsx`
- `client/src/context/MedicineContext.jsx`
- `client/src/components/medicine/MedicineCard.jsx`
- `client/src/components/medicine/MedicineList.jsx`
- `server/routes/medicine.routes.js`
- `server/models/Medicine.js`

### Profile feature

- `client/src/pages/Profile.jsx`
- `client/src/pages/Settings.jsx`
- `client/src/context/ProfileContext.jsx`
- `server/routes/profile.routes.js`
- `server/models/Profile.js`

### Lifestyle feature

- `client/src/pages/LifestyleScore.jsx`
- `client/src/components/lifestyle/`
- `client/src/context/LifestyleContext.jsx`
- `server/routes/lifestyle.routes.js`
- `server/models/LifestyleAssessment.js`
- `server/utils/lifestyleScoring.js`

### Blood feature

- `client/src/pages/BloodNeed.jsx`
- `client/src/pages/BloodRequest.jsx`
- `client/src/pages/BloodSearch.jsx`
- `client/src/hooks/useBloodRequests.js`
- `client/src/hooks/useBloodSearch.js`
- `server/routes/blood.routes.js`
- `server/models/BloodRequest.js`
- `server/models/BloodRequestRateLimit.js`

### Doctors

- `client/src/pages/Doctors.jsx`
- `client/src/context/DoctorContext.jsx`
- `client/src/components/doctor/`
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

### AI health assistant

- `client/src/pages/Assistant.jsx`
- `client/src/context/ChatbotContext.jsx`
- `client/src/components/ai-assistant/`
- `server/routes/ai.routes.js`
- `server/models/AIChat.js`
- `server/models/AIChatData.js`
- `server/services/aiChatService.js`
- `server/services/aiChatDataService.js`

The assistant is available at the protected `/assistant` client route. Its API is mounted at `/api/ai` and supports cached summaries plus authenticated chat history and messaging endpoints:

- `GET /api/ai/chats`
- `GET /api/ai/chats/:chatId`
- `POST /api/ai/chats`
- `POST /api/ai/chats/:chatId/messages`
- `DELETE /api/ai/chats/:chatId`

`AIChatData` stores an assistant-specific snapshot of profile, lifestyle, health, and saved doctor data. Medicines, prescriptions, reports, and medical documents are intentionally excluded from the assistant context.

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

If a future agent asks which files to inspect before changing feature X, the correct starting points are:

1. route file in `server/routes/`
2. model file in `server/models/`
3. page file in `client/src/pages/`
4. context/provider in `client/src/context/`
5. any service or utility that computes the business logic

The app is organized around feature-local contracts, not a global service layer.

## 5. Shared and high-impact modules

### `server/server.js`

- Global app bootstrap, route mounting, and DB connection.
- A change here affects the whole backend runtime.

### `server/middlewares/auth.js`

- Guards all authenticated API routes.
- Critical for user validation and permission handling.

### `server/utils/healthCalculations.js`

- Shared calculation logic used by health and dashboard areas.
- Affects BMI summary logic and potentially dashboard data.

### `server/utils/lifestyleScoring.js`

- Shared calculation logic for lifestyle assessment scoring.
- Important for logic consistency across assessment pages and history.

## 6. Dependency / Responsibility Notes

Page -> Context -> API -> Route -> Model

Examples:

- `client/src/pages/Doctors.jsx` -> `DoctorContext.jsx` -> `GET /api/doctors` -> `server/routes/doctor.routes.js` -> `server/models/Doctor.js`
- `client/src/pages/Health.jsx` -> `useHealthLogs.js` -> `GET/POST /api/health` -> `server/routes/health.routes.js` -> `server/models/HealthLog.js`
- `client/src/pages/Medicines.jsx` -> `MedicineContext.jsx` / direct fetch -> `GET/POST/PUT/DELETE /api/medicines` -> `server/routes/medicine.routes.js` -> `server/models/Medicine.js`
- `client/src/pages/Dashboard.jsx` -> `LifestyleContext.jsx` + direct fetches -> `/api/dashboard`, `/api/ai/summary`, `/api/export/health-report` -> `server/routes/*` -> `server/models/*` / `server/services/*`
- `client/src/pages/Reports.jsx` -> direct Cloudinary upload + API call -> `POST /api/reports`, `POST /api/reports/:id/analyze` -> `server/models/Report.js` -> `server/services/reportAiService.js`

## 7. Refactoring Hotspots

- Repeated direct `fetch` + token code across pages and contexts.
- `client/src/pages/Medicines.jsx`, `Reports.jsx`, and `Prescriptions.jsx` each contain image upload logic with similar patterns.
- Context fetch behavior is similar across `DoctorContext.jsx`, `MedicineContext.jsx`, `PrescriptionContext.jsx`, and `ReportContext.jsx`.
- Some route logic is business-logic-heavy and could be moved into service/controller patterns later.
- The app mixes business logic in route handlers and some UI call sites rather than using one consistent API layer.
- UI styling is broadly spread through utility classes and custom classes rather than a component library.

## 8. Agent File-Inspection Strategy

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
