import React, { useState } from "react";

function NewProjects() {
  const [formData, setFormData] = useState({
    scopeOfWork: "",
    length: "",
    width: "",
    depth: "",
    wallThickness: "",
    // Add more input fields here
  });

  const [total, setTotal] = useState(0);

  // Function to handle changes in the selected scope of work
  const handleScopeOfWorkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to calculate and update the total based on input values
  const calculateTotal = () => {
    let newTotal = 0;
    const { scopeOfWork, length, width, depth, wallThickness } = formData;

    if (scopeOfWork === "excavation") {
      newTotal = parseFloat(length) * parseFloat(width) * parseFloat(depth);
    } else if (scopeOfWork === "brickwork" || scopeOfWork === "blockwork") {
      newTotal = parseFloat(wallThickness) * parseFloat(length);
    }

    setTotal(newTotal);
  };

  // Function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotal(); // Calculate the total when the form is submitted
  };

  return (
    <div>
      <label htmlFor="projectName">Project Name:</label>
      <input id="projectName" type="text" placeholder="  Enter Project Name" />
      <label htmlFor="projectLocation">Project Location: </label>
      <input
        id="projectLocation"
        type="text"
        placeholder="  Project Location"
      />
      <label htmlFor="starteDate">Start Date:</label>
      <input id="startDate" type="datetime-local" placeholder=" Start Date" />
      <label htmlFor="completionDate"> Completion Date: </label>
      <input
        id="completionDate"
        type="datetime-local"
        placeholder="Date Of Completion"
      />
      <h3>Scope of Works</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="scopeOfWork">Scope of Works:</label>
          <select
            id="scopeOfWork"
            name="scopeOfWork"
            onChange={handleScopeOfWorkChange}
            value={formData.scopeOfWork}
          >
            <option value="">Select</option>
            <option value="excavation">Excavation</option>
            <option value="brickwork">Brick Work</option>
            <option value="blockwork">Block Work</option>
            <option value="plastering">Plastering</option>
            <option value="Concrete">Concrete</option>
            {/* ... options ... */}
          </select>
        </div>

        {/* Render input fields based on scopeOfWork */}
        {formData.scopeOfWork === "excavation" && (
          <div>
            <label htmlFor="length">Length:</label>
            <input
              type="text"
              id="length"
              name="length"
              placeholder="Length"
              value={formData.length}
              onChange={handleScopeOfWorkChange}
            />
            <label htmlFor="width">Width:</label>
            <input
              type="text"
              id="width"
              name="width"
              placeholder="Width"
              value={formData.width}
              onChange={handleScopeOfWorkChange}
            />
            <label htmlFor="depth">Depth:</label>
            <input
              type="text"
              id="depth"
              name="depth"
              placeholder="Depth"
              value={formData.depth}
              onChange={handleScopeOfWorkChange}
            />
          </div>
        )}

        {["brickwork", "blockwork"].includes(formData.scopeOfWork) && (
          <div>
            <label htmlFor="wallThickness">Wall Thickness:</label>
            <input
              type="text"
              id="wallThickness"
              name="wallThickness"
              placeholder="Wall Thickness"
              value={formData.wallThickness}
              onChange={handleScopeOfWorkChange}
            />
            {/* Add more input fields for Brick Work or Block Work if needed */}
          </div>
        )}

        {/* Add more conditionally rendered sections for other scope of works */}
        {/* ... */}

        <button type="submit">Calculate Total</button>
      </form>

      <p>Total: {total}</p>
    </div>
  );
}

export default NewProjects;
