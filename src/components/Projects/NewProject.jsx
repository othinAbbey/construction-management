import React, { useState } from "react";

function NewProjects() {
  const [formData, setFormData] = useState({
    scopeOfWork: "",
    length: "",
    width: "",
    depth: "",
    height: "",
  });

  const [scopesOfWork, setScopesOfWork] = useState([]);
  const [totals, setTotals] = useState({ excavation: 0, brickwork: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateExcavationVolume = (length, width, depth) => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);

    if (!isNaN(l) && !isNaN(w) && !isNaN(d)) {
      return (l * w * d).toFixed(2);
    } else {
      return "Invalid Input";
    }
  };

  const calculateBrickworkArea = (length, height) => {
    const l = parseFloat(length);
    const h = parseFloat(height);

    if (!isNaN(l) && !isNaN(h)) {
      return (l * h).toFixed(2);
    } else {
      return "Invalid Input";
    }
  };

  const handleAddScopeOfWork = () => {
    if (formData.scopeOfWork) {
      const scopeData = { ...formData };

      if (formData.scopeOfWork === "excavation") {
        scopeData.totalValue = calculateExcavationVolume(
          formData.length,
          formData.width,
          formData.depth
        );
      } else if (formData.scopeOfWork === "brickwork") {
        scopeData.totalValue = calculateBrickworkArea(
          formData.length,
          formData.height
        );
      }

      setScopesOfWork([...scopesOfWork, scopeData]);

      // Update totals based on scope of work
      if (formData.scopeOfWork === "excavation") {
        setTotals({
          ...totals,
          excavation: totals.excavation + parseFloat(scopeData.totalValue),
        });
      } else if (formData.scopeOfWork === "brickwork") {
        setTotals({
          ...totals,
          brickwork: totals.brickwork + parseFloat(scopeData.totalValue),
        });
      }

      setFormData({
        scopeOfWork: "",
        length: "",
        width: "",
        depth: "",
        height: "",
      });
    }
  };

  const handleClearForm = () => {
    setFormData({
      scopeOfWork: "",
      length: "",
      width: "",
      depth: "",
      height: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Project Details</h1>
      <div className="mb-4">
        <label className="block mb-1">Scope of Work:</label>
        <select
          name="scopeOfWork"
          value={formData.scopeOfWork}
          onChange={handleChange}
          className="border rounded p-1"
        >
          <option value="">Select Scope of Work</option>
          <option value="excavation">Excavation</option>
          <option value="brickwork">Brick Work</option>
        </select>
      </div>
      {formData.scopeOfWork === "excavation" && (
        <div className="mb-4">
          <label className="block mb-1">Length:</label>
          <input
            type="text"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="border rounded p-1"
          />
          <label className="block mb-1">Width:</label>
          <input
            type="text"
            name="width"
            value={formData.width}
            onChange={handleChange}
            className="border rounded p-1"
          />
          <label className="block mb-1">Depth:</label>
          <input
            type="text"
            name="depth"
            value={formData.depth}
            onChange={handleChange}
            className="border rounded p-1"
          />
        </div>
      )}
      {formData.scopeOfWork === "brickwork" && (
        <div className="mb-4">
          <label className="block mb-1">Length:</label>
          <input
            type="text"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="border rounded p-1"
          />
          <label className="block mb-1">Height:</label>
          <input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="border rounded p-1"
          />
        </div>
      )}
      <button
        onClick={handleAddScopeOfWork}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Scope of Work
      </button>
      <button
        onClick={handleClearForm}
        className="bg-gray-500 text-white py-2 px-4 rounded ml-2 hover:bg-gray-600"
      >
        Clear Form
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Totals</h2>
        <table className="border-collapse border w-full">
          <thead>
            <tr>
              <th className="border p-2">Scope of Work</th>
              <th className="border p-2">Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Excavation</td>
              <td className="border p-2">
                {totals.excavation.toFixed(2)} cubic meters
              </td>
            </tr>
            <tr>
              <td className="border p-2">Brick Work</td>
              <td className="border p-2">
                {totals.brickwork.toFixed(2)} square meters
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewProjects;
