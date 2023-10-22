import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function Materials() {
  const regions = [
    { value: '-- Select Region --' },
    { value: 'Western' }, 
    { value: 'Northern' },    
    { value: 'West Nile' },
    { value: 'Eastern' }
  ]
  
  const [selected, setSelected] = useState(regions[0].value);
  
  const handleChange = (e) => {
    setSelected(e.target.value);
    console.log(e.target.value);
  }
  
  return (
    <div className="mt-16">
      <h3>Search for Materials</h3>
      <select value={selected} onChange={handleChange}>
        {regions.map((region) => (
          <option value={region.value}>{region.value}</option>
        ))}
      </select>
    </div>
  );
}

export default Materials;
