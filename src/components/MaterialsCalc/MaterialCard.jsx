import React from "react";
import PropTypes from "prop-types";
import "./MaterialCard.css";
function MaterialCard({ Size, imageSrc, itemType, quantity }) {
  return (
    <div className="Material-Card">
      <img src={imageSrc} alt="Material Image" className="item-image" />
      <div className="item-details">
        <h3>{Size}</h3>
        <h4>{itemType}</h4>
        <h4>{quantity}</h4>
      </div>
    </div>
  );
}
export default MaterialCard;
