# MediSync — Current Form Validation Inventory

> Generated from the current codebase.
> This document describes the existing implementation only.
> It is not an implementation plan and does not modify application behavior.

## Scope and Reading Notes

This inventory follows the current client submission code into the Express route, middleware, controller, service, Mongoose model, and MongoDB operation. A layer is marked **None** when no validation implementation was found in that layer. Browser attributes such as `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, and `accept` are recorded as browser-level validation or selection hints, not as server enforcement.

The application uses `fetch` directly from React. There is no shared client request-validation library in the inspected source. On the server, Zod is used by the shared `validate` middleware for profile requests only (including profile-photo metadata).

## Form Inventory

### 1. Signup

**Form component and frontend files**

- `client/src/pages/Signup.jsx`: controlled only by the native form element and `form.<field>.value`.
- `client/src/components/AuthLayout.jsx`: shared visual/auth layout; no validation logic.
- `client/src/context/AuthContext.jsx`: receives the successful auth result; no signup field validation.

**Current client validation:** Partial, browser-level only.

- `name`, `username`, `email`, and `password` are required by `required`.
- `email` uses `type="email"`, so the browser applies email syntax checks.
- `password` uses `minLength={8}` and the placeholder states a minimum of eight characters.
- No client maximum lengths, username syntax rules, password complexity rules, trimming, sanitization, duplicate checks, or custom validation function were found.
- The submit handler calls `preventDefault`, but it does not explicitly inspect validity or validate before constructing the request. Normal browser form validation occurs before the submit event.

**API payload**

```js
{
  name: form.name.value,
  username: form.username.value,
  email: form.email.value,
  password: form.password.value,
}
```

Sent by `POST /api/auth/signup`.

**Backend flow and validation**

```text
Signup.jsx
  -> native form values
  -> fetch /api/auth/signup
  -> auth.routes.js
  -> authController.signup
  -> validateSignupPassword
  -> authService.signupUser
  -> User.create
  -> MongoDB
```

- `server/routes/auth.routes.js`: route has no `auth` or Zod middleware.
- `server/controllers/authController.js`: `validateSignupPassword` checks only that a password exists and has length at least 8. It returns HTTP 400 with `{ message }`.
- `server/services/authService.js`: checks duplicate username and duplicate email, lowercases the lookup values, hashes the password with `bcrypt`, creates the user, and signs a JWT. Duplicate errors are thrown with status 400, but `authController.signup` catches all errors and returns HTTP 500 `{ message: "Signup failed" }`, so the thrown duplicate status is not exposed.
- `server/models/User.js`: `name` is required, trimmed, and `maxlength: 50`; `username` is required, trimmed, lowercased, and `unique`; `email` is required, trimmed, lowercased, and `unique`; `password` is required. The model has no email `match`, password length, password complexity, username length, or custom validator.
- Unexpected fields are not rejected by a route schema. The controller destructures the four expected values before calling the service, so extra request fields are not copied into `User.create`.

**Errors and security**

- Browser errors are native and are not rendered by a custom component.
- Client API errors display `data.message` in the red error block.
- Backend validation uses HTTP 400 only for the explicit password check; unexpected failures and duplicate errors are returned as HTTP 500 by the controller.
- Passwords are hashed before persistence. Duplicate username/email checks and unique indexes exist.
- Authentication is not required for signup. No signup rate limit, request schema, unexpected-field rejection, email server validation, or password complexity control was found.

**Status:** Partial. Required fields, browser email syntax, and minimum password length exist, but server validation is narrow and has inconsistent error handling.

### 2. Login

**Form component and frontend files**

- `client/src/pages/Login.jsx`: native form and direct `fetch` submission.
- `client/src/components/AuthLayout.jsx`: shared presentation.
- `client/src/context/AuthContext.jsx`: stores the successful login result.

**Current client validation:** Minimal, browser-level only.

- `identifier` and `password` have `required`.
- `identifier` is `type="text"`; it has no email-or-username syntax validation.
- No minimum length, maximum length, trimming, custom validation, or client rate-limit handling exists.

**API payload**

```js
{
  identifier: form.identifier.value,
  password: form.password.value,
}
```

Sent by `POST /api/auth/login`.

**Backend flow and validation**

```text
Login.jsx -> fetch -> auth.routes.js -> authController.login
  -> authService.loginUser -> User.findOne / bcrypt.compare -> JWT
```

- `server/routes/auth.routes.js` has no Zod middleware.
- `server/controllers/authController.js` does not validate presence, type, length, email syntax, or username syntax.
- `server/services/authService.js` decides email versus username by `identifier.includes("@")`, lowercases the lookup, returns 404 `{ message: "User not found" }` for an absent user, and 401 `{ message: "Wrong password" }` for a mismatch.
- `server/models/User.js` validates stored account fields, but those constraints are not applied to login credentials. Password comparison uses bcrypt.

**Errors and security**

- The client displays `data.message` in the form error block.
- No login rate limit, cooldown, generic credential error, or brute-force protection was found.
- The response distinguishes unknown users from wrong passwords.
- The route does not require authentication, as expected for login.

**Status:** Minimal. The native required checks and bcrypt authentication exist, but request-shape and abuse validation are absent.

### 3. Blood Request: Create/Post

**Form component and frontend files**

- `client/src/pages/BloodRequest.jsx`: page and modal wiring.
- `client/src/hooks/blood-request/useBloodRequests.js`: request state, form state, district/upazila and hospital selection, editing state, and action composition.
- `client/src/hooks/blood-request/useSubmitBloodRequest.js`: payload construction and create/update request.
- `client/src/components/blood/blood-request/BloodRequestModal.jsx`: form/modal shell.
- `client/src/components/blood/blood-request/BloodRequestForm.jsx`: composition.
- `client/src/components/blood/blood-request/BloodRequestDetails.jsx`: blood, quantity, compensation, contact, and notes inputs.
- `client/src/components/blood/blood-request/BloodRequestLocation.jsx`: district, upazila, hospital, and address inputs.
- `client/src/utils/blood/bloodRequestHelpers.js`: `EMPTY_BLOOD_REQUEST_FORM`, `BLOOD_GROUPS`, formatting helpers.
- `client/src/utils/blood/bloodRequestStorage.js`: device ID and guest management token persistence.
- `client/src/data/districtsData.js` and `client/src/data/hospitalsData.js`: select options and dependent location data.

**Current client validation:** Partial, primarily browser-level.

- Required: blood group, bags, needed-within-days, compensation, district, upazila, hospital, contact phone.
- Bags have browser `min="1"`, `max="20"`, `step="1"`.
- Contact phone has `maxLength="30"`; requester name has `maxLength="100"`; notes has `maxLength="1000"`; custom hospital name/address have `maxLength="200"` and `maxLength="500"`.
- Selects constrain values through rendered options; no custom client validator checks the selected values.
- No client phone syntax check, custom numeric check, HTML sanitization, or explicit pre-request validation exists.
- `useSubmitBloodRequest` converts bags and timeframe with `Number()` and compensation from the string `"yes"` to boolean. It includes a generated device ID and includes a guest management token when present.

**API payload**

```js
{
  bloodGroup: requestForm.bloodGroup,
  bagsNeeded: Number(requestForm.bagsNeeded),
  neededWithinDays: Number(requestForm.neededWithinDays),
  compensationOffered: requestForm.compensationOffered === "yes",
  district: requestForm.district,
  upazila: requestForm.upazila,
  hospitalName: requestForm.hospitalName,
  hospitalAddress: requestForm.hospitalAddress,
  contactPhone: requestForm.contactPhone,
  requesterName: requestForm.requesterName,
  notes: requestForm.notes,
  deviceId,
  // managementToken is added for a guest edit when available
}
```

Create uses `POST /api/blood/requests`; it may include a bearer token but does not require one.

**Backend flow and validation**

```text
BloodRequest.jsx -> useBloodRequests -> useSubmitBloodRequest
  -> blood.routes.js -> createBloodRequest
  -> validateBloodRequest
  -> blood request service -> BloodRequest.create -> MongoDB
```

- `server/routes/blood.routes.js`: create route has no shared Zod middleware and no mandatory `auth`; optional auth is handled in the controller.
- `server/controllers/blood/bloodRequestController.js`: invokes `server/utils/blood/bloodRequestValidation.js` before persistence. It normalizes strings, converts numeric values, builds nested `location` and `hospital` objects, hashes IP tracking data, and calculates expiry through the service.
- `validateBloodRequest` checks blood group against the eight supported values; bags integer 1-20; needed days integer 1-7; nonempty district/upazila/hospital name/address; and the `isValidPhone` rule, which accepts an optional plus sign and digits, spaces, parentheses, or hyphens with a length of 7-20 characters. It also checks boolean compensation, requester name max 100, and notes max 1000. It does not impose explicit max checks on district/upazila/hospital address/name beyond model limits, and its phone format differs from the Profile phone rule.
- `server/services/blood/bloodRequestService.js`: creates a guest management token, stores only its SHA-256 hash, computes `expiresAt`, and queries active requests.
- `server/models/BloodRequest.js`: required enum blood group; bags min 1/max 20; days min 1/max 7; required boolean compensation; required nested district/upazila; required hospital name/address with max 200/500; contact phone max 30; requester name max 100; notes max 1000; required expiry date; TTL index on `expiresAt`.

**Edit/update**

The same `BloodRequestForm` and `useSubmitBloodRequest` are used. `PUT /api/blood/requests/:id` repeats `validateBloodRequest`, rejects missing/expired records, then calls `authorizeBloodRequest` in `server/middlewares/bloodRequestAuth.js`. Authenticated owners are authorized by account; guests use the management token. `bloodRequestManagementService.updateRequest` normalizes fields, recalculates expiry from the original creation date, and saves with Mongoose validation.

**Errors, business rules, and security**

- Validation errors are HTTP 400 `{ message }`; unexpected create/update errors are HTTP 500 with a generic message.
- The client displays `requestError` from the response and success state in the modal.
- Create has IP/device database-backed rate limiting (`server/utils/blood/bloodRequestRateLimit.js`, `server/models/BloodRequestRateLimit.js`), a cooldown based on IP/device, and an authenticated-user active-request quota (`MAX_ACTIVE_REQUESTS_PER_USER` in `server/utils/blood/bloodRequestHelpers.js`). These are business/abuse controls, not field validation.
- Guest management tokens are generated randomly and stored hashed; private IP/device/token fields use `select: false` where defined.
- Updates/deletes require ownership or a valid management token and reject expired requests. The model has no phone `match`, no string length on district/upazila, and no strict schema mode declaration.

**Status:** Strong for server-side field validation and abuse controls; Partial overall because client checks are browser-only and some model constraints differ from controller rules.

### 4. Donor-related input/search

`client/src/pages/BloodSearch.jsx`, `client/src/hooks/useBloodSearch.js`, `client/src/components/blood/find-donor/BloodSearchForm.jsx`, and donor result components provide filter inputs rather than a persistence form. Server routes `GET /api/blood/donors` and `server/controllers/blood/bloodRequestManagementController.js#getDonors` accept query strings and filter Profiles for `bloodDonorStatus` `yes`/`willingly`, group, location, and compensation. There is no query-schema validator. Server pagination is fixed at 20 and page is clamped to at least 1. Donor output exposes only blood group, district, upazila, and donation contact number.

### 5. Medicine: Add and Edit

**Frontend files**

- `client/src/pages/Medicines.jsx`, `client/src/context/MedicineContext.jsx`: collection state and CRUD orchestration.
- `client/src/components/medicine/modal/MedicineFormModal.jsx`, `MedicineForm.jsx`, `MedicineBasicInfo.jsx`, `MedicinePricing.jsx`, `MedicineTreatment.jsx`: shared add/edit form.
- `client/src/hooks/medicine-form/useMedicineForm.js`: state, image selection, validation, date/payload construction, and submission callback.
- `client/src/hooks/medicine-form/useMedicineFormActions.js`: field actions and image state.
- `client/src/utils/medicine/medicineValidation.js`: client validator.
- `client/src/utils/medicine/medicineHelpers.js`, `client/src/data/medicineOptions.js`: type/pricing/date/dosage constants and normalization.

**Current client validation:** Strong relative to other non-Settings forms, but not server-schema based.

- Name is required after trimming; there is no client maximum length.
- Type is required and select options come from the supported type list.
- Strip medicines (`tablet`, `capsule`) require at least one dosage entry, supported time (`morning`, `noon`, `night`), positive integer quantity, positive price per strip, and positive integer pieces per strip.
- Unit medicines require positive price per unit and positive integer units per month; the client does not send a dosage schedule for them.
- Start month/year are required. Inactive medicines require end month/year and end date cannot precede start date. Active medicines send a null end date.
- Dosage quantity input uses browser `min="1"`, `step="1"`; image inputs use `accept="image/*"`. `useMedicineForm` additionally checks image MIME prefix and size <= 5 MB for the preview path, but invalid files are not surfaced as a validation error by the hook.
- `clean`/payload normalization trims name, converts numeric values with `Number`, normalizes dosage, and builds dates from month/year.

**API payload**

```js
{
  name: name.trim(),
  type,
  pricingType,
  dosage: stripMedicine ? normalizeDosage(dosage) : [],
  pricePerStrip: stripMedicine ? Number(pricePerStrip) : null,
  piecesPerStrip: stripMedicine ? Number(piecesPerStrip) : null,
  pricePerUnit: stripMedicine ? null : Number(pricePerUnit),
  unitsPerMonth: stripMedicine ? null : Number(unitsPerMonth),
  imageUrl,
  imageFile,
  startDate,
  endDate,
  isActive,
}
```

The context/upload path sends the persisted fields to `POST /api/medicines` or `PUT /api/medicines/:id`; image upload is handled separately when an image file is present.

**Backend flow and validation**

- `server/routes/medicine.routes.js` uses `auth` only; it has no Zod middleware.
- `server/controllers/medicine/medicineController.js` and `medicineManagementController.js` perform manual validation using `server/utils/medicine/medicineValidation.js` and `server/utils/medicine/medicineHelpers.js`.
- Server checks supported type, type/pricing compatibility, dosage array shape, unique dosage times, dosage time enum, positive integer quantity, positive prices, positive integer counts, active boolean, valid start date, required end date for inactive records, and chronological ordering. It trims/normalizes values before persistence.
- `server/services/medicineService.js` scopes reads, updates, and deletes by `user`; the controller enforces `MAX_MEDICINES_PER_USER = 10` on create. Updates validate the Mongo ObjectId and first load the owner’s document.
- `server/models/Medicine.js`: required owner/name/pricingType/startDate; type enum; dosage subdocument time enum and required quantity min 1/integer; price minimums; integer validators for pieces/month; timestamps. It has no name max, image URL validation, array count limit, or cross-field validator.

**Errors and security**

Client validation errors are shown in the form’s error block; server errors are converted to an `Error` and shown there. Server validation errors are generally HTTP 400; unexpected create errors are 500. Ownership filters prevent editing/deleting another user’s medicine. No strict request schema, image URL validation, file-content validation, or request rate limit was found.

**Status:** Strong/Partial. Field and cross-field rules are duplicated in client and server utilities, but the backend is feature-specific and Mongoose does not cover all controller rules.

### 6. Doctor: Add and Edit

**Frontend files**

- `client/src/pages/Doctors.jsx`, `client/src/context/DoctorContext.jsx`.
- `client/src/hooks/doctor/useDoctorForm.js`.
- `client/src/components/doctor/DoctorForm.jsx`, `DoctorFormFields.jsx`, `DoctorFormSection.jsx`, `chamber/ChamberForm.jsx`, `ChamberItem.jsx`.
- `client/src/utils/doctor/doctorFunctions.js`, `doctorFormUtils.js`.
- `client/src/data/doctor/doctorData.js`, `client/src/data/doctor/primaryHospitals.js`, `client/src/data/hospitalsData.js`.

**Current client validation:** Minimal.

- Doctor name has browser `required`.
- Selects and multi-selects constrain visible values to local option arrays for designation, primary hospital, last visit, degrees, specialties, hospitals, and visiting days.
- `cleanDoctorForm` converts `lastVisit` and chamber `visitFee` to numbers, filters blank degrees/specialities/phones/emails, ensures arrays, and trims chamber district. It is normalization, not a complete validator.
- No client checks for phone/email syntax, string lengths, chamber count, required chamber fields, valid hour relationships, valid dates, duplicate values, or submit errors displayed to the user. `saveDoctor` catches errors, logs them, and returns `false`.

**API payload**

`cleanDoctorForm(form)` returns the form spread with normalized `lastVisit`, filtered `degrees`/`specialities`, mapped `chambers`, and normalized `contactInfo.phones`/`emails`. It also retains fields from the form including `bmdcRegNo`, designation, hospital, notes, and chamber data. It is sent as JSON to `POST /api/doctors` or `PUT /api/doctors/:id`.

**Backend flow and validation**

- `server/routes/doctor.routes.js` has `auth` only; no Zod middleware.
- `server/controllers/doctorController.js` enforces `MAX_DOCTORS_PER_USER = 5` on create, removes a client-supplied `user`, and delegates CRUD to `server/services/doctorService.js`.
- `server/services/doctorService.js` scopes queries and updates by `{ _id, user }`; updates use `{ runValidators: true }`.
- `server/models/Doctor.js` requires only `user` and doctor `name`. Chamber `visitFee` has min 0; visiting hours have min/max 1-12 and AM/PM enum; all other strings and arrays have defaults and no length, phone, email, array-count, or cross-field validators. Timestamps are enabled.
- Mongoose validates types, enum values, required name, and numeric minimum/maximum values when create/update validation runs. There is no server manual validation for the request body.

**Errors and security**

- Create/update/delete require JWT authentication and use owner-scoped queries.
- Create quota and not-found responses are returned as HTTP 400/404. Most controller failures are generic HTTP 400; update/delete service errors do not expose detailed validation messages.
- No strict unexpected-field rejection, contact validation, string-length control, rate limit, or chamber business-rule validation was found.

**Status:** Minimal. There is one browser required field and Mongoose type/enum/numeric checks, but almost no request-level validation.

### 7. Prescription Upload

**Frontend files and shared flow**

- `client/src/pages/Prescriptions.jsx`, `client/src/context/PrescriptionContext.jsx`.
- Shared `client/src/components/medical-record/MedicalRecordPage.jsx` and `MedicalRecordUpload.jsx`.
- Shared `client/src/hooks/useMedicalRecordPage.js`.
- `client/src/utils/medicalRecordConfig.js` supplies `/api/prescriptions`, labels, and Cloudinary folder.

**Current client validation:** Minimal.

- `useMedicalRecordPage.handleUpload` requires `title.trim()` and a selected file, and checks the client-side record-limit flag before upload.
- The title input has no max length or browser `required` attribute because the upload button is `type="button"`.
- The file input accepts PNG/JPEG/JPG in the browser. There is no client MIME, byte-size, image-dimension, content, or title-length validation.
- The file is uploaded directly to Cloudinary before the application API call.

**API payload and flow**

```js
{ title: title.trim(), imageUrl: uploadData.secure_url }
```

```text
MedicalRecordUpload -> useMedicalRecordPage
  -> Cloudinary image upload
  -> POST /api/prescriptions
  -> prescription.routes.js -> auth -> createPrescription
  -> Prescription.create -> MongoDB
  -> POST /api/prescriptions/:id/analyze (best effort)
```

**Backend validation and model**

- `server/routes/prescription.routes.js` uses `auth` only; no Zod middleware.
- `server/controllers/prescriptionController.js` checks the count before create and later scopes analyze/delete queries by user. It destructures `title` and `imageUrl` but does not manually validate type, URL, or length.
- `server/models/Prescription.js` requires user/title/imageUrl, trims title/image URL, has no max lengths or URL match, optional AI summary/date, and timestamps.
- Create quota is five per user (`MAX_PRESCRIPTIONS_PER_USER` in both the client context and controller). Analyze is best-effort and has an AI 429 response path.

**Errors and security**

The client alerts upload, API, authentication, and AI errors. Backend create failures are HTTP 400; missing owned records during analysis are 404; AI rate exhaustion is 429. Auth and owner-scoped analyze/delete queries exist. Cloudinary receives the file before server metadata validation, and no server-side file validation or request schema was found.

**Status:** Minimal. There is a presence check, client record limit, auth, ownership, and Mongoose required fields, but file and metadata validation are sparse.

### 8. Report Upload

The Report form is the same shared flow as Prescription: `client/src/pages/Reports.jsx`, `client/src/context/ReportContext.jsx`, `client/src/components/medical-record/MedicalRecordPage.jsx`, `MedicalRecordUpload.jsx`, `client/src/hooks/useMedicalRecordPage.js`, and `client/src/utils/medicalRecordConfig.js` with `/api/reports` and the reports Cloudinary folder.

The payload is `{ title: title.trim(), imageUrl: uploadData.secure_url }`. Browser file selection accepts PNG/JPEG/JPG; client upload requires a nonblank title and file but has no explicit max/file-content validation. `server/routes/report.routes.js` uses `auth` only. `server/controllers/reportController.js` enforces five reports per user and scopes analyze/delete by user, but has no request field validator. `server/models/Report.js` has required user/title/imageUrl, trimming, optional AI fields, and timestamps, without max length or URL validation. Errors and AI behavior mirror Prescription.

**Status:** Minimal.

### 9. Health: BMI / Weight

**Frontend files**

- `client/src/pages/Health.jsx` and `client/src/hooks/useHealthLogs.js`.
- `client/src/components/health/forms/BMIForm.jsx`, `BMIResult.jsx`, and health charts.
- `client/src/context/ProfileContext.jsx` supplies saved height.

**Current client validation:** Minimal.

- Height must exist in profile and weight must be nonempty before submit.
- Weight input is browser `type="number"`, `min="1"`, `step="0.1"`, and `required`.
- BMI is calculated client-side to one decimal place from profile feet/inches and entered weight. This is calculation/display logic, not an independently enforced server constraint.
- The submitted payload is `{ type: "weight", weight: Number(weight) }`.

**Backend flow and validation**

`POST /api/health` uses `auth` and `server/controllers/healthController.js`, then `server/services/healthService.js#createHealthLog`, then `HealthLog.create`. There is no Zod middleware. The controller has no weight-specific checks. `server/models/HealthLog.js` requires `type` and permits enum values `bp`, `diabetes`, `weight`; `weight` itself is an unconstrained Number. The service keeps only the latest seven health logs per user, runs emergency processing, and synchronizes AI data.

**Errors/security:** the client throws and logs API errors; controller returns HTTP 400 with `{ message }` on exceptions. Auth and user ownership on creation/listing/deletion exist. No numeric range, finite-number, or cross-field check for weight was found.

**Status:** Minimal.

### 10. Health: Blood Pressure

**Frontend files:** `client/src/pages/Health.jsx`, `client/src/hooks/useHealthLogs.js`, `client/src/components/health/forms/BloodPressureForm.jsx`, and chart components.

**Current client validation:** Minimal.

- Submit stops when `high` or `low` is empty or a save is already running.
- Inputs are `type="number"` but have no min/max/step or required attribute.
- Critical display logic flags systolic `> 180` or diastolic `> 120`; this drives emergency-status text and is not a rejection rule.
- Payload is `{ type: "bp", High: high, Low: low }`, preserving strings in the form hook.

**Backend and model:** the same `/api/health` route/controller/service flow applies. There is no BP-specific controller check. `HealthLog` defines `High` and `Low` as unconstrained `Number` fields. Emergency processing and seven-log retention are service/business behavior.

**Errors/security:** API errors are caught/logged in the form and surfaced through the hook’s thrown error; no field-level display exists. JWT authentication and user-scoped operations exist. No finite/range/order validation was found.

**Status:** Minimal.

### 11. Health: Blood Sugar / Diabetes

**Frontend files:** `client/src/pages/Health.jsx`, `client/src/hooks/useHealthLogs.js`, `client/src/components/health/forms/BloodSugarForm.jsx`, and chart components.

**Current client validation:** Partial.

- `glucose`, `glucoseTiming`, and `recordedAt` must be nonempty before submit.
- Date choices are generated as today and the previous four calendar dates, so the UI only offers recent dates.
- Timing select options are fasting, random, and postMeal.
- Glucose is `type="number"` with `step="0.1"`; it has no min/max. Critical display logic flags below 3.0 or at/above 22.2 mmol/L but does not reject the value.
- Payload is `{ type: "diabetes", glucose, glucoseTiming, recordedAt }`.

**Backend validation/model:** `server/controllers/healthController.js` is the only route-specific check: diabetes requires `recordedAt` and a `YYYY-MM-DD` shape. It does not verify the date is real, current/past, or within five days. `HealthLog` validates `type` enum, `glucoseTiming` enum, and `recordedAt` regex only; `glucose` is unconstrained Number. Service retention, emergency checks, and AI synchronization are outside input validation.

**Status:** Partial. Timing and date shape receive client/model/controller checks, but glucose numeric and date semantics are weak.

## Current Validation Architecture

1. **Centralized or feature-specific:** Mostly feature-specific. Settings/profile is the only inspected feature using shared Zod request middleware. Medicine, blood, and health use feature utilities/controllers. Auth, doctor, and medical records have no shared request schema.
2. **Frontend validation:** Native browser constraints are common. Settings and Medicine have explicit reusable validators; Blood has detailed browser attributes but no custom preflight validator; Doctor, records, and health have limited checks.
3. **Backend validation:** Profile uses Zod plus Mongoose. Blood and Medicine use manual validators plus Mongoose. Auth uses a controller password check and User model constraints. Doctor, records, and most health rules rely on controllers/models.
4. **Zod installed:** Yes, in `server/package.json` as `zod`.
5. **Zod usage:** `server/validators/profile.schema.js`, `server/validators/profilePhoto.schema.js`, `server/validators/common.js`, and `server/middlewares/validate.js`.
6. **Shared validation middleware:** `server/middlewares/validate.js` calls `schema.safeParse(req.body)`, replaces `req.body` with parsed data, and returns HTTP 400 `{ message, errors: [{ field, message }] }`. It is wired to profile and profile-photo routes only.
7. **Shared validation utilities:** `server/validators/common.js` has reusable text, email, phone, and date helpers. Feature utilities exist for blood and medicine. Client reusable validators exist for Settings and Medicine.
8. **Strongest Mongoose validation:** `Profile`, `BloodRequest`, and `Medicine` have the most explicit enums, ranges, nested schemas, custom validators, and/or hooks. `User` has required/unique/trim constraints but lacks format validators. `HealthLog`, `Doctor`, `Prescription`, and `Report` are comparatively permissive.
9. **Little/no validation:** Login, Doctor, medical-record metadata/files, BP, BMI weight, and most health request shapes. Report and Prescription are structurally similar and both lack request schemas.
10. **Duplicated logic:** Settings client helper, Zod schema, and Profile pre-validation mirror many rules. Medicine client and server validators mirror type/pricing/dosage/date rules. Blood browser attributes, manual server validator, and Mongoose model overlap with different phone/string behavior.
11. **Inconsistencies:** Settings client phone allows only digits through input normalization, while shared server phone allows digits only and max 30; Blood server phone allows `+`, spaces, parentheses, and hyphens. Settings client name max is 50 and server matches it; other feature names often have no max. Medicine client allows image type/size checks for preview but server does not validate the resulting URL/file. Health client recent-date choices exceed the server’s regex-only semantics.
12. **Frontend-only reliance:** Doctor’s visible form rules, medical-record file selection/title presence, BMI weight range, and BP numeric presence largely rely on client/browser behavior; server models still provide some type/required checks.
13. **Raw input routes:** Auth, Doctor, Medicine, Prescription, Report, and Health routes do not use the shared Zod middleware. Blood and Medicine perform manual normalization/validation; the other listed routes accept broader raw request shapes before model persistence.
14. **Highest security priority based on current implementation:** Authentication request validation and abuse controls; medical-record upload/file and URL validation; Doctor contact/text/nested object validation; Health numeric/date validation; and consistency between Blood/Profile phone and location rules. These are observations of exposure, not recommendations or implementation changes.

## Existing Shared Utilities

| Utility                                           | Purpose                                                                    | Used by                                                       | Reuse classification                                        |
| ------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| `server/middlewares/validate.js`                  | Runs a Zod schema against `req.body`, replaces parsed body, formats issues | `server/routes/profile.routes.js`                             | Generic infrastructure, currently used only by profile      |
| `server/validators/common.js`                     | `optionalText`, `requiredText`, email/phone schemas, date helpers          | `profile.schema.js` and profile-photo validation dependencies | Generic server validation utility                           |
| `server/validators/profile.schema.js`             | Full nested profile create/update schema                                   | Profile POST/PUT routes                                       | Feature-specific reference architecture                     |
| `server/validators/profilePhoto.schema.js`        | Strict HTTPS photo URL and public ID metadata schema                       | Profile photo PUT route                                       | Feature-specific                                            |
| `client/src/utils/settings/settingsHelpers.js`    | Settings client validation and donation/date helpers                       | Settings hook and settings components                         | Feature-specific                                            |
| `client/src/utils/settings/settingsForm.js`       | Settings state factory, profile-to-form mapping, payload builder           | `useSettingsForm`                                             | Feature-specific                                            |
| `client/src/utils/medicine/medicineValidation.js` | Client medicine field/dosage/pricing/date checks                           | `useMedicineForm`                                             | Feature-specific                                            |
| `server/utils/medicine/medicineValidation.js`     | Server medicine normalization and manual validation                        | Medicine create/update controllers                            | Feature-specific                                            |
| `server/utils/medicine/medicineHelpers.js`        | Medicine enums, pricing classification, date normalization                 | Medicine validators/controllers                               | Feature-specific                                            |
| `server/utils/blood/bloodRequestValidation.js`    | Blood request field validation                                             | Blood create/update controllers                               | Feature-specific                                            |
| `server/utils/blood/bloodRequestHelpers.js`       | Blood constants, normalization, expiry, limits, public projection          | Blood controllers/services                                    | Feature-specific, includes business-limit constants         |
| `server/utils/blood/bloodRequestRateLimit.js`     | Database-backed IP/device request rate limit                               | Blood create controller                                       | Feature-specific abuse control                              |
| `client/src/hooks/useMedicalRecordPage.js`        | Shared prescription/report upload, title/file presence, limits, deletion   | Prescription and Report pages                                 | Generic medical-record workflow, validation remains minimal |
| `client/src/utils/medicalRecordConfig.js`         | Shared API paths and upload metadata                                       | Prescription and Report                                       | Generic feature configuration                               |
| `client/src/hooks/useHealthLogs.js`               | Shared health log fetch/create API state                                   | BMI, BP, blood sugar pages                                    | Generic health transport, no shared field validation        |
| `server/utils/healthCalculations.js`              | BMI calculation/category helpers                                           | Health/AI-related code                                        | Domain calculation utility, not request validation          |

## Existing Business Rules

These rules affect application behavior but are separate from field-shape validation:

- A profile is unique per user: `Profile.user` has a unique index and the profile controller checks for an existing profile before create.
- A donor with status `yes` or `willingly` must expose a donation phone and district/upazila; donor compensation is only valid for those statuses. These are cross-field domain rules implemented in client Settings helper, Zod, and Profile pre-validation.
- Blood requests expire based on `neededWithinDays`; the model TTL index removes them after `expiresAt`.
- Blood requests have an IP/device submission rate limit, a cooldown, and an authenticated-user active-request quota. Constants and enforcement are in `server/utils/blood/bloodRequestHelpers.js`, `bloodRequestRateLimit.js`, and `bloodRequestController.js`.
- Guest blood requests receive a management token; authorized users use their account. Ownership/token checks are in `server/middlewares/bloodRequestAuth.js` and blood management controllers.
- Medicines are limited to 10 per user in `server/services/medicineService.js` and the create controller.
- Doctors are limited to 5 per user in `server/services/doctorService.js` and the create controller.
- Prescriptions are limited to 5 per user in `PrescriptionContext.jsx` and `prescriptionController.js`.
- Reports are limited to 5 per user in `ReportContext.jsx` and `reportController.js`.
- Health logs retain only the latest 7 per user in `server/services/healthService.js`.
- Health emergency thresholds trigger processing/email behavior in the emergency service; the health forms display critical-state messages but do not reject measurements.
- Medical-record AI analysis is best-effort and cached by `aiSummary`/`aiAnalyzedAt`; an AI 429 is distinct from input validation.
- Medicine pricing type is determined by medicine type: tablet/capsule use strip pricing; other types use unit pricing. Date requirements vary by `isActive`.
- CRUD ownership is enforced in services with user-scoped queries for medicines, doctors, prescriptions, reports, health logs, and blood requests.

## Settings Validation Reference

**Exact files involved**

- `client/src/pages/Settings.jsx`
- `client/src/hooks/settings/useSettingsForm.js`
- `client/src/hooks/settings/useProfilePhoto.js`
- `client/src/utils/settings/settingsHelpers.js`
- `client/src/utils/settings/settingsForm.js`
- `client/src/components/settings/PersonalInfoSection.jsx`
- `client/src/components/settings/MedicalInfoSection.jsx`
- `client/src/components/settings/EmergencyContactsSection.jsx`
- `client/src/components/settings/BloodDonationSection.jsx`
- `client/src/components/settings/ProfilePhotoSection.jsx`
- `client/src/components/profile/ProfileFields.jsx`
- `client/src/context/ProfileContext.jsx`
- `client/src/data/districtsData.js`
- `client/src/data/settingsData.js`
- `server/routes/profile.routes.js`
- `server/middlewares/auth.js`
- `server/middlewares/validate.js`
- `server/validators/profile.schema.js`
- `server/validators/profilePhoto.schema.js`
- `server/validators/common.js`
- `server/controllers/profileController.js`
- `server/services/profileService.js`
- `server/utils/profileHelpers.js`
- `server/models/Profile.js`
- `server/models/User.js`

**Flow**

```text
Settings.jsx
  -> useSettingsForm
  -> validateSettingsForm(form)
  -> buildProfilePayload(form)
  -> fetch /api/profile (POST or PUT)
  -> auth
  -> validate(profileSchema)
  -> profileController
  -> profileService
  -> Profile/User Mongoose validation
  -> MongoDB
```

`useSettingsForm.handleSubmit` calls `preventDefault`, runs `validateSettingsForm`, stops with `alert` on the first client error, requires a token, chooses POST when no profile exists and PUT otherwise, builds the normalized payload, and sends JSON. It reads server errors from `data.errors[0].message` or `data.message` and displays them through `alert`.

**Client validation responsibilities**

`validateSettingsForm` checks nonblank/name max 50; optional DOB parse and not-future; paired height fields, integer feet 1-9 and inches 0-11; at most three emergency contacts; relation/name/presence; name max 50; at least phone or email; phone max 30; email max 254 and basic syntax; paired month/year and non-future donation month; donor-required donation phone and district/upazila. `handleChange` strips non-digits from `bloodDonationContactNumber`. The form controls also provide date/number/select UI constraints, and `addEmergencyContact` blocks adding beyond three.

`buildProfilePayload` converts blank DOB/height values to null, converts height to numbers, maps/trims emergency contacts, builds a UTC donation date from month/year, and trims address and donation phone. It does not itself validate.

**Server/Zod responsibilities**

`profileSchema` is a strict object, so unknown top-level fields are rejected. It validates name, ISO-shaped real DOB and age <= 120/not future, gender enum, nested height with `superRefine`, blood group enum, text limits, chronic illness strings and max 10, emergency contacts max 3 and nested relation/name/phone/email, donor enums, nullable donation date, and strict nested location. `superRefine` enforces donor dependencies and compensation eligibility. `profilePhotoSchema` separately requires strict HTTPS URL and bounded public ID.

`validate.js` maps Zod issues to `{ field, message }` and responds HTTP 400 with the first message plus all issues. It replaces `req.body` with parsed data before the controller.

**Business rules**

The controller prevents duplicate profile creation, updates the authenticated User name, synchronizes profile data to AI data, and scopes all profile operations to `req.userId`. Donor dependencies and compensation eligibility are domain/cross-field rules represented in schemas as well as the client/model. Profile photo removal also deletes the remote Cloudinary image when possible.

**Mongoose responsibilities**

`Profile` mirrors most Zod constraints: required unique user, enums, numeric min/max/integer height, text max lengths, chronic illness max 10/custom data check, emergency nested schema and max 3, phone/email regex and lengths, date not future, timestamps, and a `pre("validate")` hook for paired height, emergency contact contact-method requirement, donor dependencies, and compensation eligibility. `User` validates required trimmed name max 50 and required unique trimmed/lowercase username/email, but it does not format-check email or password. Profile update explicitly uses `runValidators: true`; profile creation uses `Profile.create`, which runs validation.

## Validation Gaps

| Form                   | Status  | Observed reason                                                                                                                                                     |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Signup                 | Partial | Browser required/email/minimum password and one server password check; no request schema, email/username/password format policy, or reliable duplicate error status |
| Login                  | Minimal | Browser required only; no server request-shape or abuse validation                                                                                                  |
| Blood Request          | Strong  | Detailed manual server validator, model constraints, ownership/token checks, quotas, cooldown, and rate limit; client custom validation is absent                   |
| Medicine               | Strong  | Client and server validators cover type/pricing/dosage/date rules; no shared schema, name max, URL/file validation, or request strictness                           |
| Doctor                 | Minimal | One browser required field, normalization, Mongoose basic types/enums/ranges, and owner/quota checks; no body validator or contact/string rules                     |
| Prescription           | Minimal | Shared presence check, auth/owner/quota checks, and required model fields; no metadata/file/URL schema                                                              |
| Report                 | Minimal | Same as Prescription                                                                                                                                                |
| BMI / weight           | Minimal | Browser positive-number hint and profile-height dependency; server weight is unconstrained                                                                          |
| Blood Pressure         | Minimal | Nonempty client values and critical display threshold; server numbers are unconstrained                                                                             |
| Blood Sugar / Diabetes | Partial | Client timing/date choices and server type/date-shape checks; glucose range and real-date semantics absent                                                          |
| Settings/Profile       | Strong  | Client helper, strict Zod schemas/middleware, profile-photo schema, mirrored Mongoose validators, and owner checks                                                  |

## Dependency Map

```text
Settings profile fields
├── useSettingsForm
├── settingsHelpers / settingsForm
├── ProfileFields
├── ProfileContext
├── districtsData / settingsData
└── profile.schema / common.js / Profile model

Email validation
├── Settings emergency contacts (client helper, Zod, Profile model)
└── server/validators/common.js

Phone validation
├── Settings emergency contacts and donor contact
├── Blood Request server utility
├── Profile model
└── Doctor contact fields (currently no format validator)

Blood groups
├── Settings PersonalInfoSection
├── Blood Request form
├── bloodRequestHelpers
├── profile.schema
├── Profile model
└── BloodRequest model

Shared medical record upload
├── Prescriptions.jsx
├── Reports.jsx
├── MedicalRecordPage
├── MedicalRecordUpload
├── useMedicalRecordPage
└── medicalRecordConfig

Health log transport
├── BMIForm
├── BloodPressureForm
├── BloodSugarForm
├── Health.jsx
└── useHealthLogs

Medicine validation
├── MedicineForm / useMedicineForm
├── client medicineValidation
├── server medicineValidation
├── server medicineHelpers
└── Medicine model

Doctor normalization
├── DoctorForm / ChamberForm
├── useDoctorForm
├── doctorFunctions
├── doctorFormUtils
└── Doctor model
```

## Files Relevant To Future Validation Work

### Existing validation infrastructure

- `server/middlewares/validate.js`
- `server/validators/common.js`
- `server/validators/profile.schema.js`
- `server/validators/profilePhoto.schema.js`
- `server/middlewares/auth.js`
- `server/server.js`

### Authentication

- `client/src/pages/Signup.jsx`
- `client/src/pages/Login.jsx`
- `client/src/components/AuthLayout.jsx`
- `client/src/context/AuthContext.jsx`
- `server/routes/auth.routes.js`
- `server/controllers/authController.js`
- `server/services/authService.js`
- `server/models/User.js`

### Blood request

- `client/src/pages/BloodRequest.jsx`
- `client/src/hooks/blood-request/useBloodRequests.js`
- `client/src/hooks/blood-request/useSubmitBloodRequest.js`
- `client/src/components/blood/blood-request/BloodRequestForm.jsx`
- `client/src/components/blood/blood-request/BloodRequestDetails.jsx`
- `client/src/components/blood/blood-request/BloodRequestLocation.jsx`
- `client/src/utils/blood/bloodRequestHelpers.js`
- `client/src/utils/blood/bloodRequestStorage.js`
- `server/routes/blood.routes.js`
- `server/controllers/blood/bloodRequestController.js`
- `server/controllers/blood/bloodRequestManagementController.js`
- `server/services/blood/bloodRequestService.js`
- `server/services/blood/bloodRequestManagementService.js`
- `server/utils/blood/bloodRequestValidation.js`
- `server/utils/blood/bloodRequestHelpers.js`
- `server/utils/blood/bloodRequestRateLimit.js`
- `server/middlewares/bloodRequestAuth.js`
- `server/models/BloodRequest.js`
- `server/models/BloodRequestRateLimit.js`

### Medicine

- `client/src/pages/Medicines.jsx`
- `client/src/context/MedicineContext.jsx`
- `client/src/components/medicine/modal/MedicineForm.jsx`
- `client/src/components/medicine/MedicineBasicInfo.jsx`
- `client/src/hooks/medicine-form/useMedicineForm.js`
- `client/src/hooks/medicine-form/useMedicineFormActions.js`
- `client/src/utils/medicine/medicineValidation.js`
- `client/src/utils/medicine/medicineHelpers.js`
- `server/routes/medicine.routes.js`
- `server/controllers/medicine/medicineController.js`
- `server/controllers/medicine/medicineManagementController.js`
- `server/services/medicineService.js`
- `server/utils/medicine/medicineValidation.js`
- `server/utils/medicine/medicineHelpers.js`
- `server/models/Medicine.js`

### Doctor

- `client/src/pages/Doctors.jsx`
- `client/src/context/DoctorContext.jsx`
- `client/src/hooks/doctor/useDoctorForm.js`
- `client/src/components/doctor/DoctorForm.jsx`
- `client/src/components/doctor/chamber/ChamberForm.jsx`
- `client/src/components/doctor/chamber/ChamberItem.jsx`
- `client/src/utils/doctor/doctorFunctions.js`
- `client/src/utils/doctor/doctorFormUtils.js`
- `server/routes/doctor.routes.js`
- `server/controllers/doctorController.js`
- `server/services/doctorService.js`
- `server/models/Doctor.js`

### Medical records

- `client/src/pages/Prescriptions.jsx`
- `client/src/pages/Reports.jsx`
- `client/src/context/PrescriptionContext.jsx`
- `client/src/context/ReportContext.jsx`
- `client/src/components/medical-record/MedicalRecordPage.jsx`
- `client/src/components/medical-record/MedicalRecordUpload.jsx`
- `client/src/hooks/useMedicalRecordPage.js`
- `client/src/utils/medicalRecordConfig.js`
- `server/routes/prescription.routes.js`
- `server/routes/report.routes.js`
- `server/controllers/prescriptionController.js`
- `server/controllers/reportController.js`
- `server/models/Prescription.js`
- `server/models/Report.js`

### Health

- `client/src/pages/Health.jsx`
- `client/src/hooks/useHealthLogs.js`
- `client/src/components/health/forms/BMIForm.jsx`
- `client/src/components/health/forms/BloodPressureForm.jsx`
- `client/src/components/health/forms/BloodSugarForm.jsx`
- `server/routes/health.routes.js`
- `server/controllers/healthController.js`
- `server/services/healthService.js`
- `server/models/HealthLog.js`
- `server/utils/healthCalculations.js`

### Settings reference

- `client/src/pages/Settings.jsx`
- `client/src/hooks/settings/useSettingsForm.js`
- `client/src/hooks/settings/useProfilePhoto.js`
- `client/src/utils/settings/settingsHelpers.js`
- `client/src/utils/settings/settingsForm.js`
- `client/src/components/settings/PersonalInfoSection.jsx`
- `client/src/components/settings/MedicalInfoSection.jsx`
- `client/src/components/settings/EmergencyContactsSection.jsx`
- `client/src/components/settings/BloodDonationSection.jsx`
- `client/src/components/settings/ProfilePhotoSection.jsx`
- `client/src/components/profile/ProfileFields.jsx`
- `client/src/context/ProfileContext.jsx`
- `server/routes/profile.routes.js`
- `server/controllers/profileController.js`
- `server/services/profileService.js`
- `server/models/Profile.js`
- `server/models/User.js`
- `server/validators/profile.schema.js`
- `server/validators/profilePhoto.schema.js`
- `server/validators/common.js`
- `server/middlewares/validate.js`

## Inventory Status

- Code modified: No
- Dependencies modified: No
- Validation added: No
- Refactoring performed: No
- Documentation created: `docs/validation-inventory.md`
