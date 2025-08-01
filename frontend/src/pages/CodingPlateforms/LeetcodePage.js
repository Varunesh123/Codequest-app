import React, { useEffect, useState } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { BiTimeFive } from 'react-icons/bi';
import { FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LeetcodePage = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [isPast, setIsPast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leetcode/contests");
        const data = await res.json();
        setContests({
          upcoming: data.upcomingContests,
          past: data.pastContests,
        });
      } catch (err) {
        setError("Failed to fetch contests.");
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const displayedContests = isPast ? contests.past : contests.upcoming;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Nav */}
      <div className="bg-[#0d1117] text-white px-4 py-4 flex items-center space-x-3">
        <FiArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
            <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
            <div className="w-2 h-3 bg-red-500 rounded-sm"></div>
          </div>
          <h2 className="text-lg font-semibold">LeetCode Contests</h2>
        </div>
      </div>

      {/* Contest List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {loading && <p className="text-center text-gray-500">Loading contests...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {displayedContests?.length > 0 ? (
          displayedContests.map((contest, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-4 flex items-start justify-between border border-gray-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex space-x-1 pt-1">
                  <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                  <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-3 bg-red-500 rounded-sm"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{contest.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(contest.startTime).toLocaleDateString()} – {new Date(contest.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <a href={contest.url} target="_blank" rel="noreferrer">
                <FiArrowRight className="text-gray-400 mt-1" size={18} />
              </a>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-400">No contests found.</p>
        )}
      </div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117] px-4 py-3 flex justify-between items-center z-50">
        <button
          className={`flex items-center text-white space-x-2 px-4 py-2 rounded-full ${isPast ? "bg-blue-600" : "bg-[#151a22]"}`}
          onClick={() => setIsPast(!isPast)}
        >
          <BiTimeFive size={18} />
          <span className="text-sm font-medium">
            {isPast ? "Upcoming Contests" : "Past Contests"}
          </span>
        </button>
        <button className="text-white p-3 bg-[#151a22] rounded-full">
          <FaLightbulb size={18} />
        </button>
      </div>
    </div>
  );
};

export default LeetcodePage;
