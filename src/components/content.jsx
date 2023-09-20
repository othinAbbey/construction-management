import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Materials from "./Materials";
import Projects from "./Projects/Projects";
import NewProjects from "./Projects/NewProject";
import { About } from "./About/About";
import Estimation from "./Estimation/Estimation.jsx";
// import "./Content.css";

function Content() {
  return (
    <div className="w-full sm:max-w-1/5 px-4 py-0 mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Materials" element={<Materials />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/NewProjects" element={<NewProjects />} />
        <Route path="/About" element={<About />} />
        <Route path="/Estimation" element={<Estimation />} />
      </Routes>
    </div>
  );
}
export default Content;
