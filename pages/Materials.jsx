import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { regions, materials, searchResults } from "./data";

function Materials() {
    
      
  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0].value);
  const [regionSelected, setRegionSelected] = useState(false);
  const [materialSelected, setMaterialSelected] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setRegionSelected(e.target.value !== regions[0].value);
  };

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
    setMaterialSelected(e.target.value !== materials[0].value);
  };

  const handleSearch = () => {
    if (regionSelected && materialSelected) {
      const filteredResults = searchResults.filter((result) => {
        const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
        const isMaterialMatch =
          (selectedMaterial === "Other" || result.Material.toLowerCase() === selectedMaterial.toLowerCase());

        return isRegionMatch && isMaterialMatch;
      });

      setFilteredResults(filteredResults);
      setShowResults(true);
    }
  };

  const resetSelection = () => {
    setSelectedRegion(regions[0].value);
    setSelectedMaterial(materials[0].value);
    setRegionSelected(false);
    setMaterialSelected(false);
    setFilteredResults([]);
    setShowResults(false);
  };

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Materials Search</h1>
    
<div className="flex justify-between">
  <div className="w-1/2 pr-2">
    <h2 className="text-lg font-semibold">Select Region</h2>
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

  <div className="w-1/2 pl-2">
    <h2 className="text-lg font-semibold">Select Material</h2>
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
</div>

     

{(regionSelected || materialSelected) && (
  <div className="mt-4 flex justify-between">
    <button
      className="bg-blue-500 text-white p-2 rounded"
      onClick={handleSearch}
    >
      Search
    </button>
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


      {/* {showResults && filteredResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Search Results:</h2>
          <table className="w-full border-collapse border mt-2">
            <thead>
              <tr>
                <th className="border p-2">Material</th>
                <th className="border p-2">Region</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Supplier</th>
                <th className="border p-2">Contacts</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr key={index}>
                  <td className="border p-2">{result.Material}</td>
                  <td className="border p-2">{result.Region}</td>
                  <td className="border p-2">{result.Price}</td>
                  <td className="border p-2">{result.Unit}</td>
                  <td className="border p-2">
                    {result.Supplier.map((supplier) => supplier.Name).join(", ")}
                  </td>
                  <td className="border p-2">
                    {result.Supplier.map((supplier) => supplier.Contacts).join(", ")}
                  </td>
                  <td className="border p-2">
                    {result.Supplier.map((supplier) => supplier.Location).join(", ")}
                  </td>
                  <td className="border p-2">
                    {result.Supplier.map((supplier) => supplier.Rating).join(", ")}
                  </td>
                  <td className="border p-2">
                    {result.Supplier.map((supplier) => supplier.Reviews.join(", ")).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}

{showResults && filteredResults.length > 0 && (
  <div className="mt-4">
    <h2 className="text-lg font-semibold">Search Results:</h2>
    <table className="w-full border-collapse border mt-2">
      <thead>
        <tr>
          <th className="border p-2">Material</th>
          <th className="border p-2">Region</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Unit</th>
          <th className="border p-2">Suppliers</th>
        </tr>
      </thead>
      <tbody>
        {filteredResults.map((result, index) => (
          <tr key={index}>
            <td className="border p-2">{result.Material}</td>
            <td className="border p-2">{result.Region}</td>
            <td className="border p-2">{result.Price}</td>
            <td className="border p-2">{result.Unit}</td>
            <td className="border p-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2">Supplier</th>
                    <th className="border p-2">Contacts</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Rating</th>
                    <th className="border p-2">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {result.Supplier.map((supplier, sIndex) => (
                    <tr key={sIndex}>
                      <td className="border p-2">{supplier.Name}</td>
                      <td className="border p-2">{supplier.Contacts}</td>
                      <td className="border p-2">{supplier.Location}</td>
                      <td className="border p-2">{supplier.Rating}</td>
                      <td className="border p-2">
                        {supplier.Reviews.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
}

export default Materials;

