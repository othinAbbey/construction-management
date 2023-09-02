import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Materials from "./components/Materials.jsx";

import Header from "../src/components/Header.jsx";
import Footer from "./components/Footer";
import Time from "./components/Time.jsx";
import Adverts from "./components/adverts.jsx";
import Sidebar from "./components/SideBar.jsx";
import Content from "./components/content.jsx";

import "./App.css";
const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Time />
        <div className="mainDivs">
          <Sidebar />
          <Content />
          <Adverts />

          {/* <div className="mainBody"></div> */}
        </div>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/Materials" element={<Materials />} /> */}
          {/* <Route path="/Projects" element={<Project />} /> */}
          {/* <Route path="/About" element={<About />} /> */}
          {/* <Route path="/contactus" element={<Contactus />} /> */}
          Other routes
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
