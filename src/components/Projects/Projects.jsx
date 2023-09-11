import "./Projects.scss";
import React from "react";
import { ReactDOM } from "react";
import { Outlet, Route } from "react-router-dom";
import NewProjects from "./NewProject";
import { Routes, Link, useNavigate } from "react-router-dom";
function Projects() {
  const navigate = useNavigate();
  const newProjectsClick = () => {
    navigate("/NewProjects");
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={newProjectsClick}
      >
        New Project
      </button>
    </div>
  );
}

export default Projects;
