// AuthContext.jsx
// Provides global authentication state to the whole app.
// Components read `isLoggedIn` from here instead of checking localStorage directly,
// so login/logout immediately re-renders every consumer without a page refresh.

import { createContext, useContext, useState } from "react";
import { saveToken, removeToken, isLoggedIn as checkToken } from "../utils/auth";

const AuthContext = createContext(null);

// AuthProvider wraps the app and holds the single isLoggedIn boolean
export function AuthProvider({ children }) {
  // Initialize from localStorage so state survives page refreshes
  const [isLoggedIn, setIsLoggedIn] = useState(checkToken());

  // Call this after a successful login API response
  function login(token) {
    saveToken(token);
    setIsLoggedIn(true);
  }

  // Call this on logout
  function logout() {
    removeToken();
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components call useAuth() to read/update auth state
export function useAuth() {
  return useContext(AuthContext);
}
