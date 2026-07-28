// Login page
// Fields: Email, Password
// On success: store JWT via context.login() → updates auth state immediately
// On error: show "Invalid Credentials"
// Bottom-right: link to Create Account

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Login() {
  const navigate = useNavigate();
  const { login: loginCtx } = useAuth(); // context login updates global state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      // loginCtx saves token AND sets isLoggedIn = true in context
      // so Navbar and ProtectedRoute update instantly
      loginCtx(result.data.access_token);
      setIsError(false);
      setMessage("Login Successful");
      setTimeout(() => navigate("/shortener"), 800);
    } else {
      setIsError(true);
      const errorCode = result.data?.detail?.error?.code;
      if (errorCode === "INVALID_CREDENTIALS") {
        setMessage("Invalid Credentials");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1 className="card-title">Login</h1>

        <form onSubmit={handleSubmit} className="form">
          <label className="form-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />

          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <div className="password-field">
            <input
              id="login-password"
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

          {message && (
            <p className={isError ? "message message-error" : "message message-success"}>
              {message}
            </p>
          )}

          <button
            id="login-btn"
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>

        {/* Bottom-right: link to Create Account */}
        <div className="login-footer">
          <Link to="/create-account" className="link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
