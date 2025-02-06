import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateMeme from "./components/CreateMeme";
import MyPage from "./components/MyPage";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
