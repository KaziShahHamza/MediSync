# MediSync Data and API Reference

## 1. Database and auth rules

- MongoDB is the data store; `server/server.js` connects with `mongoose.connect(process.env.MONGO_URI)`.
- The app uses JWT auth. `server/middleware/auth.js` reads `Authorization: Bearer <token>` and sets `req.userId` on successful verification.
- The JWT payload is `{ id: user._id }`.
- User-owned records in MongoDB are scoped by a `user` field and are usually filtered by `req.userId` in route handlers.

## 2. Model inventory

### User

File: `server/models/User.js`

Fields:

- `name`
- `username` (required, unique, lowercase)
- `email` (required, unique, lowercase)
- `password` (required, hashed)

### Profile

File: `server/models/Profile.js`

Fields:

- `user` (required, unique)
- `dob`
- `gender` enum: `Male`, `Female`, `Other`
- `height.feet`, `height.inches`
- `bloodGroup`
- `allergies`
- `chronicIllnesses` array
- `surgeries`
- `smoking` enum: `Never`, `Former`, `Current`
- `alcohol` enum: `Never`, `Occasionally`, `Frequently`
- `exercise` enum: `Never`, `1-2 Days`, `3-5 Days`, `Daily`
- `diet` enum: `Mixed`, `Vegetarian`, `Vegan`
- `emergencyContact.name`, `emergencyContact.phone`

Important:

- `User.name` is updated separately in `server/routes/profile.routes.js`

### Medicine

File: `server/models/Medicine.js`

Fields:

- `user` (required)
- `name` (required)
- `dosageTimes` enum values: `morning`, `noon`, `night`
- `imageUrl`
- `startDate` (required)
- `endDate`
- `isActive` (default `true`)

### HealthLog

File: `server/models/HealthLog.js`

Fields:

- `user` (required)
- `type` enum: `bp`, `diabetes`, `weight`
- `High`, `Low` for blood pressure
- `glucose`, `glucoseTiming` for diabetes
- `glucoseTiming` enum: `fasting`, `postMeal`, `random`
- `recordedAt` format: `YYYY-MM-DD`
- `weight`
- `note`
- `createdAt` and timestamps

### Doctor

File: `server/models/Doctor.js`

Fields:

- `user`
- `name`
- `bmdcRegNo`
- `degrees` array
- `specialities` array
- `designation`
- `primaryHospital`
- `chambers` array
- `contactInfo` object
- `notes`

Nested chamber data includes:

- `name`, `address`, `phone`, `serialNumber`, `visitingDays`
- `visitingTime.startHour`, `startPeriod`, `endHour`, `endPeriod`

### Prescription

File: `server/models/Prescription.js`

Fields:

- `user`
- `title`
- `imageUrl`
- `aiSummary`
- `aiAnalyzedAt`

### Report

File: `server/models/Report.js`

Same shape as `Prescription`:

- `user`, `title`, `imageUrl`, `aiSummary`, `aiAnalyzedAt`

### LifestyleAssessment

File: `server/models/LifestyleAssessment.js`

Fields:

- `user`
- `answers`
- `categoryScores`
- `totalScore` (0-100)
- `grade` enum: `A+`, `A`, `A-`, `B`, `C`
- `feedback`
- `assessedAt`

### AIReport

File: `server/models/AIReport.js`

Fields:

- `user` (unique)
- `summary`
- `generatedAt`

## 3. Ownership contract

The backend uses the authenticated user as the security boundary.

Patterns in the repo:

- `Medicine.find({ user: req.userId })`
- `Profile.findOne({ user: req.userId })`
- `Doctor.findOneAndUpdate({ _id: id, user: req.userId }, ...)`
- `LifestyleAssessment.find({ user: req.userId })`

This is the critical invariant for any change touching user-owned data.

## 4. API route map

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

Body examples:

- signup: `{ name, username, email, password }`
- login: `{ identifier, password }`

### Profile

- `GET /api/profile` (auth)
- `POST /api/profile` (auth)
- `PUT /api/profile` (auth)

Response shape: `{ user, profile }`

### Health

- `POST /api/health` (auth)
- `GET /api/health` (auth)
- `DELETE /api/health/:id` (auth)

### Medicines

- `GET /api/medicines` (auth)
- `POST /api/medicines` (auth)
- `PUT /api/medicines/:id` (auth)
- `DELETE /api/medicines/:id` (auth)

### Doctors

- `GET /api/doctors` (auth)
- `POST /api/doctors` (auth)
- `PUT /api/doctors/:id` (auth)
- `DELETE /api/doctors/:id` (auth)

### Prescriptions

- `GET /api/prescriptions` (auth)
- `POST /api/prescriptions` (auth)
- `POST /api/prescriptions/:id/analyze` (auth)
- `DELETE /api/prescriptions/:id` (auth)

### Reports

- `GET /api/reports` (auth)
- `POST /api/reports` (auth)
- `POST /api/reports/:id/analyze` (auth)
- `DELETE /api/reports/:id` (auth)

### Lifestyle

- `POST /api/lifestyle` (auth)
- `GET /api/lifestyle` (auth)
- `GET /api/lifestyle/latest` (auth)

### Dashboard and AI

- `GET /api/dashboard` (auth)
- `GET /api/ai/summary` (auth)
- `POST /api/ai/summary/generate` (auth)
- `GET /api/export/health-report` (auth)

## 5. Actual request payload examples

### Signup response

```json
{
  "token": "jwt",
  "user": {
    "_id": "...",
    "name": "Jane",
    "username": "jane",
    "email": "jane@example.com"
  }
}
```

### Health log example

```json
{
  "type": "diabetes",
  "glucose": 110,
  "glucoseTiming": "fasting",
  "recordedAt": "2026-09-10"
}
```

### Medicine example

```json
{
  "name": "Paracetamol",
  "dosageTimes": ["morning", "night"],
  "imageUrl": "https://example.com/image.jpg",
  "startDate": "2026-09-01",
  "endDate": null,
  "isActive": true
}
```

### Lifestyle save example

```json
{
  "answers": {
    "sleep": "7-8 hours",
    "water": "6-8 glasses"
  }
}
```

## 6. Frontend-to-backend mapping

- `client/src/context/AuthContext.jsx` stores `token` and `user` in `localStorage`
- `client/src/hooks/useHealthLogs.js` talks to `/api/health`
- `client/src/context/MedicineContext.jsx` fetches `/api/medicines`
- `client/src/context/ProfileContext.jsx` fetches `/api/profile`
- `client/src/context/DoctorContext.jsx` fetches `/api/doctors`
- `client/src/context/LifestyleContext.jsx` fetches `/api/lifestyle` and `/api/lifestyle/latest`
- `client/src/pages/Dashboard.jsx` calls `/api/dashboard`, `/api/ai/summary`, and `/api/export/health-report`

## 7. Contract-level invariants

- JWT header format is exactly `Authorization: Bearer <token>`
- `HealthLog.type` values are `bp`, `diabetes`, `weight`
- `Medicine.dosageTimes` values are `morning`, `noon`, `night`
- `recordedAt` is validated as `YYYY-MM-DD` for diabetes metrics
- document uploads store `imageUrl` in MongoDB
- `AIReport` is cached per user and may return `cached: true` or `false`

This document reflects only the code that exists in the repository and omits invented fields or endpoints.
