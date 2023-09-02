import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import CSS module for styling

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Materials", path: "/Materials" },
    { name: "Projects", path: "/Projects" },
    { name: "Contact us", path: "/Contactus" },
    { name: "About", path: "/About" },
    { name: "Tasks", path: "/Tasks" },
    { name: "Gallery", path: "/Gallery" },
  ];
  return (
    <div>
      <button className="menu-btn" onClick={toggleMenu}>
        {" "}
        Menu
      </button>
      <div className={`sidebar ${menuOpen ? "open" : " "}`}>
        <ul className="sidebar-links">
          {links.map((link) => (
            <li key={link.name}>
              <Link className="link" to={link.path}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
