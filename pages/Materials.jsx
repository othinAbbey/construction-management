import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Materials() {
  const regions = [
    { value: '-- Select Region --' },
    { value: 'Western' },
    { value: 'Northern' },
    { value: 'West Nile' },
    { value: 'Eastern' }
  ];

  const materials = [
    { value: '-- Select Material --' },
    { value: 'Cement' },
    { value: 'Steel' },
    { value: 'Timber' },
    { value: 'Bricks' },
    { value: 'Tiles' },
    { value: 'Paint' },
    { value: 'Sanitary Fittings' },
    { value: 'Electrical Fittings' },
    { value: 'Roofing Materials' },
    { value: 'Doors' },
    { value: 'Windows' },
    { value: 'Plumbing Materials' },
    { value: 'Glass' },
    { value: 'sand' },
    { value: 'Furniture' },
    { value: 'Flooring Materials' },
    { value: 'Ceiling Materials' },
    { value: 'Insulation Materials' },
    { value: 'Other' }
  ];

  const searchResults = [
    {Material: "sand", Region: "Western", Price: 1000, Unit: "ton", 
    Supplier:[
    {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ]   
    },
    {Material: "sand", Region: "Northern", Price: 2000, Unit: "ton",Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: `Supplier Sand 2`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "sand", Region: "West Nile", Price: 3000, Unit: "ton", Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Sand 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "sand", Region: "Eastern", Price: 4000, Unit: "ton", Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},

    {Material: "Bricks", Region: "Western", Price: 1000, Unit: "ton", 
    Supplier:[
    {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ]
     
    },
    {Material: "Bricks", Region: "Northern", Price: 2000, Unit: "ton",
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Bricks", Region: "West Nile", Price: 3000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Bricks", Region: "Eastern", Price: 4000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
  ]

  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0].value);

  const [regionSelected, setRegionSelected] = useState(false);
  const [materialSelected, setMaterialSelected] = useState(false);

  const[filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setRegionSelected(e.target.value !== regions[0].value);
  };

  // const handleMaterialChange = (e) => {
  //   setSelectedMaterial(e.target.value);
  //   setMaterialSelected(e.target.value !== materials[0].value);
  // };

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
    setMaterialSelected(e.target.value !== materials[0].value);
  
    const filteredResults = searchResults.filter((result) => {
      const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
      const isMaterialMatch =
        (e.target.value === "Other" || result.Material.toLowerCase() === e.target.value.toLowerCase()) && isRegionMatch;
  
      return isMaterialMatch;
    });
  
    // Update the filtered results state
    setFilteredResults(filteredResults);
  };

  const handleSearch = () => {
    const filteredResults = searchResults.filter((result) => {
      const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
      const isMaterialMatch =
        (selectedMaterial === "Other" || result.Material.toLowerCase() === selectedMaterial.toLowerCase()) && isRegionMatch;

      return isMaterialMatch;
    });

    setFilteredResults(filteredResults);
    setShowResults(true);
  };

  const resetSelection = () => {
    setSelectedRegion(regions[0].value);
    setSelectedMaterial(materials[0].value);
    setRegionSelected(false);
    setMaterialSelected(false);
  };

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Materials Search</h1>
      {regionSelected ? (
        <div>
          <h2 className="text-lg font-semibold">
            {selectedRegion} Region has Been Selected
          </h2>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Region</h2>
          <select
            className="w-full p-2 border rounded"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            {regions.map((region) => (
              <option value={region.value} key={region.value}>
                {region.value}
              </option>
            ))}
          </select>
        </div>
      )}

      {materialSelected ? (
        <div>
          <h2 className="text-lg font-semibold">
            {selectedMaterial} has Been Selected
          </h2>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select Material</h2>
          <select
            className="w-full p-2 border rounded"
            value={selectedMaterial}
            onChange={handleMaterialChange}
          >
            {materials.map((material) => (
              <option value={material.value} key={material.value}>
                {material.value}
              </option>
            ))}
          </select>
        </div>
      )}

      {(regionSelected || materialSelected) && (
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={resetSelection}
          >
            Reset
          </button>
        </div>
      )}
      {materialSelected && selectedMaterial === "Other" && (
        <div>
          <label htmlFor="otherMaterial" className="mt-2">
            Input Material
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter Other Material"
          />
        </div>
      )}



{(regionSelected || materialSelected) && (
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      )}

{filteredResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Search Results:</h2>
          <ul>
            {filteredResults.map((result, index) => (
              <li key={index}>
                <p>Material: {result.Material}</p>
                <p>Region: {result.Region}</p>
                <p>Price: {result.Price} {result.Unit}</p>
                {/* Render other information about suppliers */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Materials;
