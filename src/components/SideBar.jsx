import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import CSS module for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="link">
        Home
      </Link>
      <Link to="/about" className="link">
        About
      </Link>
      <Link to="/services" className="link">
        Services
      </Link>
      <Link to="/contact" className="link">
        Contact
      </Link>
    </div>
  );
};

export default Sidebar;
