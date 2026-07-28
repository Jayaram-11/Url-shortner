// Client-side validation helpers.
// These mirror the backend's password rules so the user gets
// instant feedback before the form is submitted.

// Password rules (must match backend regex):
// ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*^])[A-Za-z\d@#$%^]{5,16}$
export function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^])[A-Za-z\d@#$%^]{5,16}$/;
  return regex.test(password);
}

// Basic email format check
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
