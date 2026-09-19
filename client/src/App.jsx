// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider } from "./context/MedicineContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PrescriptionProvider } from "./context/PrescriptionContext";
import { DoctorProvider } from "./context/DoctorContext";
import { ReportProvider } from "./context/ReportContext";
import { LifestyleProvider } from "./context/LifestyleContext";
import { ChatbotProvider } from "./context/ChatbotContext";

import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/navbar/ProtectedRoute";
import ScrollToTop from "./components/navbar/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
import Medicines from "./pages/Medicines";
import Health from "./pages/Health";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";
import Doctors from "./pages/Doctors";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import LifestyleScore from "./pages/LifestyleScore";
import Assistant from "./pages/Assistant";
import BloodNeed from "./pages/BloodNeed";

export default function App() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AuthProvider>
      <LifestyleProvider>
        <ProfileProvider>
          <MedicineProvider>
            <PrescriptionProvider>
              <ReportProvider>
                <DoctorProvider>
                  <ChatbotProvider>
                    <BrowserRouter>
                      <ScrollToTop />
                      <Navbar />

                      {/* Background reminder engine */}
                      {/* <ReminderWrapper /> */}

                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/lifestyle" element={<LifestyleScore />} />
                        <Route path="/blood-need" element={<BloodNeed />} />

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
                          path="/prescriptions"
                          element={
                            <ProtectedRoute>
                              <Prescriptions />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/assistant"
                          element={
                            <ProtectedRoute>
                              <Assistant />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute>
                              <Reports />
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
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </BrowserRouter>
                  </ChatbotProvider>
                </DoctorProvider>
              </ReportProvider>
            </PrescriptionProvider>
          </MedicineProvider>
        </ProfileProvider>
      </LifestyleProvider>
    </AuthProvider>
  );
}
