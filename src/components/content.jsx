import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Materials from "./Materials";
// import "./Content.css";

function Content() {
  return (
    <div className="w-full px-4 py-0 sm:w-auto mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Materials" element={<Materials />} />
      </Routes>
    </div>
  );
}
export default Content;
