import { useNavigate } from "react-router-dom";
import { FaStar, FaCodeBranch } from "react-icons/fa";
import { GiEarthAsiaOceania } from "react-icons/gi";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
} from "react-icons/si";


const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-4 font-sans">
      {/* Top Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col justify-center items-center shadow-md">
          <FaStar size={28} className="mb-2" />
          <p className="text-lg font-medium">Beginner Problems</p>
        </div>
        <div className="bg-red-400 p-6 rounded-2xl flex flex-col justify-center items-center shadow-md">
          <FaCodeBranch size={28} className="mb-2" />
          <p className="text-lg font-medium">DSA RoadMap</p>
        </div>
      </div>

      {/* Contests Section */}
      <h3 className="text-xl font-bold mb-4">Contests</h3>
      <div className="flex flex-col gap-4">
        <ContestCard
          icon={<SiLeetcode size={24} />}
          name="LeetCode"
          onClick={() => handleCardClick("/leetcode")}
        />
        <ContestCard
          icon={<SiCodeforces size={24} />}
          name="CodeForces"
          onClick={() => handleCardClick("/codeforces")}
        />
        <ContestCard
          icon={<SiCodechef size={24} />}
          name="CodeChef"
          onClick={() => handleCardClick("/codechef")}
        />
        <ContestCard
          icon={<SiGeeksforgeeks size={24} />}
          name="GeeksForGeeks"
          onClick={() => handleCardClick("/geeksforgeeks")}
        />
        <ContestCard
          icon={<GiEarthAsiaOceania size={24} />}
          name="HackerEarth"
          onClick={() => handleCardClick("/hackerearth")}
        />
      </div>
    </div>
  );
};

const ContestCard = ({ icon, name, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#1e293b] px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-[#334155] transition-all"
  >
    <div>{icon}</div>
    <p className="text-lg font-medium">{name}</p>
  </div>
);

export default Home;
