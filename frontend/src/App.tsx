import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateMeme from "./components/CreateMeme";
import MyPage from "./components/MyPage";
import ExploreMemes from "./components/ExploreMemes";
import UserRanking from "./components/UserRanking";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateMeme />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/explore" element={<ExploreMemes />} />
          <Route path="/user-ranking" element={<UserRanking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
