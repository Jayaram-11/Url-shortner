// Utility functions for JWT token management in localStorage

// Save JWT token
export function saveToken(token) {
  localStorage.setItem("token", token);
}

// Get JWT token
export function getToken() {
  return localStorage.getItem("token");
}

// Remove JWT token (logout)
export function removeToken() {
  localStorage.removeItem("token");
}

// Check if a user is currently logged in
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
