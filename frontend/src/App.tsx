import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateMeme from "./components/CreateMeme";
import Leaderboard from "./components/Leaderboard";
import MyPage from "./components/MyPage";
import ExploreMemes from "./components/ExploreMemes";
import UserRanking from "./components/UserRanking";
import "./App.css";

function App() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div>
      <div className="flex justify-center items-center h-screen">
        <img src="/logo.svg" alt="logo" className="w-10 h-10" />
      </div>
    </div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create" element={<CreateMeme />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/explore" element={<ExploreMemes />} />
          <Route path="/user-ranking" element={<UserRanking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
