# MediSync Architecture

Frontend

React 19

Vite

React Router v7

Context API

TailwindCSS v4

Chart.js

Lucide React

Backend

Express

MongoDB

JWT

bcryptjs

node-cron

---

Authentication

AuthContext

↓

Profile

Medicines

Doctors

Prescriptions

Health Logs

Dashboard

---

Current Contexts

AuthContext

MedicineContext

DoctorContext

PrescriptionContext

ProfileContext

---

Current Models

User

Profile

Medicine

Doctor

Prescription

HealthLog

---

Future

MedicalDocument

AIReport

OCR

Appointments

Wearables

---

Folder Principles

Pages

Contain page logic.

Components

Reusable UI only.

Context

Data management.

Hooks

Reusable logic.

Services

Backend business logic.

Models

MongoDB schemas.

Routes

API endpoints.

Never violate this separation.