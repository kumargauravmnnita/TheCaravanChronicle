import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import CircusLogo from "../common/CircusLogo";

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("See you under the big top!");
    navigate("/login");
  };

  const roleBadgeColor = {
    admin: "bg-circus-gold text-circus-dark",
    staff: "bg-blue-100 text-blue-800",
    citizen: "bg-green-100 text-green-800",
  };

  return (
    <nav
      className="bg-circus-tent text-white px-4 md:px-6 py-3 flex 
                    items-center justify-between shadow-lg sticky top-0 z-40"
    >
      {/* Left side — hamburger (mobile only) + logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger button — only visible on mobile (md:hidden) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-circus-darkred 
                     transition-colors"
          aria-label="Toggle menu"
        >
          {/* Show X when sidebar is open, hamburger when closed */}
          {sidebarOpen ? (
            <FiX className="w-5 h-5" />
          ) : (
            <FiMenu className="w-5 h-5" />
          )}
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <CircusLogo size={36} />
          <div>
            <p
              className="font-circus text-sm md:text-base leading-none 
                          text-circus-gold"
            >
              Circus of Wonders
            </p>
            {/* Hide subtitle on very small screens */}
            <p className="text-xs text-gray-300 leading-none hidden sm:block">
              Grounds Manager
            </p>
          </div>
        </Link>
      </div>

      {/* Right side — role badge + name + logout */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Role badge — hide on smallest screens */}
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium hidden 
                          sm:inline-block ${roleBadgeColor[user?.role]}`}
        >
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </span>

        {/* User name — hide on mobile */}
        <div className="items-center gap-1 text-sm hidden md:flex">
          <FiUser className="w-4 h-4" />
          <span>{user?.name}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm hover:text-circus-gold 
                     transition-colors p-1.5 rounded-lg hover:bg-circus-darkred"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
