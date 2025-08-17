import React, { useState } from 'react';
import { 
  FaHome, 
  FaUserCog, 
  FaTrophy, 
  FaFire, 
  FaChartLine, 
  FaCode, 
  FaCrown,
  FaCalendar,
  FaSignOutAlt,
  FaBell,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { BiLaptop } from 'react-icons/bi';
import { MdCompareArrows } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const userStats = {
    problemsSolved: 247,
    streak: 15,
    rank: 'Gold',
    score: 1250
  };

  const navigationItems = [
    { 
      id: 'home', 
      icon: FaHome, 
      label: 'Dashboard', 
      color: 'text-blue-400',
      hoverColor: 'hover:bg-blue-500/10'
    },
    { 
      id: 'potd', 
      icon: BiLaptop, 
      label: 'POTD Challenge', 
      color: 'text-green-400',
      hoverColor: 'hover:bg-green-500/10'
    },
    { 
      id: 'compare', 
      icon: MdCompareArrows, 
      label: 'Compare Profiles', 
      color: 'text-purple-400',
      hoverColor: 'hover:bg-purple-500/10'
    },
    { 
      id: 'progress', 
      icon: FaChartLine, 
      label: 'Progress Track', 
      color: 'text-orange-400',
      hoverColor: 'hover:bg-orange-500/10'
    },
    { 
      id: 'contests', 
      icon: FaTrophy, 
      label: 'Contests', 
      color: 'text-yellow-400',
      hoverColor: 'hover:bg-yellow-500/10'
    }
  ];

  const handleNavClick = (itemId) => {
    setActiveSection(itemId);
    console.log(`Navigating to: ${itemId}`);
  };

  const getRankColor = (rank) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };
  const handleSignOut = () => {
    console.log('Sign Out clicked');
    navigate('/login');
  };
  return (
    <div className="w-80 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col border-r border-slate-700/50 shadow-2xl">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700/50">
        {/* Profile Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              👤
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Guest User
            </h3>
            <p className="text-sm text-gray-400 mb-1">Full Stack Developer</p>
            <div className="flex items-center gap-2">
              <FaCrown className={`text-sm ${getRankColor(userStats.rank)}`} />
              <span className={`text-xs font-semibold ${getRankColor(userStats.rank)}`}>
                {userStats.rank} Member
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setNotifications(0)}
              className="relative p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
            >
              <FaBell className="text-gray-400" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-3 rounded-xl border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <FaCode className="text-blue-400 text-sm" />
              <span className="text-xs text-gray-400">Solved</span>
            </div>
            <p className="text-lg font-bold text-white">{userStats.problemsSolved}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-3 rounded-xl border border-slate-600/30">
            <div className="flex items-center gap-2 mb-1">
              <FaFire className="text-orange-400 text-sm" />
              <span className="text-xs text-gray-400">Streak</span>
            </div>
            <p className="text-lg font-bold text-white">{userStats.streak} days</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Weekly Goal</span>
            <span className="text-xs text-gray-400">12/20</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-6 py-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                    : `hover:bg-slate-700/50 ${item.hoverColor}`
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                  }
                `}>
                  <IconComponent className={`text-lg ${isActive ? 'text-white' : item.color}`} />
                </div>
                <span className={`
                  font-medium transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                `}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Recent Achievements</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">Problem Solver</p>
                <p className="text-xs text-gray-400">Solved 250 problems</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">Consistent Coder</p>
                <p className="text-xs text-gray-400">15-day streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-slate-700/50 space-y-3">
        {/* Profile Settings */}
        <div 
          onClick={() => handleNavClick('settings')}
          className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 flex items-center space-x-3 rounded-xl hover:from-slate-600/50 hover:to-slate-500/50 cursor-pointer transition-all duration-300 border border-slate-600/30 group"
        >
          <div className="p-2 bg-slate-600/50 rounded-lg group-hover:bg-slate-500/50 transition-colors">
            <FaUserCog className="text-lg text-gray-300 group-hover:text-white transition-colors" />
          </div>
          <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Profile Settings</span>
        </div>

        {/* Logout Button */}
        <button
          className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 p-4 flex items-center justify-center space-x-3 rounded-xl hover:from-red-500/30 hover:to-red-600/30 cursor-pointer transition-all duration-300 group"
          onClick={handleSignOut}
        >
          <FaSignOutAlt className="text-lg text-red-400 group-hover:text-red-300 transition-colors" />
          <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">
            Sign Out
          </span>
        </button> 
      </div>
    </div>
  );
};
export default Profile;