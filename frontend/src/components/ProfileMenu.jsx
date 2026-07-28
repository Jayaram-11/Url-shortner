// ProfileMenu - dropdown shown when the profile icon is clicked.
// Uses AuthContext.logout() so isLoggedIn state updates instantly,
// hiding nav links and the profile icon without a page refresh.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfileMenu({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleDashboard() {
    onClose();
    navigate("/dashboard");
  }

  function handleLogout() {
    logout();   // clears token from localStorage AND sets isLoggedIn = false
    onClose();
    navigate("/login");
  }

  return (
    <div className="profile-dropdown">
      <button className="profile-dropdown-item" onClick={handleDashboard}>
        Dashboard
      </button>
      <button
        className="profile-dropdown-item profile-dropdown-logout"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfileMenu;
