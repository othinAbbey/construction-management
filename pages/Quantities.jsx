import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Quantities() {
  const [quantities, setQuantities] = useState([
    {
      image: "https://picsum.photos/seed/picsum/200/300",
      name: "Bricks",
      type: "Cement",
      unit: "pcs",
      price: 1000,
      total: 0,
      quantity: 0,
      size: "N/A",
    },
    {
      image: "https://picsum.photos/seed/picsum/200/300",
      name: "Blocks",
      type: "Solid",
      size: "100 X 200 X 400",
      unit: "pcs",
      price: 2000,
      total: 0,
      quantity: 0,
    },
    {
      image: "https://picsum.photos/seed/picsum/200/300",
      name: "Solid Blocks",
      type: "Solid",
      size: "200 X 200 X 400",
      unit: "pcs",
      price: 3000,
      total: 0,
      quantity: 0,
    },
    {
      image: "https://picsum.photos/seed/picsum/200/300",
      name: "Hollow Blocks",
      type: "Hollow",
      size: "200 X 200 X 400",
      unit: "pcs",
      price: 4000,
      total: 0,
      quantity: 0,
    },
    {
      image: "https://picsum.photos/seed/picsum/200/300",
      name: "Solid Blocks",
      type: "Hollow",
      size: "150 X 200 X 400",
      unit: "pcs",
      price: 5000,
      total: 0,
      quantity: 0,
    },
  ]);

  // Function to handle quantity input changes
  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index].quantity = value;
    updatedQuantities[index].total = value * updatedQuantities[index].price;
    setQuantities(updatedQuantities);
  };

  // Function to handle size input changes
  const structures = [
    "Boundary wall",
    "Plinth Wall",
    "Column",
    "Beam",
    "Slab",
    "Staircase",
    "Roof",
    "Lintel",
    "Chajja",
    "Sunshade",
    "Parapet",
    "DPC",
    "Flooring",
    "Plastering",
    "Painting",
    "PCC",
    "RCC",
    "Brickwork",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Steelwork",
    "Waterproofing",
    "Tiles",
    "Marble",
    "Granite",
    "Aluminium",
    "Glasswork",
    "Grillwork",
    "Shuttering",
    "Formwork",
    "False Ceiling",
    "Paving",
    "Landscaping",
    "Compound Wall",
    "Septic Tank",
    "Overhead Tank",
    "Underground Tank",
    "Swimming Pool",
    "Rainwater Harvesting",
   
  ];
  const sand = [
    "River Sand",
    "Pit Sand",
    "M Sand",
    "Robo Sand",
    "Quarry Dust",
    "Crushed Stone Sand",
    "Crushed Gravel Sand",
    "Sea Sand",
    "Slag Sand",
    "Artificial Sand",
    "Plastering Sand",
    "Filter Sand",
    "Bajri",
    "Slag Sand",
    "Artificial Sand",
    "Plastering Sand",
    "Filter Sand",
    "Bajri",
  ];
  const bricks = [
    "Brick",
    "Block",
    "Solid Block",
    "Hollow Block",
    "Solid Block",
    "Hollow Block",
  ];

  const [structure, setStructure] = useState(structures[0]);
  const [brick, setBrick] = useState(bricks[0]);
  const [structureLength, setstructureLength] = useState(0);
  const [structureHeight, setstructureHeight] = useState(0);
  const [structureWidth, setstructureWidth] = useState(0);

  const handleStructureChange = (value) => {
    setStructure(value);
  };

  const handleLengthChange = (value) => {
    setLength(value);
  };

  const handleHeightChange = (value) => {
    setHeight(value);
  };

  const handleWidthChange = (value) => {
    setWidth(value);
  };
  async function handlecalCulateMaterial() {
 // Assuming this code is inside an asynchronous function

// Make a POST request
const  response = await fetch("http://localhost:8000/quantities", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    structure: structure,
    brick: brick,
    length: structureLength,
    height: structureHeight,
    width: structureWidth,
  }),
});

// Check if the POST request was successful
if (response.ok) {
  // Make a GET request after the POST request is completed
  const brickData = await fetch("http://localhost:8000/quantities/calculate", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if the GET request was successful
  if (brickData.ok) {
    const data = await brickData.json();
    console.log(data);
  } else {
    console.error("Failed to fetch brick data");
  }
} else {
  console.error("Failed to make POST request");
}

console.log(structure);
console.log(brick);
console.log(structureLength);
console.log(structureHeight);
console.log(structureWidth);

  };

  

  // Function to handle size input changes

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h6>Hello here, welcome to </h6>
      <select onChange={(e) => handleStructureChange(e.target.value)}>
        <option value="Select Structure"> Select Structure</option>
        {structures.map((structure, index) => (
          <option key={index} value={structure}>
            {structure}
          </option>
        ))}
      </select>

      <form>
        <select onChange={(e) => setBrick(e.target.value)}>
          <option value="Select Brick"> Select Material</option>
          {bricks.map((brick, index) => (
            <option key={index} value={brick}>
              {brick}
            </option>
          ))}
        </select>
        <div>
          <input
            type="text"
            value={structureLength}
            placeholder="Length"
            onChange={(e) => handleLengthChange(e.target.value)}
          />
          <input type="text" value={structureHeight} placeholder="Height" onChange={(e) => handleHeightChange(e.target.value)}/>
          <input type="text" value={structureWidth} placeholder="Width"
          onChange={(e) => handleWidthChange(e.target.value)} />
          <button type="button" onClick={handlecalCulateMaterial}>Calculate</button>
        </div>
      </form>
    </div>
  );
}

export default Quantities;
