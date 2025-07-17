import { Link, useNavigate } from "react-router-dom";
import { FaShip, FaTachometerAlt, FaUsers, FaComments, FaBars, FaBuilding, FaUserTie, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { FaTicket } from "react-icons/fa6";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div
      className={`bg-gray-700 text-white p-4 transition-all duration-300 h-screen sticky top-0 ${isOpen ? "w-64" : "w-20"
        } overflow-y-auto`}
    >
      <div className="flex flex-col items-center mb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none mb-3 p-2 rounded hover:bg-gray-600"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={isOpen ? 24 : 20} /> {/* Icon size increases when sidebar is closed */}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-all flex items-center justify-center group w-full font-bold"
          aria-label="Logout"
        >
          <FaSignOutAlt size={isOpen ? 24 : 20} /> {/* Icon size increases when sidebar is closed */}
          {!isOpen && (
            <span className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
              Logout
            </span>
          )}
          {isOpen && <span className="ml-2 font-bold">Logout</span>}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-6 mt-5">
        <div className="bg-green-500 p-3 rounded-full shadow-lg">
          <FaShip className={`text-white ${isOpen ? "text-4xl" : "text-3xl"}`} aria-label="Admin Panel Logo" /> {/* Icon size increases when sidebar is closed */}
        </div>
        {isOpen && (
          <h2 className="text-2xl font-bold text-center text-green-400 mt-3">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md font-bold">
              Admin Panel
            </span>
          </h2>
        )}
      </div>

      <ul className={`${isOpen ? "flex flex-col" : "flex flex-col items-center"} space-y-3 px-2 pb-10`}>
        {[
          { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
          { path: "/admin/users", icon: FaUsers, label: "Users" },
          { path: "/admin/ship", icon: FaShip, label: "Ships" },
          { path: "/admin/schedule", icon: FaBuilding, label: "Schedules" },
          { path: "/admin/booking", icon: FaTicket, label: "Booking" },
          { path: "/admin/feedback", icon: FaComments, label: "Feedbacks" },
          { path: "/admin/contact", icon: FaUserTie, label: "Contacts" },
        ].map(({ path, icon: Icon, label }) => (
          <li key={path} className="w-full">
            <Link
              to={path}
              className="p-3 rounded hover:bg-gray-600 transform transition-transform duration-200 hover:scale-105 flex items-center relative group font-bold"
            >
              <Icon size={isOpen ? 30 : 24} aria-label={label} /> {/* Icon size remains the same when sidebar is closed */}
              {!isOpen && (
                <span className="absolute left-16 bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {label}
                </span>
              )}
              {isOpen && <span className="ml-3 font-bold">{label}</span>}
            </Link>
          </li>

        ))}
      </ul>

    </div>
  );
}

export default Sidebar;
