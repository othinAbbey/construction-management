import React, { useState } from "react";

function Estimation() {
  const works = [
    {
      name: "Excavation",
      value: "excavation",
    },
    {
      name: "Concrete",
      value: "concrete",
    },
    {
      name: "Block Work",
      value: "blockwork",
    },
    {
      name: "Brick Work",
      value: "brickwork",
    },
    {
      name: "Plaster",
      value: "plaster",
    },
  ];

  const [selectedWork, setSelectedWork] = useState("");
  const [listedWorks, setlistedWorks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedWork(value);
    if (listedWorks.includes(value)) {
      alert("Already selected");
    } else {
      listedWorks.push(value);
    }
    console.log(listedWorks);
    // console.log(value);
    //   setFormData({
    //     ...formData,
    //     [name]: value,
    //   });
  };

  return (
    <div>
      <h1>Estimation</h1>
      <div>
        <label>Scope of Work:</label>
        <select
          name="scopeOfWork"
          //   value={formData.scopeOfWork}
          onChange={handleChange}
          className="border rounded p-1"
        >
          <option value="">Select Scope of Work</option>
          {works.map((work, index) => (
            <option key={index} value={work.value}>
              {work.name}
            </option>
          ))}
        </select>
      </div>

      <h2>Calculate Work</h2>
      <div>
        {selectedWork === "excavation" && (
          <>
            <label htmlFor="length">Length</label>
            <input type="number" id="length" />
          </>
        )}
      </div>
    </div>
  );
}

export default Estimation;
