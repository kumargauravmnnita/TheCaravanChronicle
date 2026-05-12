import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

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
      {/* Public */}
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

      {/* Dashboard placeholder — will be replaced in next phase */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div
              className="flex items-center justify-center min-h-screen 
                            bg-circus-cream"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎪</div>
                <h1 className="text-2xl font-circus text-circus-tent">
                  Dashboard loading...
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  Building the big top!
                </p>
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
