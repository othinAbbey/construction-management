import React from "react";
import "./minorNav.css";

function MinorNav(props) {
  return (
    <div className="MinorNav">
      <ul>
        {props.items.map((item, index) => (
          <li key={index}>
            <a href={`#${item}`}>{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MinorNav;
