import CircusLogo from "./components/common/CircusLogo";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetail from "./pages/citizen/ComplaintDetail";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />

      {/* Dashboard — all roles */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CitizenDashboard />
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

      {/* Placeholder routes — we'll build these next */}
      <Route
        path="/complaints"
        element={
          <ProtectedRoute allowedRoles={["staff", "admin"]}>
            <div className="flex items-center justify-center min-h-screen bg-circus-cream">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CircusLogo size={80} />
                </div>
                <h1 className="text-2xl font-circus text-circus-tent">
                  Staff Dashboard — Coming Next!
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
