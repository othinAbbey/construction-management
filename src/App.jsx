import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Materials from "./components/Materials.jsx";

import Header from "../src/components/Header.jsx";
import Footer from "./components/Footer";
import Time from "./components/Time.jsx";
import Adverts from "./components/adverts.jsx";
import Sidebar from "./components/SideBar.jsx";
import Content from "./components/content.jsx";

// import "./App.css";
const App = () => {
  return (
    <div className="h-100vh max-sm:flex flex-col jjustify-items-center  ">
      <Router>
        <div>
          <Header />
          <Time />
          <div className="display flex flex-col sm:flex-row  ">
            <Sidebar />
            <Content />
            <Adverts />
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default App;
