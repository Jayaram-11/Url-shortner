// App.jsx - root component with routing setup
// AuthProvider wraps everything so auth state is globally available.
// ProtectedRoute reads from context — no page refresh needed after login.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import UrlShortener from "./pages/UrlShortener";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// ProtectedRoute: reads live context state, not localStorage directly
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Inner layout gets access to context (it lives inside AuthProvider)
function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/shortener"
            element={
              <ProtectedRoute>
                <UrlShortener />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
