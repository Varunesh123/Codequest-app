import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Clock, Calendar, Timer, Trophy, Users, Play, Lightbulb, AlertCircle } from 'lucide-react';

const GeeksForGeeksPage = () => {
  const [contests, setContests] = useState({ upcoming: [], past: [] });
  const [isPast, setIsPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchContests = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setError("");
    
    try {
      console.log('Fetching GeeksforGeeks contests...');
      
      const res = await fetch(`${API_URL}/api/contests/geeksforgeeks?_=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.success && data.data) {
        // Match the controller's response format: data.data.upcoming and data.data.past
        const upcomingContests = data.data.upcoming || [];
        const pastContests = data.data.past || [];
        
        setContests({
          upcoming: upcomingContests,
          past: pastContests
        });
        
        setLastUpdated(data.data.lastUpdated || new Date().toISOString());
        setRetryCount(0);
        
        console.log(`Loaded ${upcomingContests.length} upcoming, ${pastContests.length} past contests`);
        
        if (upcomingContests.length === 0 && pastContests.length === 0) {
          setError("No contests available. System is generating fresh contest data...");
          // Auto-retry after 3 seconds if no contests found
          setTimeout(() => {
            if (retryCount < 3) {
              setRetryCount(prev => prev + 1);
              fetchContests(false);
            }
          }, 3000);
        }
      } else {
        throw new Error(data.message || "Invalid response from server");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Connection failed: ${err.message}`);
      
      // Auto-retry logic for connection issues
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchContests(false);
        }, 2000);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Force refresh by calling the controller's clear cache endpoint
  const forceRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('Force refreshing GeeksforGeeks data...');
      
      // Try to call force refresh endpoint if it exists
      try {
        await fetch(`${API_URL}/api/contests/geeksforgeeks/force-refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (refreshError) {
        console.log('Force refresh endpoint not available, using regular refresh');
      }
      
      // Wait a moment then fetch fresh data
      setTimeout(() => {
        fetchContests(true);
      }, 1000);
      
    } catch (error) {
      console.error('Force refresh error:', error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContests();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchContests(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
    
    if (now < start) return { 
      status: 'upcoming', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 border-blue-200' 
    };
    if (now >= start && now <= end) return { 
      status: 'live', 
      color: 'text-red-600', 
      bg: 'bg-red-50 border-red-200' 
    };
    return { 
      status: 'ended', 
      color: 'text-gray-600', 
      bg: 'bg-gray-50 border-gray-200' 
    };
  };

  const displayedContests = isPast ? contests.past : contests.upcoming;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ArrowLeft 
              size={24} 
              onClick={() => window.history.back()} 
              className="cursor-pointer hover:text-blue-300 transition-colors" 
            />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
                GFG
              </div>
              <h2 className="text-xl font-bold">GeeksforGeeks Contests</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <span className="text-sm text-blue-100">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={forceRefresh}
              disabled={refreshing}
              className="p-2 bg-blue-700 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50"
              title="Force refresh data"
            >
              <RefreshCw 
                size={18} 
                className={refreshing ? 'animate-spin' : ''} 
              />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex space-x-6">
            <span className="flex items-center space-x-2">
              <Calendar size={16} className="text-blue-300" />
              <span>{contests.upcoming.length} upcoming</span>
            </span>
            <span className="flex items-center space-x-2">
              <Trophy size={16} className="text-yellow-400" />
              <span>{contests.past.length} completed</span>
            </span>
          </div>
          {retryCount > 0 && (
            <span className="text-yellow-300 text-xs">
              Retry attempt: {retryCount}/3
            </span>
          )}
        </div>
      </div>

      {/* Contest List */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw size={40} className="text-blue-700 animate-spin mb-4" />
            <p className="text-center text-gray-600 text-lg">Loading GeeksforGeeks contests...</p>
            <p className="text-center text-gray-500 text-sm mt-2">
              Fetching from multiple sources...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-8 max-w-md text-center">
              <AlertCircle size={48} className="text-orange-600 mx-auto mb-4" />
              <p className="text-orange-800 font-semibold mb-3">Loading Contest Data</p>
              <p className="text-orange-700 text-sm mb-4">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => fetchContests(true)}
                  className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors w-full"
                >
                  Retry Now
                </button>
                <button
                  onClick={forceRefresh}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors w-full"
                >
                  Force Generate Data
                </button>
              </div>
            </div>
          </div>
        ) : displayedContests.length > 0 ? (
          <div className="space-y-6">
            {displayedContests.map((contest, idx) => {
              const status = getContestStatus(contest);
              const timeUntil = !isPast ? getTimeUntilStart(contest.startTime) : null;
              
              return (
                <div
                  key={contest.platformId || contest.id || idx}
                  className={`bg-white shadow-md rounded-xl p-6 border-2 ${status.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-5 flex-1">
                      {/* Contest Icon */}
                      <div className="flex flex-col items-center space-y-2 pt-2">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          GFG
                        </div>
                        {status.status === 'live' && (
                          <div className="flex items-center space-x-1 text-xs">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color} bg-opacity-20 ${status.bg}`}>
                            {status.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} className="text-green-600" />
                              <span>
                                {new Date(contest.startTime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={16} className="text-green-600" />
                              <span>
                                {new Date(contest.startTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {contest.duration && (
                              <div className="flex items-center space-x-2">
                                <Timer size={16} className="text-green-600" />
                                <span>{contest.duration} min</span>
                              </div>
                            )}
                          </div>

                          {!isPast && timeUntil && timeUntil !== 'Started' && (
                            <div className="flex items-center space-x-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <span className="text-blue-700 font-semibold">
                                Starts in {contest.timeUntilStart || timeUntil}
                              </span>
                            </div>
                          )}

                          {contest.description && (
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                              {contest.description.length > 200 
                                ? `${contest.description.substring(0, 200)}...` 
                                : contest.description
                              }
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {contest.company && (
                              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                <Users size={14} />
                                <span>{contest.company}</span>
                              </div>
                            )}
                            {contest.source && (
                              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                                <span>Source: {contest.source}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3 ml-5">
                      <a 
                        href={contest.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors group"
                        title="Open contest"
                      >
                        <ArrowRight 
                          className="text-green-700 group-hover:text-green-900 transition-colors" 
                          size={20} 
                        />
                      </a>
                      {status.status === 'live' && (
                        <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                          <Play size={12} />
                          <span>JOIN NOW</span>
                        </button>
                      )}
                      {status.status === 'upcoming' && (
                        <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                          <Calendar size={12} />
                          <span>REGISTER</span>
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
              <Lightbulb size={56} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold mb-3">
                No {isPast ? 'past' : 'upcoming'} contests available
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {isPast 
                  ? 'Past GeeksforGeeks contests will appear here once loaded.' 
                  : 'Upcoming GeeksforGeeks contests will appear here when available.'
                }
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => fetchContests(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full"
                >
                  <RefreshCw size={16} className="inline mr-2" />
                  Refresh Data
                </button>
                <button
                  onClick={forceRefresh}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors w-full"
                >
                  Generate Fresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-700 via-green-600 to-green-500 px-6 py-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <button
            className={`flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 ${
              isPast 
                ? "bg-green-800 hover:bg-green-900 text-white shadow-lg" 
                : "bg-green-900 hover:bg-green-950 text-green-100"
            }`}
            onClick={() => setIsPast(!isPast)}
          >
            <Timer size={20} className="text-green-300" />
            <span className="text-sm font-semibold">
              {isPast ? "Show Upcoming" : "Show Past"}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
              {isPast ? contests.upcoming.length : contests.past.length}
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-white text-sm">
              <Trophy size={16} className="text-yellow-400" />
              <span>{displayedContests.length} contests</span>
            </div>
            <div className="flex items-center space-x-2 text-white text-sm">
              <div className={`w-3 h-3 rounded-full ${
                refreshing ? 'bg-yellow-400 animate-pulse' : 
                error ? 'bg-red-400' : 'bg-green-400'
              }`}></div>
              <span className="text-xs">
                {refreshing ? 'Updating...' : error ? 'Error' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {refreshing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl flex items-center space-x-4">
            <RefreshCw size={24} className="text-green-600 animate-spin" />
            <div>
              <p className="text-gray-800 font-semibold">Refreshing contests...</p>
              <p className="text-gray-600 text-sm">Fetching latest GeeksforGeeks data</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeeksForGeeksPage;