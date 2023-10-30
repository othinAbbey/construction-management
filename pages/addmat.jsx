import React, { useState } from 'react';

const YourFormComponent = () => {
  const [formData, setFormData] = useState({
    regionName: '',
    materials: [{ name: '' }]
  });

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = { name: value };
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const addMaterialInput = () => {
    setFormData({ ...formData, materials: [...formData.materials, { name: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filtering out empty material inputs
    const formattedData = {
      name: formData.regionName,
      materials: formData.materials.filter((material) => material.name.trim() !== '')
    };

    try {
      const response = await fetch('http://localhost:8000/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data created:', data);
        // Update UI or perform additional actions as needed
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (display message, retry logic, etc.)
    }
  };

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
    <form className="max-w-md mx-auto p-4 border rounded bg-gray-200" onSubmit={handleSubmit}>
      <label htmlFor="RegionName">Enter Region</label>
      <input
        className="w-full border rounded py-2 px-2 mb-3"
        type="text"
        name="regionName"
        value={formData.regionName}
        placeholder="Enter Region"
        onChange={(e) => setFormData({ ...formData, regionName: e.target.value })}
      />
      {formData.materials.map((material, index) => (
        <div key={index}>
          <label htmlFor={`material-${index}`}>Material {index + 1}</label>
          <input
            className="w-full border rounded py-2 px-3 mb-3"
            type="text"
            name={`material-${index}`}
            value={material.name}
            placeholder="Enter Material"
            onChange={(e) => handleInputChange(e, index)}
          />
        </div>
      ))}
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
      <button
        className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
        type="button"
        onClick={addMaterialInput}
      >
        Add Material
      </button>
    </form>
    </div>
  );
};

export default YourFormComponent;
