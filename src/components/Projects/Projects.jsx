import "./Projects.scss";
import React from "react";
import { ReactDOM } from "react";
import { Route } from "react-router-dom";
import NewProjects from "./NewProject";
import { Routes, Link } from "react-router-dom";
function Projects() {
  return (
    <Routes>
      <Route to="/NewProjects">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          New Project
        </button>
      </Route>
      <Route path="/NewProjects" element={<NewProjects />} />
    </Routes>
  );
}

export default Projects;
