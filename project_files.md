# Project Files

This list includes all files in the project excluding node_modules, images, fonts, and package-lock.json files.

project/
├── client/
│ ├── .env (8)
│ ├── .gitignore (24)
│ ├── eslint.config.js (29)
│ ├── index.html (13)
│ ├── package.json (36)
│ ├── vite.config.js (9)
│ └── src/
│ ├── App.jsx (148)
│ ├── index.css (1134)
│ ├── main.jsx (11)
│ ├── components/
│ │ ├── BMIChart.jsx (97)
│ │ ├── BMIForm.jsx (154)
│ │ ├── BMIResult.jsx (52)
│ │ ├── BloodPressureChart.jsx (78)
│ │ ├── BloodPressureForm.jsx (69)
│ │ ├── BloodSugarChart.jsx (181)
│ │ ├── BloodSugarForm.jsx (124)
│ │ ├── DoctorCard.jsx (114)
│ │ ├── DoctorChamber.jsx (86)
│ │ ├── DoctorForm.jsx (606)
│ │ ├── DoctorInfo.jsx (24)
│ │ ├── DoctorModal.jsx (183)
│ │ ├── HealthCharts.jsx (53)
│ │ ├── HealthLogForm.jsx (61)
│ │ ├── MedicineForm.jsx (613)
│ │ ├── MedicineImageModal.jsx (259)
│ │ ├── MedicineList.jsx (220)
│ │ ├── Navbar.jsx (310)
│ │ ├── PrescriptionCard.jsx (53)
│ │ ├── ProtectedRoute.jsx (9)
│ │ ├── ReportCard.jsx (51)
│ │ ├── ScrollToTop.jsx (12)
│ │ ├── auth/
│ │ │ └── AuthLayout.jsx (62)
│ │ ├── dashboard/
│ │ │ ├── HealthSummaryCard.jsx (146)
│ │ │ ├── QuickLinkCard.jsx (34)
│ │ │ └── StatCard.jsx (37)
│ │ └── profile/
│ │ ├── ProfileInput.jsx (26)
│ │ ├── ProfileSection.jsx (27)
│ │ ├── ProfileSelect.jsx (26)
│ │ └── ProfileSummary.jsx (143)
│ ├── context/
│ │ ├── AuthContext.jsx (29)
│ │ ├── DoctorContext.jsx (48)
│ │ ├── MedicineContext.jsx (35)
│ │ ├── PrescriptionContext.jsx (48)
│ │ ├── ProfileContext.jsx (80)
│ │ └── ReportContext.jsx (47)
│ ├── data/
│ │ ├── days.json (9)
│ │ ├── degrees.json (57)
│ │ ├── designations.json (11)
│ │ ├── hospitals.json (247)
│ │ └── specialties.json (19)
│ ├── hooks/
│ │ ├── useHealthLogs.js (43)
│ │ └── useMedicineReminder.js (44)
│ ├── pages/
│ │ ├── Dashboard.jsx (402)
│ │ ├── Doctors.jsx (269)
│ │ ├── Health.jsx (90)
│ │ ├── Home.jsx (309)
│ │ ├── Login.jsx (100)
│ │ ├── Medicines.jsx (183)
│ │ ├── Prescriptions.jsx (445)
│ │ ├── Profile.jsx (33)
│ │ ├── Reports.jsx (437)
│ │ ├── Settings.jsx (424)
│ │ ├── Signup.jsx (113)
│ │ ├── TestPage.jsx (16)
│ │ ├── TestReminderPage.jsx (47)
│ │ └── lifestyle/
│ │     ├── AssessmentResults.jsx (91)
│ │     ├── LifestyleScore.jsx (616)
│ │     ├── QuestionnaireSection.jsx (280)
│ │     ├── ScoreHeader.jsx (63)
│ │     └── styles.css (459)
│ └── utils/
│ └── timeMap.js (6)
├── server/
│ ├── .env (4)
│ ├── package.json (25)
│ ├── server.js (54)
│ ├── middleware/
│ │ └── auth.js (21)
│ ├── models/
│ │ ├── AIReport.js (28)
│ │ ├── Doctor.js (159)
│ │ ├── HealthLog.js (48)
│ │ ├── Medicine.js (49)
│ │ ├── Prescription.js (39)
│ │ ├── Profile.js (93)
│ │ ├── Report.js (37)
│ │ └── User.js (37)
│ ├── routes/
│ │ ├── ai.routes.js (181)
│ │ ├── auth.routes.js (145)
│ │ ├── dashboard.routes.js (23)
│ │ ├── doctor.routes.js (118)
│ │ ├── export.routes.js (182)
│ │ ├── health.routes.js (59)
│ │ ├── medicine.routes.js (258)
│ │ ├── prescription.routes.js (111)
│ │ ├── profile.routes.js (115)
│ │ └── report.routes.js (109)
│ ├── services/
│ │ ├── aiService.js (52)
│ │ ├── dashboardService.js (267)
│ │ ├── healthSummaryService.js (93)
│ │ ├── pdfService.js (595)
│ │ ├── prescriptionAiService.js (98)
│ │ └── reportAiService.js (96)
│ └── utils/
│ └── healthCalculations.js (28)
├── Total files: 100
└── Total code lines: 13546
