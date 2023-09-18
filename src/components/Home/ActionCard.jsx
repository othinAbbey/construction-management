import React, { useState } from "react";
import "../MaterialsCalc/MaterialCard.css";
function ActionCard(props) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <>
      <div className="Material-Card">
        <div className="Material Image">{props.icon}</div>
        <div className="item-details">
          <h3>{props.title}</h3>
          <p>
            {showFullDescription
              ? props.fullDescription
              : props.shortDescription}
          </p>
          <button onClick={toggleFullDescription}>
            {showFullDescription ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ActionCard;
