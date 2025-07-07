import React from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { BiTimeFive } from 'react-icons/bi';
import { FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const contests = [
  {
    name: 'EPIC Institute of Technology Round Summer 2025 (Codeforces Round 1036, Div. 1 + Div. 2)',
    date: '06-07-2025',
    time: '08:05 PM',
  },
  {
    name: 'Codeforces Round 1035 (Div. 2)',
    date: '05-07-2025',
    time: '08:05 PM',
  },
  {
    name: 'Codeforces Round 1034 (Div. 3)',
    date: '01-07-2025',
    time: '08:05 PM',
  },
  {
    name: 'Educational Codeforces Round 180 (Rated for Div. 2)',
    date: '23-06-2025',
    time: '08:05 PM',
  },
  {
    name: 'Codeforces Round 1033 (Div. 2) and CodeNite 2025',
    date: '21-06-2025',
    time: '08:05 PM',
  },
  {
    name: 'Codeforces Round 1032 (Div. 3)',
    date: '17-06-2025',
    time: '08:05 PM',
  },
  {
    name: 'Codeforces Round 1031 (Div. 2)',
    date: '16-06-2025',
    time: '08:05 PM',
  },
];

const CodeforcesPage = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Nav */}
      <div className="bg-[#0d1117] text-white px-4 py-4 flex items-center space-x-3">
        <FiArrowLeft size={22} onClick={() => navigate(-1)}/>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
            <div className="w-2 h-5 bg-blue-500 rounded-sm"></div>
            <div className="w-2 h-3 bg-red-500 rounded-sm"></div>
          </div>
          <h2 className="text-lg font-semibold">Codeforces</h2>
        </div>
      </div>

      {/* Contest List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {contests.map((contest, idx) => (
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
                <p className="font-semibold text-gray-900 text-sm">
                  {contest.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {contest.date} – {contest.time}
                </p>
              </div>
            </div>
            <FiArrowRight className="text-gray-400 mt-1" size={18} />
          </div>
        ))}
      </div>

      {/* Fixed Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117] px-4 py-3 flex justify-between items-center z-50">
        <button className="flex items-center text-white space-x-2 px-4 py-2 rounded-full bg-[#151a22]">
          <BiTimeFive size={18} />
          <span className="text-sm font-medium">Past Contest</span>
        </button>
        <button className="text-white p-3 bg-[#151a22] rounded-full">
          <FaLightbulb size={18} />
        </button>
      </div>
    </div>
  );
};

export default CodeforcesPage;
