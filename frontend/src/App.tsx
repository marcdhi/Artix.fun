import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateMeme from "./components/CreateMeme";
import Leaderboard from "./components/Leaderboard";
import MyPage from "./components/MyPage";
import ExploreMemes from "./components/ExploreMemes";
import "./App.css";

function App() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMeme />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/explore" element={<ExploreMemes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
