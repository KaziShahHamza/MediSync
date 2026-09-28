# MediSync Codebase Audit

Audit date: 2026-09-27

Scope: static review of the client and server source, import resolution, route/API declarations, dependency manifests, and available client checks. No application source files were modified; this report is the only added file.


## High

### React lint errors indicate unstable component and state patterns

- [client/src/components/doctor/DoctorModal.jsx](../client/src/components/doctor/DoctorModal.jsx#L43) declares `Section` inside the render function. ESLint reports `react-hooks/static-components`; the component identity is recreated on every render and can reset descendant state.
- [client/src/components/dashboard/DashboardSummary.jsx](../client/src/components/dashboard/DashboardSummary.jsx#L52), [client/src/components/medicine/modal/MedicineImageModal.jsx](../client/src/components/medicine/modal/MedicineImageModal.jsx#L22), [client/src/hooks/medicine-form/useMedicineForm.js](../client/src/hooks/medicine-form/useMedicineForm.js#L84), and [client/src/hooks/useHealthLogs.js](../client/src/hooks/useHealthLogs.js#L68) synchronously call state setters from effects. ESLint reports `react-hooks/set-state-in-effect`; these patterns can cause cascading renders and, depending on dependencies, repeated work.
- These are currently lint failures, not all proven production crashes, but they should be corrected before treating the client as React-19 clean.

### The client lint gate fails with 22 errors

`npm run lint` exits non-zero. In addition to the React errors above:

- Unused bindings: [BloodRequestModal.jsx](../client/src/components/blood/blood-request/BloodRequestModal.jsx#L23) (`managementToken`), [DashboardHealthOverview.jsx](../client/src/components/dashboard/DashboardHealthOverview.jsx#L47) (`Icon`), [DashboardQuickActions.jsx](../client/src/components/dashboard/DashboardQuickActions.jsx#L68) (`Icon`), [DashboardRecords.jsx](../client/src/components/dashboard/DashboardRecords.jsx#L43) (`Icon`), [DoctorForm.jsx](../client/src/components/doctor/DoctorForm.jsx#L32) (`updateContact`), [NavbarDesktop.jsx](../client/src/components/navbar/NavbarDesktop.jsx#L54) (`Icon`), [NavbarMobile.jsx](../client/src/components/navbar/NavbarMobile.jsx#L40) (`Icon`), and [BloodNeed.jsx](../client/src/pages/z.test-pages/BloodNeed.jsx#L774) (`matchingHospital`).
- Fast Refresh violations: [AuthContext.jsx](../client/src/context/AuthContext.jsx#L51), [ChatbotContext.jsx](../client/src/context/ChatbotContext.jsx#L250), [DoctorContext.jsx](../client/src/context/DoctorContext.jsx#L68), [LifestyleContext.jsx](../client/src/context/LifestyleContext.jsx#L217), [PrescriptionContext.jsx](../client/src/context/PrescriptionContext.jsx#L78), [ProfileContext.jsx](../client/src/context/ProfileContext.jsx#L92), and [ReportContext.jsx](../client/src/context/ReportContext.jsx#L78) export non-component hooks/functions alongside providers. This degrades Fast Refresh behavior during development.

## Medium

### Blood donor query logic is duplicated in three services

- Live controller [bloodRequestManagementController.js](../server/controllers/blood/bloodRequestManagementController.js#L19) imports `findDonors` from [bloodDonorService.js](../server/services/blood/bloodDonorService.js#L9).
- Equivalent `findDonors` implementations also exist in [bloodRequestManagementService.js](../server/services/blood/bloodRequestManagementService.js#L13) and [bloodRequestService.js](../server/services/blood/bloodRequestService.js#L28), but are not used by the live controller according to the import search.
- Impact: donor filtering and returned-field behavior can diverge silently when one copy is changed. Remove the dead copies or establish one service as the owner.

### Legacy test route contains a full duplicate blood API implementation

- [server/routes/test-pages/blood.routes copy.js](../server/routes/test-pages/blood.routes%20copy.js#L1) contains another complete donor/request CRUD route implementation.
- It is not registered by [server/server.js](../server/server.js#L21-L52), but it remains easy to import accidentally and has a filename containing spaces. Treat it as test-only explicitly or remove/archive it to avoid maintaining two behaviors.

### API documentation is incomplete for profile photos

- The client calls `PUT /api/profile/photo` and `DELETE /api/profile/photo` from [useProfilePhoto.js](../client/src/hooks/settings/useProfilePhoto.js#L66), while [profile.routes.js](../server/routes/profile.routes.js#L29) and `#L32` provide those endpoints.
- The API reference [DATA_API_REFERENCE.md](DATA_API_REFERENCE.md#L80) documents profile CRUD but omits both photo routes. This is a documentation/contract drift risk rather than a currently broken endpoint.

## Low

### Unused/dead code reduces signal in the codebase

- The unused variables listed under the lint findings are confirmed by ESLint and should be removed or wired into the UI.
- The `z.test-*` pages/components and the copied blood route are present in normal source trees. They increase the chance of stale logic being mistaken for production behavior and should be isolated through explicit test tooling or excluded from production-oriented audits.

## Checks performed

- `client`: `npm run build` failed on the emergency-card import above.
- `client`: `npm run lint` failed with 22 errors.
- `server`: `node --check` passed for application JavaScript when `node_modules` was excluded.
- Relative-import resolution found exactly one client miss and two server misses, all documented above.
- `npm ls --depth=0` passed for both client and server; declared dependencies are installed.
- Both `client/package-lock.json` and `server/package-lock.json` are present.

## No confirmed issues found

- The documented core API route prefixes and the client calls checked match for dashboard, AI summary, export, auth, profile, health, medicine, doctor, lifestyle, blood, prescription, and report operations.
- No missing third-party dependency was found in the package manifests during this audit.