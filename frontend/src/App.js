import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Codeforces from './pages/CodingPlateforms/CodeforcePage.js'
import Leetcode from "./pages/CodingPlateforms/LeetcodePage.js";
import Codechef from "./pages/CodingPlateforms/CodechefPage.js";
import GeeksForGeeks from "./pages/CodingPlateforms/GeeksForGeeksPage.js";
import HackerEarth from "./pages/CodingPlateforms/HackerEarthPage.js";
import QuickPracticePage from "./pages/OtherPages/QuickPracticePage.jsx";
import BeginnerPage from "./pages/OtherPages/BeginnerPage.jsx";
import AchievementPage from "./pages/OtherPages/AchievementPage.jsx";
import DSARoadmap from "./pages/OtherPages/DSARoadmap.jsx";
import ProfileSetting from "./pages/ProfileSetting.jsx";
import MorePlateformPage from "./pages/OtherPages/MorePlateformPage.jsx";  

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leetcode" element={<Leetcode />} />
        <Route path="/codeforces" element={<Codeforces />} />
        <Route path="/codechef" element={<Codechef />} />
        <Route path="/geeksforgeeks" element={<GeeksForGeeks />} />
        <Route path="/hackerearth" element={<HackerEarth />} />
        <Route path="/practice" element={<QuickPracticePage />} />
        <Route path="/beginner" element={<BeginnerPage />} />
        <Route path="/achievements" element={<AchievementPage />} />
        <Route path="/roadmap" element={<DSARoadmap />} />
        <Route path="/setting" element={<ProfileSetting />} />
        <Route path="/platforms" element={<MorePlateformPage />} />
      </Routes>
    </Router>
  );
}

export default App;
