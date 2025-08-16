import { FaStar, FaCodeBranch, FaTrophy, FaRocket } from "react-icons/fa";
import { GiEarthAsiaOceania } from "react-icons/gi";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
} from "react-icons/si";

const Home = () => {
  const handleCardClick = (route) => {
    console.log(`Navigating to: ${route}`);
    // In your actual app, replace this with: navigate(route);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white font-sans">
      {/* Container with max width and centered */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Coding Hub
          </h1>
          <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto">
            Master data structures, algorithms, and competitive programming with curated resources
          </p>
        </div>

        {/* Top Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12 lg:mb-16">
          <FeatureCard
            icon={<FaStar size={32} />}
            title="Beginner Problems"
            description="Start your coding journey with carefully selected problems"
            gradient="from-yellow-400 to-orange-500"
            onClick={() => handleCardClick("/beginner")}
          />
          <FeatureCard
            icon={<FaCodeBranch size={32} />}
            title="DSA RoadMap"
            description="Structured learning path for data structures & algorithms"
            gradient="from-red-400 to-pink-500"
            onClick={() => handleCardClick("/roadmap")}
          />
          <FeatureCard
            icon={<FaTrophy size={32} />}
            title="Achievements"
            description="Track your progress and unlock milestones"
            gradient="from-green-400 to-blue-500"
            onClick={() => handleCardClick("/achievements")}
          />
          <FeatureCard
            icon={<FaRocket size={32} />}
            title="Quick Practice"
            description="Daily coding challenges to keep you sharp"
            gradient="from-purple-400 to-indigo-500"
            onClick={() => handleCardClick("/practice")}
          />
        </div>

        {/* Contests Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Contests</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          
          {/* Contest Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ContestCard
              icon={<SiLeetcode size={28} />}
              name="LeetCode"
              description="Weekly contests and daily challenges"
              color="text-yellow-400"
              participants="2M+"
              onClick={() => handleCardClick("/leetcode")}
            />
            <ContestCard
              icon={<SiCodeforces size={28} />}
              name="CodeForces"
              description="Competitive programming contests"
              color="text-blue-400"
              participants="500K+"
              onClick={() => handleCardClick("/codeforces")}
            />
            <ContestCard
              icon={<SiCodechef size={28} />}
              name="CodeChef"
              description="Monthly challenges and cook-offs"
              color="text-orange-400"
              participants="800K+"
              onClick={() => handleCardClick("/codechef")}
            />
            <ContestCard
              icon={<SiGeeksforgeeks size={28} />}
              name="GeeksForGeeks"
              description="Practice problems and tutorials"
              color="text-green-400"
              participants="1.5M+"
              onClick={() => handleCardClick("/geeksforgeeks")}
            />
            <ContestCard
              icon={<GiEarthAsiaOceania size={28} />}
              name="HackerEarth"
              description="Hiring challenges and skill tests"
              color="text-indigo-400"
              participants="600K+"
              onClick={() => handleCardClick("/hackerearth")}
            />
            
            {/* Add More Platforms Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl border border-slate-500/50 hover:border-slate-400 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold">+</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-100">More Platforms</p>
                  <p className="text-sm text-gray-300 mt-2">Discover additional coding platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section for Large Screens */}
        <div className="hidden lg:block mt-16">
          <div className="grid grid-cols-4 gap-8 text-center">
            <StatCard number="10K+" label="Problems Solved" />
            <StatCard number="500+" label="Active Users" />
            <StatCard number="25+" label="Platforms" />
            <StatCard number="95%" label="Success Rate" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group`}
  >
    <div className="text-white">
      <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/90 text-sm">{description}</p>
    </div>
  </div>
);

const ContestCard = ({ icon, name, description, color, participants, onClick }) => (
  <div
    onClick={onClick}
    className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-2xl cursor-pointer hover:from-slate-600 hover:to-slate-500 transition-all duration-300 border border-slate-500/50 hover:border-slate-400 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  >
    <div className="flex items-start gap-4">
      <div className={`${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-white">{name}</h3>
        <p className="text-gray-200 text-sm mb-3">{description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-gray-300">
            {participants} participants
          </span>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-6 rounded-xl border border-slate-500/50">
    <div className="text-3xl font-bold text-blue-400 mb-2">{number}</div>
    <div className="text-gray-200">{label}</div>
  </div>
);

export default Home;