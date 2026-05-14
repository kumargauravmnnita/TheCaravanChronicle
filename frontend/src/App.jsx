import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetail from "./pages/citizen/ComplaintDetail";

import StaffDashboard from "./pages/staff/StaffDashboard";

import AdminPanel from "./pages/admin/AdminPanel";

import CircusLogo from "./components/common/CircusLogo";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const SmartDashboard = () => {
  const { user } = useAuthStore();
  if (user?.role === "staff") return <StaffDashboard />;
  if (user?.role === "admin") return <AdminPanel />;
  return <CitizenDashboard />;
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Root */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />

      {/* Smart dashboard — shows different page based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SmartDashboard />
          </ProtectedRoute>
        }
      />

      {/* Citizen routes */}
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <SubmitComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-complaints"
        element={
          <ProtectedRoute>
            <MyComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint/:id"
        element={
          <ProtectedRoute>
            <ComplaintDetail />
          </ProtectedRoute>
        }
      />

      {/* Staff routes */}
      <Route
        path="/complaints"
        element={
          <ProtectedRoute allowedRoles={["staff", "admin"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes — built in next phase */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <div
              className="flex items-center justify-center min-h-screen
                            bg-circus-cream"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CircusLogo size={80} />
                </div>
                <h1 className="text-2xl font-circus text-circus-tent">
                  Reports — Coming Soon!
                </h1>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/heatmap"
        element={
          <ProtectedRoute allowedRoles={["staff", "admin"]}>
            <div
              className="flex items-center justify-center min-h-screen
                            bg-circus-cream"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CircusLogo size={80} />
                </div>
                <h1 className="text-2xl font-circus text-circus-tent">
                  Heatmap — Coming Soon!
                </h1>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
