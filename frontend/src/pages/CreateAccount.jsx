// CreateAccount page
// Fields: Name, Email, Password
// On success: show message, redirect to Login
// On error: show backend error message

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAccount } from "../services/api";
import { validateEmail } from "../utils/validation";
import Loader from "../components/Loader";

function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showFormatError, setShowFormatError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate email format when user leaves the field
  function handleEmailBlur() {
    if (email && !validateEmail(email)) {
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Block submit if email format is wrong
    if (!validateEmail(email)) {
      setEmailError("Invalid email");
      return;
    }

    setMessage("");
    setShowFormatError(false);
    setLoading(true);

    const result = await createAccount(name, email, password);
    setLoading(false);

    if (result.ok) {
      setIsError(false);
      setMessage("Account created successfully.");
      // Redirect to login after a short delay so user sees the message
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setIsError(true);
      const errorCode = result.data?.detail?.error?.code;
      if (errorCode === "INCORRECT_FORMAT") {
        setShowFormatError(true);
      } else if (errorCode === "ACCOUNT_EXIST") {
        setMessage("Account already exists.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Create Account</h1>

        <form onSubmit={handleSubmit} className="form">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />

          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            onBlur={handleEmailBlur}
            required
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="field-error">{emailError}</p>
          )}

          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="password-field">
            <input
              id="password"
              className="form-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Bullet-point format error for INCORRECT_FORMAT */}
          {showFormatError && (
            <div className="message message-error">
              <p className="format-error-title">Password must include:</p>
              <ul className="format-error-list">
                <li>At least one uppercase character</li>
                <li>At least one lowercase character</li>
                <li>At least one digit</li>
                <li>At least one symbol: @ # $ % ^</li>
                <li>Minimum length: 5</li>
                <li>Maximum length: 16</li>
              </ul>
            </div>
          )}

          {message && (
            <p className={isError ? "message message-error" : "message message-success"}>
              {message}
            </p>
          )}

          <button
            id="create-account-btn"
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader /> : "Create Account"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CreateAccount;
