import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideBar.scss"; // Import CSS module for styling
import { Button, Navbar, Nav } from "react-bootstrap";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(true);

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
    // <div className="relative w-full sm:w-1/5 rounded-lg overflow-hidden mx-aut">
    //   <button onClick={toggleMenu} className=" lg:hidden">
    //     {" "}
    //     Menu
    //   </button>
    //   <div
    //     className={`sidebar  ${
    //       menuOpen ? "translate-x-0" : "-translate-x-full"
    //     } text-blue-500 bg-gray-800 bg-opacity-500  h-full rounded-lg   `}
    //   >
    //     {/* <div className={`sidebar ${menuOpen ? "open" : " "}`}> */}
    //     <ul className="sidebar-links">
    //       {links.map((link) => (
    //         <li key={link.name}>
    //           <Link className="link" to={link.path}>
    //             {link.name}
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
    <div className="relative text-blue-500  w-full h-auto sm:w-1/5 rounded-lg overflow-hidden mx-auto">
      <Navbar expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ul className="mr-auto">
            {links.map((link) => (
              <li key={link.name}>
                <Link className="link" to={link.path}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Sidebar;
