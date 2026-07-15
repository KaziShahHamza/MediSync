// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider, useMedicines } from "./context/MedicineContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PrescriptionProvider } from "./context/PrescriptionContext";
import { DoctorProvider } from "./context/DoctorContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
// import Dashboard from "./pages/Dashboard2";
import Medicines from "./pages/Medicines";
import Health from "./pages/Health";
import Health2 from "./pages/Health2";
import Prescriptions from "./pages/Prescriptions";
import Doctors from "./pages/Doctors";
import Dashboard from "./pages/Dashboard";

import TestPage from "./pages/TestPage";

import useMedicineReminder from "./hooks/useMedicineReminder";

function ReminderWrapper() {
  const { medicines } = useMedicines();
  useMedicineReminder(medicines);
  return null;
}

export default function App() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AuthProvider>
    <ProfileProvider>
      <MedicineProvider>
        <PrescriptionProvider>
          <DoctorProvider>

        <BrowserRouter>
          <Navbar />

          {/* Background reminder engine */}
          <ReminderWrapper />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/medicines"
              element={
                <ProtectedRoute>
                  <Medicines />
                </ProtectedRoute>
              }
            />

            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <Health />
                </ProtectedRoute>
              }
            />

            <Route
              path="/health2"
              element={
                <ProtectedRoute>
                  <Health2 />
                </ProtectedRoute>
              }
            />

            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute>
                  <Prescriptions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
          </DoctorProvider>
        </PrescriptionProvider>
      </MedicineProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}