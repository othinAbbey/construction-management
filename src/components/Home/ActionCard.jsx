import React from "react";

function ActionCard(props) {
  return (
    <>
      <div className="action-card">
        <div className="action-card__icon">{props.icon}</div>
        <div className="action-card__info">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    </>
  );
}
export default ActionCard;
