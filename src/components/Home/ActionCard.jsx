import React from "react";
import "../MaterialsCalc/MaterialCard.css";
function ActionCard(props) {
  return (
    <>
      <div className="Material-Card">
        <div className="Material Image">{props.icon}</div>
        <div className="item-details">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    </>
  );
}

export default ActionCard;
