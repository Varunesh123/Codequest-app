import React, { useEffect, useState } from 'react';
import { FiArrowRight, FiArrowLeft, FiRefreshCw, FiClock, FiCalendar } from 'react-icons/fi';
import { BiTimeFive } from 'react-icons/bi';
import { FaLightbulb, FaTrophy, FaUsers, FaPlay } from 'react-icons/fa';
import LeetcodeLogo from '../../assets/leetcode-logo.png'; // Ensure path is correct

// Custom CSS for additional styling
const styles = `
  .contest-card:hover {
    transform: translateY(-4px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  .gradient-accent {
    background: linear-gradient(135deg, #001f3f, #0074d9);
  }
  .refresh-overlay {
    animation: fadeIn 0.3s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Inject custom styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const LeetcodePage = () => {
  const [contests, setContests] = useState({ upcoming: [], past: [] });
  const [isPast, setIsPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchContests = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      console.log('Fetching LeetCode contests...');
      const res = await fetch(`process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contests/leetcode?_=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setContests({
          upcoming: data.upcomingContests || [],
          past: data.pastContests || []
        });
        setLastUpdated(data.lastUpdated || new Date().toISOString());
        setError("");
        
        if (!data.upcomingContests?.length && !data.pastContests?.length) {
          setError("No contests found. Data will be available shortly after the scheduler runs.");
        }
      } else {
        setError(data.message || "Failed to fetch contests from server.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Failed to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContests();
    
    const interval = setInterval(() => {
      fetchContests();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchContests(true);
  };

  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    
    if (now < start) return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (now >= start && now <= end) return { status: 'live', color: 'text-red-600', bg: 'bg-red-100' };
    return { status: 'ended', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const displayedContests = isPast ? contests.past : contests.upcoming;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Enhanced Top Nav with Gradient */}
      <div className="gradient-accent text-white px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiArrowLeft 
              size={24} 
              onClick={() => window.history.back()} 
              className="cursor-pointer hover:text-blue-300 transition-colors" 
            />
            <div className="flex items-center space-x-3">
              <img src={LeetcodeLogo} alt="LeetCode Logo" className="w-8 h-8" />
              <h2 className="text-xl font-bold">LeetCode Contests</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <span className="text-sm text-blue-100">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-blue-700 hover:bg-blue-800 rounded-full transition-colors disabled:opacity-50"
            >
              <FiRefreshCw 
                size={18} 
                className={refreshing ? 'animate-spin' : ''} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex space-x-6">
            <span className="flex items-center space-x-2">
              <FiCalendar size={16} className="text-blue-300" />
              <span>{contests.upcoming.length} upcoming</span>
            </span>
            <span className="flex items-center space-x-2">
              <FaTrophy size={16} className="text-yellow-400" />
              <span>{contests.past.length} completed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Contest List */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiRefreshCw size={40} className="text-blue-700 animate-spin mb-4" />
            <p className="text-center text-gray-600 text-lg">Loading contests...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-100 border border-red-300 rounded-lg p-8 max-w-md text-center">
              <p className="text-red-700 font-semibold mb-3">Unable to Load Contests</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : displayedContests.length > 0 ? (
          <div className="space-y-6">
            {displayedContests.map((contest, idx) => {
              const status = getContestStatus(contest);
              const timeUntil = !isPast ? getTimeUntilStart(contest.startTime) : null;
              
              return (
                <div
                  key={contest.platformId || idx}
                  className={`bg-white shadow-md rounded-xl p-6 border border-gray-200 contest-card hover:border-blue-300 ${status.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-5 flex-1">
                      {/* Contest Icon */}
                      <div className="flex flex-col items-center space-y-2 pt-2">
                        <img src={LeetcodeLogo} alt="LeetCode Logo" className="w-8 h-8" />
                        {status.status === 'live' && (
                          <div className="flex items-center space-x-2 text-xs">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-600 font-semibold">LIVE</span>
                          </div>
                        )}
                      </div>

                      {/* Contest Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight pr-3">
                            {contest.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}>
                            {status.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <FiClock size={16} className="text-blue-700" />
                              <span>
                                {new Date(contest.startTime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BiTimeFive size={16} className="text-blue-700" />
                              <span>
                                {new Date(contest.startTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {contest.duration && (
                              <div className="flex items-center space-x-2">
                                <FiCalendar size={16} className="text-blue-700" />
                                <span>{contest.duration} min</span>
                              </div>
                            )}
                          </div>

                          {!isPast && timeUntil && timeUntil !== 'Started' && (
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                              <span className="text-blue-700 font-semibold">
                                Starts in {timeUntil}
                              </span>
                            </div>
                          )}

                          {contest.description && (
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {contest.description.length > 150 
                                ? `${contest.description.substring(0, 150)}...` 
                                : contest.description
                              }
                            </p>
                          )}

                          {contest.company && (
                            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              <FaUsers size={14} className="text-purple-600" />
                              <span>{contest.company}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3 ml-5">
                      <a 
                        href={contest.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors group"
                      >
                        <FiArrowRight 
                          className="text-blue-700 group-hover:text-blue-900 transition-colors" 
                          size={20} 
                        />
                      </a>
                      {status.status === 'live' && (
                        <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold transition-colors">
                          <FaPlay size={12} />
                          <span>JOIN</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center max-w-md">
              <FaLightbulb size={56} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold mb-3">
                No {isPast ? 'past' : 'upcoming'} contests found
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {isPast 
                  ? 'Past contests will appear here once data is fetched.' 
                  : 'Upcoming contests will appear here when available.'
                }
              </p>
              <button
                onClick={handleRefresh}
                className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 gradient-accent px-6 py-4 shadow-2xl z-50">
        <div className="flex justify-between items-center">
          <button
            className={`flex items-center space-x-3 px-5 py-2 rounded-full transition-all duration-300 ${
              isPast 
                ? "bg-blue-700 hover:bg-blue-800 text-white shadow-lg" 
                : "bg-blue-900 hover:bg-blue-950 text-blue-100"
            }`}
            onClick={() => setIsPast(!isPast)}
          >
            <BiTimeFive size={20} className="text-blue-300" />
            <span className="text-sm font-semibold">
              {isPast ? "Show Upcoming" : "Show Past"}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
              {isPast ? contests.upcoming.length : contests.past.length}
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-white text-sm">
              <FaTrophy size={16} className="text-yellow-400" />
              <span>{displayedContests.length}</span>
            </div>
            <button className="text-white p-3 bg-blue-900 hover:bg-blue-950 rounded-full transition-colors">
              <FaLightbulb size={20} className="text-yellow-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-blue-100">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${refreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>{refreshing ? 'Updating...' : 'Connected'}</span>
          </div>
          {lastUpdated && (
            <span>Last sync: {new Date(lastUpdated).toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {refreshing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 refresh-overlay">
          <div className="bg-white rounded-lg p-8 shadow-xl flex items-center space-x-4">
            <FiRefreshCw size={24} className="text-blue-700 animate-spin" />
            <span className="text-gray-800 font-semibold">Refreshing contests...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetcodePage;