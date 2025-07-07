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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leetcode" element={<Leetcode />} />
        <Route path="/codeforces" element={<Codeforces />} />
        <Route path="/codechef" element={<Codechef />} />
        <Route path="/geeksforgeeks" element={<GeeksForGeeks />} />
        <Route path="/hackerearth" element={<HackerEarth />} />
      </Routes>
    </Router>
  );
}

export default App;
