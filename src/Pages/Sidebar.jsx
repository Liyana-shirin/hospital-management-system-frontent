import { useContext } from "react";
import { AuthContext } from "../Context/authContext.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { state, dispatch } = useContext(AuthContext);
  const { role, isAuthenticated } = state;
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show sidebar on login or register page
  const hiddenPaths = ["/login", "/signup"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    navigate("/login");
    toggleSidebar();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
    >
      {/* Logo and Close */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
        <Link to="/" className="text-xl font-bold text-white">
          🏥 LifeCare
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      <ul className="px-4 py-4 space-y-3">
        <li>
          <Link to="/home" onClick={toggleSidebar} className="hover:text-blue-400">
            Home
          </Link>
        </li>

        {/* Admin Dashboard - Only visible to admins */}
        {role === "admin" && (
          <li>
            <Link 
              to="/admin/dashboard" 
              onClick={toggleSidebar} 
              className="hover:text-blue-400"
            >
              Admin Dashboard
            </Link>
          </li>
        )}

        {/* Doctor Dashboard - Only visible to doctors */}
        {role === "doctor" && (
          <li>
            <Link 
              to="/doctor-dashboard" 
              onClick={toggleSidebar} 
              className="hover:text-blue-400"
            >
              Doctor Dashboard
            </Link>
          </li>
        )}

        {/* Patient Dashboard - Only visible to patients */}
        {role === "patient" && (
          <>
            <li>
              <Link 
                to="/doctors/find" 
                onClick={toggleSidebar} 
                className="hover:text-blue-400"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <Link 
                to="/patient-dashboard" 
                onClick={toggleSidebar} 
                className="hover:text-blue-400"
              >
                Patient Dashboard
              </Link>
            </li>
            
          </>
        )}

        <li>
          <Link to="/services" onClick={toggleSidebar} className="hover:text-blue-400">
            Services
          </Link>
        </li>

        {/* Logout Button */}
        <li>
          <button 
            onClick={handleLogout}
            className="hover:text-blue-400 w-full text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;