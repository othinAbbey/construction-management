import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const structures = [
  { structure: "Internal Wall", materials: ["Bricks/Block", "Mortar"] },
  {
    structure: "Concrete",
    materials: ["Aggregate", "Sand", "Cement", "Water"],
  },
  { structure: "Mortar", materials: ["Cement", "Sand", "Water"] },
  { structure: "Foundation", materials: ["Bricks/Blocks", "Mortar"] },
  { structure: "Slab", materials: ["Aggregate", "Sand", "cement"] },
];

// Replace this with your actual logic to fetch materials
const fetchMaterials = (selectedStructure, dimensions) => {
  // Mock data for demonstration purposes
  const mockMaterials = [
    { unit: "pcs", quantity: 12, rate: 250, total: 500 },
    { unit: "kg", quantity: 10, rate: 3000, total: 150 },
    { unit: "pcs", quantity: 10, rate: 50, total: 500 },
    { unit: "kg", quantity: 5, rate: 30, total: 150 },
    // Add more materials as needed
  ];

  return mockMaterials;
};

function QuantityCalculator() {
  const [selectedStructure, setselectedStructure] = useState("");
  // const [structure, setStructure] = useState();
  const [mat, setMat] = useState("");
  const [selectedMaterial, setselectedMaterial] = useState("");
  const [brick, setBrick] = useState("");
  const [structureLength, setstructureLength] = useState("");
  const [structureHeight, setstructureHeight] = useState("");
  const [structureWidth, setstructureWidth] = useState("");
  const [calculatedQuantity, setCalculatedQuantity] = useState("");
  const [brickDimensions, setBrickDimensions] = useState("");
  const [brickLength, setBrickLength] = useState("");
  const [brickWidth, setBrickWidth] = useState("");
  const [brickHeight, setBrickHeight] = useState("");
  const [dimensions, setDimensions] = useState({
    length: 0,
    height: 0,
    width: 0,
  });
  const [materials, setMaterials] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const handleStructureChange = (event) => {
    const structure = event.target.value;
    setselectedStructure(structure);
    // Reset dimensions and materials when structure changes
    setDimensions({ length: 0, height: 0, width: 0 });
    setMaterials([]);
  };

  const handleDimensionChange = (dimension, value) => {
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      [dimension]: value,
    }));
  };

  const handleCalculate = () => {
    // Perform calculations and update materialDetails and grandTotal
    // You need to replace the following example calculations with your logic
    // const calculatedDetails = structures
    //   .find((structure) => structure.structure === selectedStructure)
    //   ?.materials.map((material) => {
    //     const quantity = calculateQuantity(material, dimensions);
    //     const total = quantity * material.rate;
    //     return {
    //       material: material,
    //       quantity: quantity,
    //       total: total,
    //     };
    //   });

    // Fetch materials data for the selected structure based on dimensions
    // You may need to implement a function to fetch materials from your backend

    // Example: Fetch materials based on selectedStructure and dimensions
    const materialsData = fetchMaterials(selectedStructure, dimensions);

    // Update materials state with the fetched data
    setMaterials(materialsData);

    // Calculate grand total
    const total = materialsData.reduce(
      (acc, material) => acc + material.total,
      0
    );
    setGrandTotal(total);
  };

  async function handlecalCulateMaterial(req, res) {
    const response = await fetch("http://localhost:8000/Quantities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        structure: selectedStructure,
        brick: brick,
        length: dimensions.length,
        height: dimensions.height,
        width: dimensions.width,
      }),
    });

    if (response.ok) {
      // Parse the response JSON
      const data = await response.json();

      // Set the calculated quantity in state
      setCalculatedQuantity(data.numberOfBricks);
      setBrickDimensions(data.dimensions);
      console.log(calculatedQuantity);
      console.log(brickDimensions);
    } else {
      console.error("Failed to make POST request");
    }

    console.log(selectedStructure);
    console.log(brick);
    console.log(dimensions.length);
    console.log(dimensions.height);
    console.log(dimensions.width);
  }

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-xl mb-4">Let's get those quantities calculated</h1>
      <form>
        {/* Add a dropdown for selecting structure */}
        <select
          onChange={handleStructureChange}
          value={selectedStructure}
          // ... other attributes
        >
          {/* Render options based on available structures */}
          {structures.map((structure, index) => (
            <option key={index} value={structure.structure}>
              {structure.structure}
            </option>
          ))}
        </select>

        {/* Render input fields for dimensions */}
        <div>
          <input
            type="text"
            placeholder="Length"
            value={dimensions.length}
            onChange={(e) => handleDimensionChange("length", e.target.value)}
          />
          <input
            type="text"
            placeholder="Height"
            value={dimensions.height}
            onChange={(e) => handleDimensionChange("height", e.target.value)}
          />
          <input
            type="text"
            placeholder="Width"
            value={dimensions.width}
            onChange={(e) => handleDimensionChange("width", e.target.value)}
          />
          <button type="button" onClick={handlecalCulateMaterial}>
            Calculate
          </button>
        </div>
      </form>

      {/* Display table with materials */}
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through materials of the selected structure to generate rows */}
          {structures
            .find((s) => s.structure === selectedStructure)
            ?.materials.map((material, index) => (
              <tr key={index}>
                <td>{material}</td>
                {/* Add logic here to fetch actual unit, quantity, rate, and total data */}
                <td>
                  {fetchMaterials(selectedStructure, dimensions)[index].unit}
                </td>
                <td>
                  {
                    fetchMaterials(selectedStructure, dimensions)[index]
                      .quantity
                  }
                </td>
                <td>
                  {fetchMaterials(selectedStructure, dimensions)[index].rate}
                </td>
                <td>
                  {fetchMaterials(selectedStructure, dimensions)[index].total}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Grand Total</td>
            <td>{grandTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default QuantityCalculator;
