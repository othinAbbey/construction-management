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
  ]

  const materials =[
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
    { value: 'Gypsum' },
    { value: 'Furniture' },
    { value: 'Flooring Materials' },
    { value: 'Ceiling Materials' },
    { value: 'Insulation Materials' },
    { value: 'Other' }
  ]

  const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0].value);

  const [regionSelected, setRegionSelected] = useState(false);
  const [materialSelected, setMaterialSelected] = useState(false);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setRegionSelected(e.target.value !== regions[0].value);
  }

  const handleMaterialChange = (e) => {
    setSelectedMaterial(e.target.value);
    setMaterialSelected(e.target.value !== materials[0].value);
  }

  const resetSelection = () => {
    setSelectedRegion(regions[0].value);
    setSelectedMaterial(materials[0].value);
    setRegionSelected(false);
    setMaterialSelected(false);
  }

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
    </div>
  );
}

export default Materials;
