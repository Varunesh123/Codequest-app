import { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import Profile from "../pages/Profile";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="bg-[#1e293b] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <FaBars
            size={24}
            className="cursor-pointer"
            onClick={handleDrawerToggle}
          />
          <div>
            <h2 className="text-xl font-semibold">Hi Guest 👋</h2>
            <p className="text-gray-300 font-medium">Good Morning !!</p>
          </div>
        </div>
        <FaSignOutAlt size={24} className="cursor-pointer" />
      </div>

      {/* Sidebar Drawer */}
      {drawerOpen && (
        <div className="absolute top-0 left-0 h-full w-64 bg-[#0f172a] shadow-lg z-50 transition-transform duration-300">
          <button
            onClick={handleDrawerToggle}
            className="text-white p-4 text-left w-full hover:bg-slate-700"
          >
            Close
          </button>
          <Profile />
        </div>
      )}
    </div>
  );
};

export default Navbar;
