import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Materials from "./Materials";
import "./Content.css";

function Content() {
  return (
    <div>
      <Routes>
        <Route path="/Materials" element={<Materials />} />
      </Routes>
    </div>
  );
}
export default Content;
