import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import CSS module for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="link">
        Home
      </Link>
      <Link to="/Materials" className="link">
        Materials
      </Link>
      <Link to="/projects" className="link">
        Projects
      </Link>
      <Link to="/contactus" className="link">
        Contact us
      </Link>
      <Link to="/about" className="link">
        About
      </Link>
    </div>
  );
};

export default Sidebar;
