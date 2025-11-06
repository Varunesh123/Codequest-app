import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaSun, 
  FaUser, 
  FaArrowLeft 
} from 'react-icons/fa';
import { BiLaptop } from 'react-icons/bi';
import { MdCompareArrows, MdStar } from 'react-icons/md';
import { 
  SiLeetcode, 
  SiCodeforces, 
  SiCodechef, 
  SiGeeksforgeeks 
} from 'react-icons/si';

const Profile = ({ userStats = {
  problemsSolved: 247,
  streak: 15,
  rank: 'Gold',
  score: 1250,
  weeklyGoal: 12,
  weeklyTarget: 20
}, onBack, handlePageNavigation }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [animatedStats, setAnimatedStats] = useState({ problems: 0, streak: 0, score: 0 });
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');
  // Animate stats on component mount
  useEffect(() => {
    const animateValue = (start, end, duration, key) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        setAnimatedStats(prev => ({ ...prev, [key]: current }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    animateValue(0, userStats.problemsSolved, 2000, 'problems');
    animateValue(0, userStats.streak, 1500, 'streak');
    animateValue(0, userStats.score, 2500, 'score');
  }, [userStats.problemsSolved, userStats.streak, userStats.score]);

  const navigationItems = [
    { 
      id: 'dashboard', 
      icon: FaHome, 
      label: 'Dashboard', 
      color: 'text-blue-400',
      hoverColor: 'hover:bg-blue-500/10',
      page: 'dashboard'
    },
    { 
      id: 'potd', 
      icon: BiLaptop, 
      label: 'POTD Challenge', 
      color: 'text-green-400',
      hoverColor: 'hover:bg-green-500/10',
      page: 'potd'
    },
    { 
      id: 'compare', 
      icon: MdCompareArrows, 
      label: 'Compare Profiles', 
      color: 'text-purple-400',
      hoverColor: 'hover:bg-purple-500/10',
      page: 'compare'
    },
    { 
      id: 'progress', 
      icon: FaChartLine, 
      label: 'Progress Track', 
      color: 'text-orange-400',
      hoverColor: 'hover:bg-orange-500/10',
      page: 'progress'
    }
  ];

  const getRankColor = (rank) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const handleNavClick = (item) => {
    setActiveSection(item.id);
  };

  // Client-side logout
  const handleSignOut = async () => {
    // try {
    //   const response = await fetch('/api/users/logout', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
      
    //   if (response.ok) {
    //     localStorage.removeItem('token');
    //     window.location.href = '/login';
    //   }
    // } catch (error) {
    //   console.error('Logout failed:', error);
    // }
  };

  const renderMainContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardPage userStats={userStats} handlePageNavigation={handlePageNavigation} />;
      case 'potd':
        return <POTDPage handlePageNavigation={handlePageNavigation} />;
      case 'compare':
        return <CompareProfilesPage handlePageNavigation={handlePageNavigation} />;
      case 'progress':
        return <ProgressTrackPage handlePageNavigation={handlePageNavigation} />;
      default:
        return <DashboardPage userStats={userStats} handlePageNavigation={handlePageNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back and Profile Info */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 mb-6 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-300 group"
          >
            <FaArrowLeft className="text-gray-400 group-hover:text-white" />
            <span className="text-gray-400 group-hover:text-white font-medium">Back to Home</span>
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-3xl lg:text-4xl shadow-2xl">
                  <FaUser />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full border-3 lg:border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {userName}
                </h3>
                <p className="text-sm lg:text-base text-gray-400 mb-2 lg:mb-3">Full Stack Developer</p>
                <div className="flex items-center gap-3">
                  <FaCrown className={`text-lg lg:text-xl ${getRankColor(userStats.rank)}`} />
                  <span className={`text-sm lg:text-base font-semibold ${getRankColor(userStats.rank)}`}>
                    {userStats.rank} Member
                  </span>
                  <MdStar className="text-orange-400 text-xs lg:text-sm animate-bounce" />
                  <span className="text-xs text-orange-400">{animatedStats.streak} day streak</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <button 
                onClick={() => setNotifications(0)}
                className="relative p-3 lg:p-4 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"
              >
                <FaBell className="text-gray-400 text-base lg:text-lg" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-red-500 rounded-full text-xs flex items-center justify-center animate-bounce font-bold">
                    {notifications}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 lg:p-4 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"
              >
                {isDarkMode ? <FaSun className="text-yellow-400 text-base lg:text-lg" /> : <FaMoon className="text-blue-400 text-base lg:text-lg" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-4 lg:p-6 rounded-2xl border border-slate-600/30">
            <div className="flex items-center gap-3 mb-3">
              <FaCode className="text-blue-400 text-lg lg:text-xl" />
              <span className="text-sm text-gray-400">Problems Solved</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{animatedStats.problems}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-400">+5 this week</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 p-4 lg:p-6 rounded-2xl border border-slate-600/30">
            <div className="flex items-center gap-3 mb-3">
              <FaFire className="text-orange-400 text-lg lg:text-xl" />
              <span className="text-sm text-gray-400">Current Streak</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{animatedStats.streak} days</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-400">Keep going!</span>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base text-gray-400 font-medium">Weekly Goal Progress</span>
            <span className="text-base text-gray-400">{userStats.weeklyGoal}/{userStats.weeklyTarget}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative"
              style={{ width: `${(userStats.weeklyGoal/userStats.weeklyTarget)*100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-center text-gray-400 mt-3">
            {Math.round((userStats.weeklyGoal/userStats.weeklyTarget)*100)}% Complete
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-400 mb-4 uppercase tracking-wide">Navigation</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`
                    flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 group text-center
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg' 
                      : `hover:bg-slate-700/50 ${item.hoverColor}`
                    }
                  `}
                >
                  <div className={`
                    p-3 rounded-2xl mb-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transform scale-110' 
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50 group-hover:scale-105'
                    }
                  `}>
                    <IconComponent className={`text-lg lg:text-xl ${isActive ? 'text-white' : item.color}`} />
                  </div>
                  <span className={`
                    font-medium transition-colors duration-300 text-sm lg:text-base
                    ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                  `}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements Section */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-400 mb-4 uppercase tracking-wide">Recent Achievements</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <FaTrophy className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-white">Problem Solver</p>
                <p className="text-sm text-gray-400">Solved 250+ problems</p>
              </div>
              <div className="text-xs text-yellow-400 font-medium bg-yellow-400/10 px-3 py-1 rounded-full">NEW</div>
            </div>
            <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <FaCalendar className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-white">Consistent Coder</p>
                <p className="text-sm text-gray-400">15-day streak active</p>
              </div>
              <div className="text-xs text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full">ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mb-8">
          {renderMainContent()}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div 
            onClick={() => setActiveSection('settings')}
            className={`
              p-5 flex items-center space-x-5 rounded-2xl cursor-pointer transition-all duration-300 border group
              ${activeSection === 'settings'
                ? 'bg-gradient-to-r from-slate-600/50 to-slate-500/50 border-slate-400/50'
                : 'bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 border-slate-600/30'
              }
            `}
          >
            <div 
              onClick={() => navigate('/setting')}
              className="p-4 bg-slate-600/50 rounded-2xl group-hover:bg-slate-500/50 transition-colors"
            >
              <FaUserCog className="text-xl text-gray-300 group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium text-gray-300 group-hover:text-white transition-colors text-xl">
              Profile Settings
            </span>
          </div>

          <button
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 p-5 flex items-center justify-center space-x-5 rounded-2xl hover:from-red-500/30 hover:to-red-600/30 cursor-pointer transition-all duration-300 group"
            onClick={handleSignOut}
          >
            <FaSignOutAlt className="text-xl text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors text-xl">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page Component
const DashboardPage = ({ userStats, handlePageNavigation }) => (
  <div className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <button
          onClick={() => handlePageNavigation && handlePageNavigation('home')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
        >
          <FaHome className="text-gray-400" />
          <span className="text-gray-300">Home</span>
        </button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DynamicStatCard
          icon={<FaCode />}
          title="Today's Progress"
          value="5/10"
          subtitle="Problems Solved"
          color="from-green-500 to-emerald-500"
          progress={50}
        />
        <DynamicStatCard
          icon={<FaFire />}
          title="Current Streak"
          value={`${userStats.streak} Days`}
          subtitle="Keep it up!"
          color="from-orange-500 to-red-500"
          isAnimated={true}
        />
        <DynamicStatCard
          icon={<FaTrophy />}
          title="Global Rank"
          value="#247"
          subtitle="Out of 50K+ users"
          color="from-purple-500 to-indigo-500"
        />
        <DynamicStatCard
          icon={<MdStar />}
          title="Total Score"
          value={userStats.score}
          subtitle="Rating Points"
          color="from-yellow-500 to-amber-500"
        />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaChartLine className="text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <ActivityItem
              type="success"
              title="Solved 'Two Sum' on LeetCode"
              time="2 hours ago"
              points="+10 points"
            />
            <ActivityItem
              type="achievement"
              title="Earned Problem Solver badge"
              time="1 day ago"
              points="+50 points"
            />
            <ActivityItem
              type="streak"
              title="Maintained 15-day streak"
              time="Today"
              points="+5 bonus"
            />
            <ActivityItem
              type="challenge"
              title="Completed Array challenge"
              time="2 days ago"
              points="+25 points"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaCalendar className="text-green-400" />
            Upcoming Goals
          </h3>
          <div className="space-y-4">
            <GoalCard
              title="Weekly Challenge"
              description="Complete 20 problems this week"
              progress={60}
              daysLeft={3}
            />
            <GoalCard
              title="Contest Participation"
              description="Join next LeetCode contest"
              progress={0}
              daysLeft={2}
            />
            <GoalCard
              title="Skill Development"
              description="Master Dynamic Programming"
              progress={30}
              daysLeft={14}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// POTD Page Component
const POTDPage = ({ handlePageNavigation }) => (
  <div className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Problem of the Day
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageNavigation && handlePageNavigation('home')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
          >
            <FaHome className="text-gray-400" />
            <span className="text-gray-300">Home</span>
          </button>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Today's Date</p>
            <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Challenge Summary */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 rounded-2xl border border-green-500/20 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
            <FaCode className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Daily Challenge Status</h3>
            <p className="text-gray-300">Complete all 4 platform challenges to earn bonus points!</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <PlatformStatus platform="LeetCode" completed={true} />
          <PlatformStatus platform="CodeForces" completed={false} />
          <PlatformStatus platform="GeeksForGeeks" completed={true} />
          <PlatformStatus platform="CodeChef" completed={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EnhancedPlatformPOTD
          icon={<SiLeetcode size={32} />}
          platform="LeetCode"
          problem="Two Sum"
          difficulty="Easy"
          color="text-yellow-400"
          link="https://leetcode.com/problems/two-sum/"
          completed={true}
          timeSpent="12 min"
        />
        <EnhancedPlatformPOTD
          icon={<SiCodeforces size={32} />}
          platform="Codeforces"
          problem="A. Watermelon"
          difficulty="800"
          color="text-blue-400"
          link="https://codeforces.com/problemset/problem/4/A"
          completed={false}
          estimatedTime="15 min"
        />
        <EnhancedPlatformPOTD
          icon={<SiGeeksforgeeks size={32} />}
          platform="GeeksForGeeks"
          problem="Find Missing Number"
          difficulty="Easy"
          color="text-green-400"
          link="https://practice.geeksforgeeks.org/problems/missing-number-in-array1416/1"
          completed={true}
          timeSpent="8 min"
        />
        <EnhancedPlatformPOTD
          icon={<SiCodechef size={32} />}
          platform="CodeChef"
          problem="ATM Problem"
          difficulty="Beginner"
          color="text-orange-400"
          link="https://www.codechef.com/problems/HS08TEST"
          completed={false}
          estimatedTime="10 min"
        />
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl text-center">
          <div className="text-4xl font-bold text-orange-400 mb-2">15</div>
          <div className="text-gray-200">Day Streak</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
            <div className="bg-orange-400 h-2 rounded-full" style={{width: '75%'}}></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">2/4</div>
          <div className="text-gray-200">Today's Challenges</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
            <div className="bg-green-400 h-2 rounded-full" style={{width: '50%'}}></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl text-center">
          <div className="text-4xl font-bold text-blue-400 mb-2">+35</div>
          <div className="text-gray-200">Points Today</div>
          <div className="text-sm text-gray-400 mt-2">65 points to next level</div>
        </div>
      </div>
    </div>
  </div>
);

// Compare Profiles Page Component
const CompareProfilesPage = ({ handlePageNavigation }) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [comparedUser, setComparedUser] = useState(null);

  const handleSearch = () => {
    if (searchUsername.trim()) {
      setComparedUser({
        name: searchUsername,
        problems: Math.floor(Math.random() * 300) + 100,
        rank: `#${Math.floor(Math.random() * 1000) + 1}`,
        streak: Math.floor(Math.random() * 30) + 1,
        badges: Math.floor(Math.random() * 15) + 1,
        rating: Math.floor(Math.random() * 1000) + 1000
      });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Compare Profiles
          </h1>
          <button
            onClick={() => handlePageNavigation && handlePageNavigation('home')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
          >
            <FaHome className="text-gray-400" />
            <span className="text-gray-300">Home</span>
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold mb-4">Find User to Compare</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username to compare..."
              className="flex-1 px-4 py-3 bg-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 border border-slate-600"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl transition-all duration-300 font-medium"
            >
              Compare
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EnhancedProfileComparison
            name="Your Profile"
            problems={247}
            rank="#247"
            streak={15}
            badges={8}
            rating={1250}
            isCurrentUser={true}
          />
          {comparedUser ? (
            <EnhancedProfileComparison
              name={comparedUser.name}
              problems={comparedUser.problems}
              rank={comparedUser.rank}
              streak={comparedUser.streak}
              badges={comparedUser.badges}
              rating={comparedUser.rating}
              isCurrentUser={false}
            />
          ) : (
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-8 rounded-2xl border-2 border-dashed border-slate-500">
              <div className="text-center">
                <div className="text-8xl mb-6">🔍</div>
                <p className="text-xl font-medium text-gray-100 mb-2">Search for a user to compare</p>
                <p className="text-gray-300">Enter a username above to see detailed comparison</p>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Chart */}
        {comparedUser && (
          <div className="mt-8 bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Performance Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ComparisonMetric
                label="Problems Solved"
                yourValue={247}
                theirValue={comparedUser.problems}
              />
              <ComparisonMetric
                label="Current Streak"
                yourValue={15}
                theirValue={comparedUser.streak}
              />
              <ComparisonMetric
                label="Badges Earned"
                yourValue={8}
                theirValue={comparedUser.badges}
              />
              <ComparisonMetric
                label="Rating"
                yourValue={1250}
                theirValue={comparedUser.rating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress Track Page Component
const ProgressTrackPage = ({ handlePageNavigation }) => (
  <div className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Progress Track
        </h1>
        <button
          onClick={() => handlePageNavigation && handlePageNavigation('home')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
        >
          <FaHome className="text-gray-400" />
          <span className="text-gray-300">Home</span>
        </button>
      </div>
      
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <WeeklyOverviewCard />
        <SkillRadarCard />
        <RecentMilestonesCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaCode className="text-blue-400" />
            Problem Categories
          </h3>
          <div className="space-y-6">
            <EnhancedProgressBar label="Arrays & Hashing" solved={45} total={100} color="bg-blue-400" difficulty="Fundamental" />
            <EnhancedProgressBar label="Two Pointers" solved={32} total={80} color="bg-green-400" difficulty="Intermediate" />
            <EnhancedProgressBar label="Binary Search" solved={28} total={60} color="bg-yellow-400" difficulty="Intermediate" />
            <EnhancedProgressBar label="Trees & Graphs" solved={18} total={70} color="bg-purple-400" difficulty="Advanced" />
            <EnhancedProgressBar label="Dynamic Programming" solved={8} total={40} color="bg-red-400" difficulty="Expert" />
            <EnhancedProgressBar label="Backtracking" solved={12} total={30} color="bg-pink-400" difficulty="Advanced" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaTrophy className="text-yellow-400" />
            Platform Statistics
          </h3>
          <div className="space-y-6">
            <EnhancedPlatformStat 
              platform="LeetCode" 
              solved={89} 
              rating="1456" 
              icon={<SiLeetcode />}
              color="text-yellow-400"
              rank="Top 15%"
            />
            <EnhancedPlatformStat 
              platform="Codeforces" 
              solved={67} 
              rating="1234" 
              icon={<SiCodeforces />}
              color="text-blue-400"
              rank="Specialist"
            />
            <EnhancedPlatformStat 
              platform="GeeksforGeeks" 
              solved={123} 
              rating="Expert" 
              icon={<SiGeeksforgeeks />}
              color="text-green-400"
              rank="Expert"
            />
            <EnhancedPlatformStat 
              platform="CodeChef" 
              solved={45} 
              rating="3★" 
              icon={<SiCodechef />}
              color="text-orange-400"
              rank="3 Star"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper Components
const DynamicStatCard = ({ icon, title, value, subtitle, color, progress, isAnimated }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`text-2xl ${isAnimated ? 'animate-bounce' : ''}`}>{icon}</div>
      <div className="text-right">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
    <h4 className="font-bold text-lg mb-1">{title}</h4>
    <p className="text-white/80 text-sm">{subtitle}</p>
    {progress !== undefined && (
      <div className="mt-3">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

const ActivityItem = ({ type, title, time, points }) => {
  const getTypeConfig = (type) => {
    switch(type) {
      case 'success': return { color: 'bg-green-500', icon: '✓' };
      case 'achievement': return { color: 'bg-yellow-500', icon: '🏆' };
      case 'streak': return { color: 'bg-orange-500', icon: '🔥' };
      case 'challenge': return { color: 'bg-blue-500', icon: '💪' };
      default: return { color: 'bg-gray-500', icon: '•' };
    }
  };

  const config = getTypeConfig(type);

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
      <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center text-white font-bold`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-gray-400">{time}</p>
      </div>
      <div className="text-green-400 font-bold">{points}</div>
    </div>
  );
};

const GoalCard = ({ title, description, progress, daysLeft }) => (
  <div className="p-4 bg-slate-800/50 rounded-xl">
    <h4 className="font-bold text-white mb-2">{title}</h4>
    <p className="text-sm text-gray-400 mb-3">{description}</p>
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs text-gray-400">{progress}% Complete</span>
      <span className="text-xs text-blue-400">{daysLeft} days left</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const PlatformStatus = ({ platform, completed }) => (
  <div className={`p-3 rounded-lg text-center ${completed ? 'bg-green-500/20 border border-green-500/30' : 'bg-slate-800/50 border border-slate-600/30'}`}>
    <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center ${completed ? 'bg-green-500' : 'bg-slate-600'}`}>
      {completed ? '✓' : '○'}
    </div>
    <p className="text-xs font-medium">{platform}</p>
  </div>
);

const EnhancedPlatformPOTD = ({ icon, platform, problem, difficulty, color, link, completed, timeSpent, estimatedTime }) => (
  <div 
    className={`
      bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl transition-all duration-300 cursor-pointer border
      ${completed 
        ? 'border-green-500/30 hover:border-green-400/50' 
        : 'border-slate-500/50 hover:border-slate-400 hover:from-slate-600 hover:to-slate-500'
      }
    `}
    onClick={() => window.open(link, '_blank')}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={color}>{icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold">{platform}</h3>
        {completed && <div className="text-green-400 text-sm font-medium">✓ Completed</div>}
      </div>
      {completed && (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">✓</span>
        </div>
      )}
    </div>
    <h4 className="text-lg font-semibold mb-2">{problem}</h4>
    <div className="flex justify-between items-center mb-4">
      <p className="text-gray-300">Difficulty: <span className="font-medium">{difficulty}</span></p>
      {completed ? (
        <p className="text-green-400 text-sm">Solved in {timeSpent}</p>
      ) : (
        <p className="text-blue-400 text-sm">Est. {estimatedTime}</p>
      )}
    </div>
    <button className={`
      w-full px-4 py-3 rounded-xl transition-colors duration-300 font-medium
      ${completed 
        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
        : 'bg-blue-500 hover:bg-blue-600 text-white'
      }
    `}>
      {completed ? 'View Solution' : 'Solve Now'}
    </button>
  </div>
);

const EnhancedProfileComparison = ({ name, problems, rank, streak, badges, rating, isCurrentUser }) => (
  <div className={`
    p-6 rounded-2xl border-2 transition-all duration-300
    ${isCurrentUser 
      ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30' 
      : 'bg-gradient-to-br from-slate-700 to-slate-600 border-slate-500/50'
    }
  `}>
    <div className="text-center mb-6">
      <div className={`
        w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl
        ${isCurrentUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-gray-500 to-gray-600'
        }
      `}>
        <FaUser />
      </div>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      {isCurrentUser && <div className="text-blue-400 text-sm font-medium">You</div>}
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
        <span className="text-gray-300">Problems Solved</span>
        <span className="text-blue-400 font-bold text-lg">{problems}</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
        <span className="text-gray-300">Global Rank</span>
        <span className="text-purple-400 font-bold text-lg">{rank}</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
        <span className="text-gray-300">Current Streak</span>
        <span className="text-orange-400 font-bold text-lg">{streak} days</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
        <span className="text-gray-300">Badges</span>
        <span className="text-yellow-400 font-bold text-lg">{badges}</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
        <span className="text-gray-300">Rating</span>
        <span className="text-green-400 font-bold text-lg">{rating}</span>
      </div>
    </div>
  </div>
);

const ComparisonMetric = ({ label, yourValue, theirValue }) => {
  const isWinning = yourValue > theirValue;
  const percentage = yourValue > 0 ? ((yourValue - theirValue) / yourValue * 100).toFixed(1) : 0;
  
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl">
      <h4 className="text-sm text-gray-400 mb-2">{label}</h4>
      <div className="flex justify-between items-center mb-2">
        <span className="text-blue-400 font-bold">You: {yourValue}</span>
        <span className="text-purple-400 font-bold">Them: {theirValue}</span>
      </div>
      <div className={`text-xs font-medium ${isWinning ? 'text-green-400' : 'text-red-400'}`}>
        {isWinning ? `+${percentage}% ahead` : `${percentage}% behind`}
      </div>
    </div>
  );
};

const WeeklyOverviewCard = () => (
  <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
      <FaCalendar className="text-blue-400" />
      Weekly Overview
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Problems Solved</span>
        <span className="text-blue-400 font-bold">12/20</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3">
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full" style={{width: '60%'}}></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">5</p>
          <p className="text-xs text-gray-400">Easy</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">4</p>
          <p className="text-xs text-gray-400">Medium</p>
        </div>
      </div>
    </div>
  </div>
);

const SkillRadarCard = () => (
  <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
      <MdStar className="text-yellow-400" />
      Skill Distribution
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm">Arrays</span>
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-800 rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
          </div>
          <span className="text-blue-400 text-sm font-bold">85%</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm">Trees</span>
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-800 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full" style={{width: '70%'}}></div>
          </div>
          <span className="text-green-400 text-sm font-bold">70%</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm">Graphs</span>
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-800 rounded-full h-2">
            <div className="bg-purple-400 h-2 rounded-full" style={{width: '60%'}}></div>
          </div>
          <span className="text-purple-400 text-sm font-bold">60%</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm">DP</span>
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-800 rounded-full h-2">
            <div className="bg-red-400 h-2 rounded-full" style={{width: '45%'}}></div>
          </div>
          <span className="text-red-400 text-sm font-bold">45%</span>
        </div>
      </div>
    </div>
  </div>
);

const RecentMilestonesCard = () => (
  <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
      <FaTrophy className="text-yellow-400" />
      Recent Milestones
    </h3>
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">250 Problems</p>
          <p className="text-xs text-gray-400">Achieved yesterday</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">🔥</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">15-Day Streak</p>
          <p className="text-xs text-gray-400">Active now</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">⭐</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Gold Rank</p>
          <p className="text-xs text-gray-400">Promoted 3 days ago</p>
        </div>
      </div>
    </div>
  </div>
);

const EnhancedProgressBar = ({ label, solved, total, color, difficulty }) => {
  const percentage = (solved / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-white font-medium">{label}</span>
          <span className="text-xs text-gray-400 ml-2">({difficulty})</span>
        </div>
        <span className="text-gray-300 text-sm">{solved}/{total}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500 relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{percentage.toFixed(1)}% Complete</span>
        <span>{total - solved} remaining</span>
      </div>
    </div>
  );
};

const EnhancedPlatformStat = ({ platform, solved, rating, icon, color, rank }) => (
  <div className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className={color}>{icon}</div>
      <span className="font-medium text-white">{platform}</span>
    </div>
    <div className="grid grid-cols-3 gap-3 text-center">
      <div>
        <p className="text-lg font-bold text-blue-400">{solved}</p>
        <p className="text-xs text-gray-400">Solved</p>
      </div>
      <div>
        <p className="text-lg font-bold text-green-400">{rating}</p>
        <p className="text-xs text-gray-400">Rating</p>
      </div>
      <div>
        <p className="text-lg font-bold text-purple-400">{rank}</p>
        <p className="text-xs text-gray-400">Rank</p>
      </div>
    </div>
  </div>
);

export default Profile;