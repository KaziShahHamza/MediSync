import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider } from "./context/MedicineContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PrescriptionProvider } from "./context/PrescriptionContext";
import { DoctorProvider } from "./context/DoctorContext";
import { ReportProvider } from "./context/ReportContext";
import { LifestyleProvider } from "./context/LifestyleContext";
import { ChatbotProvider } from "./context/ChatbotContext";

import Navbar, {
  ProtectedRoute,
  ScrollToTop,
} from "./components/navbar/Navbar";

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
// import BloodNeed from "./pages/z.test-pages/BloodNeed";
import BloodSearch from "./pages/BloodSearch";
import BloodRequest from "./pages/BloodRequest";

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
                        {/* =================================================
                            PUBLIC ROUTES
                        ================================================== */}

                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/signup" element={<Signup />} />

                        <Route path="/lifestyle" element={<LifestyleScore />} />
{/* 
                        <Route path="/blood-need" element={<BloodNeed />} /> */}

                        <Route path="/blood-search" element={<BloodSearch />} />

                        <Route
                          path="/blood-request"
                          element={<BloodRequest />}
                        />

                        {/* =================================================
                            PROTECTED ROUTES
                        ================================================== */}

                        <Route
                          element={
                            <ProtectedRoute>
                              <Outlet />
                            </ProtectedRoute>
                          }
                        >
                          <Route path="/dashboard" element={<Dashboard />} />

                          <Route path="/medicines" element={<Medicines />} />

                          <Route path="/health" element={<Health />} />

                          <Route
                            path="/prescriptions"
                            element={<Prescriptions />}
                          />

                          <Route path="/assistant" element={<Assistant />} />

                          <Route path="/reports" element={<Reports />} />

                          <Route path="/doctors" element={<Doctors />} />

                          <Route path="/profile" element={<Profile />} />

                          <Route path="/settings" element={<Settings />} />
                        </Route>
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
