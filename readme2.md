# MediSync — Health & Medicine Tracking Platform

A full-stack medical management web app that helps users track medicines, health metrics, doctor information, prescriptions, and reminders. The app is built for a modern responsive experience and is planned for deployment on Hostinger.

## Overview

This project is split into two main parts:

- Frontend: React + Vite application for the user interface
- Backend: Node.js + Express API for authentication, health records, prescriptions, medicines, and user profiles
- Database: MongoDB with Mongoose
- Deployment target: Hostinger (shared hosting or VPS depending on backend hosting choice)

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Chart.js + react-chartjs-2
- Tailwind CSS
- Lucide React
- React Icons
- Context API for app state

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS
- node-cron for reminder scheduling

### Tools / Utilities
- ESLint
- PostCSS
- Autoprefixer

---

## Updated Folder Structure

```text
medicine_2/
├── README.md
├── readme2.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── assets/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── BloodPressureChart.jsx
│   │   │   ├── BloodPressureForm.jsx
│   │   │   ├── BloodSugarChart.jsx
│   │   │   ├── BloodSugarForm.jsx
│   │   │   ├── BMIChart.jsx
│   │   │   ├── BMIForm.jsx
│   │   │   ├── BMIResult.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── HealthCharts.jsx
│   │   │   ├── HealthLogForm.jsx
│   │   │   ├── MedicineForm.jsx
│   │   │   ├── MedicineList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrescriptionCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── auth/
│   │   │   │   └── AuthLayout.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── HealthSummaryCard.jsx
│   │   │   │   ├── QuickLinkCard.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── dashboard2/
│   │   │   │   ├── DashboardClock.jsx
│   │   │   │   ├── HealthSummaryCard.jsx
│   │   │   │   ├── OverviewCards.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   ├── TodayMedicines.jsx
│   │   │   │   └── WelcomeCard.jsx
│   │   │   └── profile/
│   │   │       ├── ProfileInput.jsx
│   │   │       ├── ProfileSection.jsx
│   │   │       ├── ProfileSelect.jsx
│   │   │       └── ProfileSummary.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── DoctorContext.jsx
│   │   │   ├── MedicineContext.jsx
│   │   │   ├── PrescriptionContext.jsx
│   │   │   └── ProfileContext.jsx
│   │   ├── hooks/
│   │   │   ├── useHealthLogs.js
│   │   │   └── useMedicineReminder.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard2.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Health.jsx
│   │   │   ├── Health2.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Medicines.jsx
│   │   │   ├── Prescriptions.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── TestPage.jsx
│   │   │   └── TestReminderPage.jsx
│   │   └── utils/
│   │       ├── dashboardHelpers.js
│   │       └── timeMap.js
│   └── README.md
│
├── server/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Doctor.js
│   │   ├── HealthLog.js
│   │   ├── Medicine.js
│   │   ├── Prescription.js
│   │   ├── Profile.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── doctor.routes.js
│   │   ├── health.routes.js
│   │   ├── medicine.routes.js
│   │   ├── prescription.routes.js
│   │   └── profile.routes.js
│   └── services/
│       ├── dashboardService.js
│       ├── healthSummaryService.js
│       └── reminderScheduler.js
│
├── docs/
│   ├── architecture.md
│   ├── context-design.md
│   ├── design-checklist.md
│   ├── development-rules.md
│   ├── future-roadmap.md
│   ├── redesign_one.md
│   └── redesign-progress.md
└── package.json (if present in root, depending on setup)
```

---

## Main Features

- User authentication and protected routes
- Medicine tracking and management
- Health log recording (blood pressure, blood sugar, BMI, etc.)
- Doctor, prescription, and profile management
- Reminder scheduling for medicine intake
- Dashboard with summary cards and charts
- Responsive web interface for health data management

---

## Local Development

### 1. Install frontend dependencies

```bash
cd client
npm install
```

### 2. Install backend dependencies

```bash
cd ../server
npm install
```

### 3. Run backend

```bash
cd server
npm run dev
```

### 4. Run frontend

```bash
cd client
npm run dev
```

The frontend typically runs on:
- http://localhost:5173

The backend typically runs on:
- http://localhost:5000

---

## Environment & Database Setup

The backend uses MongoDB, usually with a connection string similar to:

```js
mongodb://localhost:27017/medisync2
```

A typical server environment setup may include:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medisync2
JWT_SECRET=your_secret_key
```

---

## Hostinger Deployment Plan

This project is intended to be deployed on Hostinger.

### Recommended approach

For Hostinger, the project can be deployed in one of these ways:

1. Frontend on a Hostinger static hosting plan or cPanel deploy directory
2. Backend on a Hostinger VPS or Node.js-enabled hosting service
3. MongoDB on MongoDB Atlas, or a hosted database service, instead of local MongoDB

### Best practice for Hostinger

- Build the frontend production files with Vite
- Upload the generated dist folder to Hostinger static hosting or public web root
- Deploy the Node.js API on a Hostinger VPS or compatible Node environment
- Store environment variables securely in Hostinger hosting settings or server config
- Use MongoDB Atlas for the database instead of a local MongoDB instance when deploying live

### Frontend build command

```bash
cd client
npm run build
```

This generates the production folder:

```text
client/dist/
```

---

## Production Deployment Notes

- Use environment variables for secrets and database URLs
- Set a strong JWT secret in production
- Configure proper CORS rules for the production frontend domain
- Use HTTPS with Hostinger SSL
- Keep MongoDB connection secure and avoid exposing credentials in frontend code

---

## Summary

This app is a modern medical management system built with:

- React + Vite for the frontend
- Node.js + Express for the backend
- MongoDB + Mongoose for data storage
- JWT + bcrypt for security
- Hostinger as the planned deployment platform

The project is organized into a clear client/server structure and is suitable for a production deployment workflow with a host like Hostinger.
