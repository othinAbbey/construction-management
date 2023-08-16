import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../src/components/Header.jsx";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage.jsx";
import Sidebar from "./components/SideBar.jsx";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/land" element={<LandingPage />} />
          {/* Other routes */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
