import React, { useState } from "react";

function SiteLocation() {
  // State to store the input value
  const [inputValue, setInputValue] = useState("");

  // Function to handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <h2>Site Location</h2>
      <label htmlFor="SiteLocation">SITE LOCATION</label>
      <input
        id="SiteLocation"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter Site Location"
      />
      <p>You typed: {inputValue}</p>
    </div>
  );
}

export default SiteLocation;
