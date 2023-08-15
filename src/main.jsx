import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import DoubleNavbar from "./componenets/Navbar.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DoubleNavbar />
    <App />
  </React.StrictMode>
);
