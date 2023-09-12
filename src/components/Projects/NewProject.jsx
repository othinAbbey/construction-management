import React, { useState } from "react";

function ExcavationForm({ calculateTotal, formData, handleInputChange }) {
  return (
    <form onSubmit={calculateTotal}>
      <label htmlFor="length">Length:</label>
      <input
        type="text"
        id="length"
        name="length"
        placeholder="Length"
        value={formData.length}
        onChange={handleInputChange}
      />
      <label htmlFor="width">Width:</label>
      <input
        type="text"
        id="width"
        name="width"
        placeholder="Width"
        value={formData.width}
        onChange={handleInputChange}
      />
      <label htmlFor="depth">Depth:</label>
      <input
        type="text"
        id="depth"
        name="depth"
        placeholder="Depth"
        value={formData.depth}
        onChange={handleInputChange}
      />
      <button type="submit">Calculate Total</button>
    </form>
  );
}

function BrickworkForm({ calculateTotal, formData, handleInputChange }) {
  return (
    <form onSubmit={calculateTotal}>
      <label htmlFor="wallThickness">Wall Thickness:</label>
      <input
        type="text"
        id="wallThickness"
        name="wallThickness"
        placeholder="Wall Thickness"
        value={formData.wallThickness}
        onChange={handleInputChange}
      />
      <label htmlFor="wallLength">Wall Length:</label>
      <input
        type="number"
        id="wallLength"
        name="wallLength"
        placeholder="Wall Length"
        value={formData.wallLength}
        onChange={handleInputChange}
      />
      <button type="submit">Calculate Total</button>
    </form>
  );
}
function BlockworkForm({ calculateTotal, formData, handleInputChange }) {
  return (
    <form onSubmit={calculateTotal}>
      <label htmlFor="blockWallThickness">Block Thickness:</label>
      <input
        type="number"
        name="blockWallThickness"
        value={formData.blockWallThickness}
        placeholder="Enter Block Wall Thickness"
        onChange={handleInputChange}
      />
      <label htmlFor="blockWallLength">Block Wall Length:</label>
      <input
        type="number"
        name="blockWallLength"
        value={formData.blockWallLength}
        placeholder="Enter Block Wall Length"
        onChange={handleInputChange}
      />
      <button type="submit">Calculate Total</button>
    </form>
  );
}
function NewProjects() {
  const [formData, setFormData] = useState({
    scopeOfWork: "",
    length: "",
    width: "",
    depth: "",
    wallThickness: "",
    wallLength: "",
    quantity: "",
    blockWallLength: "",
    blockWallThickness: "",
    // Add more input fields here
  });

  const [selectedScopeOfWork, setSelectedScopeOfWork] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Function to handle changes in the selected scope of work
  const handleScopeOfWorkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to calculate and update the total based on input values
  const calculateTotal = (e) => {
    e.preventDefault();
    // Perform the calculation based on the selected scopes of work
    let newTotal = 0;

    if (selectedScopeOfWork.includes("excavation")) {
      newTotal +=
        parseFloat(formData.length) *
        parseFloat(formData.width) *
        parseFloat(formData.depth);
    }

    if (selectedScopeOfWork.includes("brickwork")) {
      newTotal +=
        parseFloat(formData.wallThickness) * parseFloat(formData.length);
    }

    // Add calculations for other scopes of work as needed

    setTotalQuantity(newTotal);
  };

  // Function to handle the form submission
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to add a selected scope of work to the list
  const addScopeOfWork = () => {
    setSelectedScopeOfWork([...selectedScopeOfWork, formData.scopeOfWork]);
    setFormData({ ...formData, scopeOfWork: "" });
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
      <h1 className="text-xl font-bold">Works Section</h1>
      <div>
        <label htmlFor="scopeOfWork">Works:</label>
        <select
          id="scopeOfWork"
          name="scopeOfWork"
          onChange={(e) => setSelectedScopeOfWork(e.target.value)}
          value={selectedScopeOfWork}
        >
          <option value=" ">Select</option>
          <option value="excavation">Excavation</option>
          <option value="brickwork">Brick Work</option>
          <option value="blockwork">Block Work</option>
          <option value="plastering">Plastering</option>
          <option value="Concrete">Concrete</option>
          {/* ... options ... */}
        </select>

        <button type="button" onClick={addScopeOfWork}>
          Add Scope of Work
        </button>
      </div>
      {/* {selectedScopeOfWork === "excavation" && (
        <div>
          <h2 className="text-lg font-bold">Scope of Work: Excavation</h2>
          <ExcavationForm
            calculateTotal={calculateTotal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      )}

      {selectedScopeOfWork === "brickwork" && (
        <div>
          <h2 className="text-lg font-bold">Scope of Work: Brick Work</h2>
          <BrickworkForm
            calculateTotal={calculateTotal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      )} */}
      {/* Render other scope of work forms as needed */}
      {selectedScopeOfWork === "excavation" && (
        <div>
          <h2 className="text-lg font-bold">Scope of Work: Excavation</h2>
          <ExcavationForm
            calculateTotal={calculateTotal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      )}

      {selectedScopeOfWork === "brickwork" && (
        <div>
          <h2 className="text-lg font-bold">Scope of Work: Brick Work</h2>
          <BrickworkForm
            calculateTotal={calculateTotal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      )}

      {selectedScopeOfWork === "blockwork" && (
        <div>
          <h2 className="text-lg font-bold">Scope of Work: Block Work</h2>
          <BlockworkForm
            calculateTotal={calculateTotal}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      )}

      {/* Render other scope of work forms as needed */}
      {/* Render other scope of work forms as needed */}

      <p>Total: {totalQuantity}</p>
    </div>
  );
}

export default NewProjects;
