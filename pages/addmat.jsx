// import React, { useState } from 'react';
// import { regions, materials, searchResults } from "./data";


// const YourFormComponent = () => {
//   const [formData, setFormData] = useState({
//     regionName: '',
//     materials: [{ name: '' }]
//   });

// //////////////////////////////////////////////////

// const [selectedMaterial, setSelectedMaterial] = useState('');
// const [selectedRegion, setSelectedRegion] = useState('');
// const [selectedSubMaterial, setSelectedSubMaterial] = useState('');

//   const handleMaterialChange = (e) => {
//     setSelectedRegion(e.target.value);
//     // Reset sub-material when material changes
//     setSelectedMaterial('');
//   };

//   const handleRegionChange = (e) => {
//     setSelectedSubMaterial(e.target.value);
//   };

//   const subMaterials = selectedMaterial
//     ? materials.find((material) => material.value === selectedMaterial)?.subMaterials
//     : [];
//   ///////////////////////////////////////////////////


//   const handleInputChange = (e, index) => {
//     const { value } = e.target;
//     const updatedMaterials = [...formData.materials];
//     updatedMaterials[index] = { name: value };
//     setFormData({ ...formData, materials: updatedMaterials });
//   };

//   const addMaterialInput = () => {
//     setFormData({ ...formData, materials: [...formData.materials, { name: '' }] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Filtering out empty material inputs
//     const formattedData = {
//       name: formData.regionName,
//       materials: formData.materials.filter((material) => material.name.trim() !== '')
//     };

//     try {
//       const response = await fetch('http://localhost:8000/api/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formattedData)
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Data created:', data);
//         // Update UI or perform additional actions as needed
//       } else {
//         throw new Error('Network response was not ok.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle error (display message, retry logic, etc.)
//     }
//   };
  
//   return (
//     <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
//       <form  className="max-w-md mx-auto p-4 border rounded bg-gray-200" onSubmit={handleSubmit}>
//     {/* <form className="max-w-md mx-auto p-4 border rounded bg-gray-200" onSubmit={handleSubmit}> */}
//       <label htmlFor="RegionName" className="block mb-2 font-bold text-gray-800">Enter Region</label>
      


// <select id="materialSelect" onChange={handleRegionChange} value={selectedMaterial}>
//         {regions.map((material, index) => (
//           <option key={index} value={material.value}>
//             {material.value}
//           </option>
//         ))}
//       </select>

// {selectedRegion  > 0 && (
//         <div >
//           <label htmlFor="subMaterial" className="block mb-2 font-bold text-gray-800">Material:</label>
//           <select
//           id="regionName"
//           className="block mb-2 text-gray-800"
//           onChange={handleMaterialChange}
//           value={selectedRegion}
//           >
//             <option value="">-- Select Material --</option>
//             {materials.map((subMaterial, index) => (
//               <option key={index} value={subMaterial}>
//                 {subMaterial}
//               </option>
//             ))}
//           </select>
//           {/* </form> */}
//         </div>
//       )}



//       <button
//         className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         type="submit"
//       >
//         Submit
//       </button>
//       <button
//         className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"

// type="button"
//         onClick={addMaterialInput}
//       >
//         Add Material
//       </button>
//     </form>
    
//     </div>
//   );
// };

// export default YourFormComponent;




import React, { useState } from 'react';
import { regions, materials, searchResults } from "./data";

const YourFormComponent = () => {
  const [formData, setFormData] = useState({
    regionName: '',
    subRegion: '',
    supplierName: '',
    contacts: [''],
    material: '',
    subMaterial: '',
    price: '',
    materials: [{ name: '' }]
  });

  const handlePhoneChange = (e, index) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = e.target.value;
    setFormData({ ...formData, contacts: updatedContacts });
  };
  const handleAddContact = () => {
    setFormData({ ...formData, contacts: [...formData.contacts, ''] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Code for submitting form data (fetch API call) goes here
    try {
      // Sample fetch call
      const response = await fetch('http://localhost:8000/api/createSupplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Supplier created:', data);
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
        <label htmlFor="regionName" className="block mb-2 font-bold text-gray-800">Select Region</label>
        <select
          id="regionName"
          name="regionName"
          className="w-full border rounded py-2 px-2 mb-3"
          onChange={handleInputChange}
          value={formData.regionName}
        >
          {regions.map((region, index) => (
            <option key={index} value={region.value}>
              {region.value}
            </option>
          ))}
        </select>

        {formData.regionName !== '-- Select Region --' && (
          <div>
            <label htmlFor="subRegion" className="block mb-2 font-bold text-gray-800">Select Sub-Region</label>
            <select
              id="subRegion"
              name="subRegion"
              className="w-full border rounded py-2 px-2 mb-3"
              onChange={handleInputChange}
              value={formData.subRegion}
            >
              {regions.find(region => region.value === formData.regionName)?.subMaterials.map((subRegion, index) => (
                <option key={index} value={subRegion}>
                  {subRegion}
                </option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor="supplierName" className="block mb-2 font-bold text-gray-800">Supplier Name</label>
        <input
          type="text"
          id="supplierName"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleInputChange}
          className="w-full border rounded py-2 px-2 mb-3"
        />

{formData.contacts.map((contact, index) => (
        <div key={index}>
    {/* <label htmlFor="contacts" className="block mb-2 font-bold text-gray-800">Contacts</label> */}

          <label htmlFor={`contacts-${index}`} className="block mb-2 font-bold text-gray-800">
            Contact {index + 1}
          </label>
          <input
            type="text"
            id={`contacts-${index}`}
            name={`contacts-${index}`}
            value={contact}
            onChange={(e) => handlePhoneChange(e, index)}
            className="w-full border rounded py-2 px-2 mb-3"
          />
        </div>
      ))}
       <button
        className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
        type="button"
        onClick={handleAddContact}
      >
        Add Contact
      </button>



{/* {formData.contacts.map((contact, index) => (
  <div>
    <label htmlFor="contacts" className="block mb-2 font-bold text-gray-800">Contacts</label>
  <input
    type="text"
    id={`contacts-${index}`}
    name="contacts"
    value={contact}
    onChange={(e) => handlePhoneChange(e, index)} // Ensure 'index' is passed
    className="w-full border rounded py-2 px-2 mb-3"
    key={index}
  />
  </div>
))} */}




        {/* <input
          type="text"
          id="contacts"
          name="contacts"
          value={formData.contacts}
          onChange={handleInputChange}
          className="w-full border rounded py-2 px-2 mb-3"
        /> */}

      {/* <label htmlFor="contacts" className="block mb-2 font-bold text-gray-800">Contacts</label>
        {formData.contacts.map((contact, index) => ( 
          <input
            type="text"
            id={`contacts-${index}`}
            name="contacts"
            value={contact}
            onChange={(e) => handlePhoneChange(e, index)}
            className="w-full border rounded py-2 px-2 mb-3"
            key={index}
          /> */}

        <label htmlFor="material" className="block mb-2 font-bold text-gray-800">Select Material</label>
        <select
          id="material"
          name="material"
          className="w-full border rounded py-2 px-2 mb-3"
          onChange={handleInputChange}
          value={formData.material}
        >
          {materials.map((material, index) => (
            <option key={index} value={material.value}>
              {material.value}
            </option>
          ))}
        </select>

        {formData.material !== '-- Select Material --' && (
          <div>
            <label htmlFor="subMaterial" className="block mb-2 font-bold text-gray-800">Select Sub-Material</label>
            <select
              id="subMaterial"
              name="subMaterial"
              className="w-full border rounded py-2 px-2 mb-3"
              onChange={handleInputChange}
              value={formData.subMaterial}
            >
              {materials.find(mat => mat.value === formData.material)?.subMaterials.map((subMat, index) => (
                <option key={index} value={subMat}>
                  {subMat}
                </option>
              ))}
            </select>
          </div>
        )}

        <label htmlFor="price" className="block mb-2 font-bold text-gray-800">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full border rounded py-2 px-2 mb-3"
        />

        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
          Create Supplier
        </button>
      </form>
    </div>
  );
};

export default YourFormComponent;
