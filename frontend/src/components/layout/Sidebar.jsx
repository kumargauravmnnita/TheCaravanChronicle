import { NavLink } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import {
  FiHome,
  FiPlusCircle,
  FiList,
  FiUsers,
  FiBarChart2,
  FiMap,
} from "react-icons/fi";
import useAuthStore from "../../store/authStore";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  const citizenLinks = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/submit", icon: <FiPlusCircle />, label: "Submit Complaint" },
    { to: "/my-complaints", icon: <FiList />, label: "My Complaints" },
  ];

  const staffLinks = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/complaints", icon: <FiList />, label: "All Complaints" },
    { to: "/heatmap", icon: <FiMap />, label: "Heatmap" },
  ];

  const adminLinks = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/complaints", icon: <FiList />, label: "All Complaints" },
    { to: "/users", icon: <FiUsers />, label: "Manage Users" },
    { to: "/reports", icon: <FiBarChart2 />, label: "Reports" },
    { to: "/heatmap", icon: <FiMap />, label: "Heatmap" },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "staff"
        ? staffLinks
        : citizenLinks;

  return (
    <>
      {/* 
        MOBILE OVERLAY
        When sidebar is open on mobile, show a dark overlay behind it
        Clicking the overlay closes the sidebar
        'md:hidden' means this overlay only exists on mobile
      */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/*
        SIDEBAR PANEL
        On mobile: fixed position, slides in from left using translate
        On desktop (md+): static position, always visible
        
        translate-x-0 = visible (slid in)
        -translate-x-full = hidden (slid out to left)
      */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
          z-40 pt-16 transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:h-auto md:pt-6 md:w-56 
          md:flex-shrink-0 md:block
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                 font-medium transition-colors duration-150
                 ${
                   isActive
                     ? "bg-circus-red text-white"
                     : "text-gray-600 hover:bg-circus-cream hover:text-circus-red"
                 }`
              }
            >
              <span className="text-base flex-shrink-0">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom tagline */}
        <div className="flex items-center justify-center gap-1.5">
          <FiStar className="w-3 h-3 text-circus-gold" />
          <p className="text-xs text-gray-400">The show must go on</p>
          <FiStar className="w-3 h-3 text-circus-gold" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
