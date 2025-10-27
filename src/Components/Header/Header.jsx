import { useContext, useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext.jsx";
import Sidebar from "../../Pages/Sidebar.jsx";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/doctors/find", display: "Find a Doctor" },
  { path: "/services", display: "Services" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const headerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state, dispatch } = useContext(AuthContext);
  const { user, role, token } = state;
  const navigate = useNavigate();
  const location = useLocation();

  const handleStickyHeader = () => {
    const onScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current?.classList.add("sticky_header");
      } else {
        headerRef.current?.classList.remove("sticky_header");
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  };

  useEffect(handleStickyHeader, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) return null;

  return (
    <header ref={headerRef} className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-0 py-4 max-w-10xl flex items-center justify-between">
        {/* Left: Toggler Button + Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Toggler Button - Always Visible */}
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 text-gray-800 p-3 rounded-md focus:outline-none hover:bg-gray-300 transition-all duration-300"
            aria-label="Toggle Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>

          <img src={logo} alt="LifeCare Logo" className="h-12 w-16" />
          <h1 className="text-black font-bold text-xl md:text-2xl">LifeCare</h1>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-8 items-center">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primaryColor text-base font-semibold"
                      : "text-textColor text-base font-medium hover:text-primaryColor"
                  }
                >
                  {link.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: Profile/Login */}
        <div className="flex items-center gap-4">
          {/* User or Login Button */}
          {token && user ? (
            <div className="relative group cursor-pointer flex items-center gap-2">
              <figure className="w-10 h-10 rounded-full overflow-hidden border">
                <img src={userImg} alt="User" className="w-full h-full object-cover" />
              </figure>
              <span className="text-textColor font-medium hidden md:inline">{user.name}</span>

              {/* Dropdown */}
              <div className="absolute right-0 top-12 bg-white shadow-md rounded-md py-2 px-4 w-36 z-50 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 pointer-events-none">
                <button
                  onClick={handleLogout}
                  className="block text-sm w-full text-left hover:text-primaryColor"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-primaryColor py-2 px-4 md:px-6 text-white font-semibold rounded-full hover:bg-primaryDark transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
};

export default Header;
