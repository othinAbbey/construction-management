import React, { useState } from 'react';
import { regions, materials, searchResults } from "./data";


const YourFormComponent = () => {
  const [formData, setFormData] = useState({
    regionName: '',
    materials: [{ name: '' }]
  });

//////////////////////////////////////////////////

  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSubMaterial, setSelectedSubMaterial] = useState('');

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
    // Reset sub-material when material changes
    setSelectedSubMaterial('');
  };

  const handleSubMaterialChange = (e) => {
    setSelectedSubMaterial(e.target.value);
  };

  const subMaterials = selectedMaterial
    ? materials.find((material) => material.value === selectedMaterial)?.subMaterials
    : [];
  ///////////////////////////////////////////////////


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
    {/* <form className="max-w-md mx-auto p-4 border rounded bg-gray-200" onSubmit={handleSubmit}> */}
      <label htmlFor="RegionName">Enter Region</label>
      
  {/* <select  className="w-full border rounded py-2 px-2 mb-3"
        type="text"
        name="regionName"
        value={formData.regionName}
        placeholder="Enter Region"
        onChange={(e) => setFormData({ ...formData, regionName: e.target.value })}>
{regions.map((region) => (
        <option value={region.value} key={region.value}>
          {region.value}
        </option>
      ))}
</select> */}

<select id="materialSelect" onChange={handleMaterialChange} value={selectedMaterial}>
        {materials.map((material, index) => (
          <option key={index} value={material.value}>
            {material.value}
          </option>
        ))}
      </select>


      {/* {formData.materials.map((material, index) => (
        <div key={index}>
          <label htmlFor={`material-${index}`}>Material {index + 1}</label>
          
<select  className="w-full border rounded py-2 px-3 mb-3"
            type="text"
            name={`material-${index}`}
            value={material.name}
            placeholder="Enter Material"
            onChange={(e) => handleInputChange(e, index)}>
{materials.map((material) => (
        <option value={material.value} key={material.value}>
          {material.value}
        </option>
      ))}

</select>

        </div>
      ))} */}


{selectedMaterial && subMaterials.length > 0 && (
        <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
          <label htmlFor="subMaterial" className="block mb-2 font-bold text-gray-800">Sub-Material:</label>
          <select
          id="regionName"
          className="w-full border rounded py-2 px-3 mb-3"
          onChange={handleMaterialChange}
          value={selectedMaterial}
          >
            <option value="">-- Select Sub-Material --</option>
            {subMaterials.map((subMaterial, index) => (
              <option key={index} value={subMaterial}>
                {subMaterial}
              </option>
            ))}
          </select>
          {/* </form> */}
        </div>
      )}



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
