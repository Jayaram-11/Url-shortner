// Navbar.jsx
// - Always visible on all pages.
// - When logged in: shows nav links (Home, Dashboard) with active highlight
//   and a profile icon that opens ProfileMenu.
// - When logged out: shows only the app title.
// - Reads isLoggedIn from AuthContext so it updates instantly on login/logout.

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const { isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      {/* Left: app title */}
      <span className="navbar-title">URL Shortener</span>

      {/* Right: nav links + profile icon (only when logged in) */}
      {isLoggedIn && (
        <div className="navbar-right">
          {/* Nav links with active highlight */}
          <NavLink
            to="/shortener"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          {/* Profile icon */}
          <div className="navbar-profile">
            <button
              className="profile-icon-btn"
              onClick={toggleMenu}
              aria-label="Open profile menu"
              title="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a8.5 8.5 0 0 1 13 0" />
              </svg>
            </button>
            {menuOpen && <ProfileMenu onClose={closeMenu} />}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
