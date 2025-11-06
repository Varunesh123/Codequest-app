import { useState } from "react";
import Profile from "../pages/Profile";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="bg-[#1e293b] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Hi {userName} 👋</h2>
            <p className="text-gray-300 font-medium">Happy Coding !!</p>
          </div>
        </div>
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
