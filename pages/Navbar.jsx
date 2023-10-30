"use client";
import Link from "next/link";
import { useState } from "react"; // Import useState for handling the menu state

const buttons = [
  { text: "Home", link: "/" },
  { text: "About Us", link: "/about" },
  { text: "Contact Us", link: "/contact" },
  { text: "Admin", link: "/admin" },
  { text: "LogOut", link: "/logout" },
  { text: "Create Acoount", link: "/newaccount" },


  
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // State to track menu open/close

  return (
    <nav className="bg-blue-500 p-4 flex items-center justify-between fixed top-0 right-0 w-full z-10 ">
      <div className="text-white">
        <img src="./logo.jpg" alt="Logo" />
    </div>

      {/* Toggle the menu button for smaller screens */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden text-white"
      >
        Menu
      </button>

      {/* Display navigation links in a dropdown for smaller screens */}
      {menuOpen && (
        <ul className="lg:hidden flex flex-col space-y-2 bg-blue-500 absolute top-full right-0 mt-1">
          {buttons.map((button, index) => (
            <li key={index}>
              <Link href={button.link} className="block py-2 px-4 text-white">
                {button.text}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Display navigation links for medium and larger screens */}
      <ul className={`lg:flex space-x-4 hidden `}>
        {buttons.map((button, index) => (
          <li key={index}>
            <Link href={button.link} className="text-white">
              {button.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
