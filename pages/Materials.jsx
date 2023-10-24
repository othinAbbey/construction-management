// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// function Materials() {
//   const regions = [
//     { value: '-- Select Region --' },
//     { value: 'Western' },
//     { value: 'Northern' },
//     { value: 'West Nile' },
//     { value: 'Eastern' }
//   ];

//   const materials = [
//     { value: '-- Select Material --' },
//     { value: 'Cement' },
//     { value: 'Steel' },
//     { value: 'Timber' },
//     { value: 'Bricks' },
//     { value: 'Tiles' },
//     { value: 'Paint' },
//     { value: 'Sanitary Fittings' },
//     { value: 'Electrical Fittings' },
//     { value: 'Roofing Materials' },
//     { value: 'Doors' },
//     { value: 'Windows' },
//     { value: 'Plumbing Materials' },
//     { value: 'Glass' },
//     { value: 'sand' },
//     { value: 'Furniture' },
//     { value: 'Flooring Materials' },
//     { value: 'Ceiling Materials' },
//     { value: 'Insulation Materials' },
//     { value: 'Other' }
//   ];

//   const searchResults = [
//     {Material: "sand", Region: "Western", Price: 1000, Unit: "tons", 
//     Supplier:[
//     {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//     {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//     {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//     {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//   ]   
//     },
//     {Material: "sand", Region: "Northern", Price: 2000, Unit: "ton",Supplier:[
//       {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: `Supplier Sand 2`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "sand", Region: "West Nile", Price: 3000, Unit: "ton", Supplier:[
//       {Name: "Supplier Sand 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Sand 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Sand 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "sand", Region: "Eastern", Price: 4000, Unit: "ton", Supplier:[
//       {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},

//     {Material: "Bricks", Region: "Western", Price: 1000, Unit: "ton", 
//     Supplier:[
//     {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//     {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//     {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//     {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//   ]
     
//     },
//     {Material: "Bricks", Region: "Northern", Price: 2000, Unit: "ton",
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "Bricks", Region: "West Nile", Price: 3000, Unit: "ton", 
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "Bricks", Region: "Eastern", Price: 4000, Unit: "ton", 
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},



//     ///////////////////cement/////////////////////
//     {Material: "Cement", Region: "Western", Price: 32000, Unit: "Bags", 
//     Supplier:[
//     {Name: "Wammy", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//     {Name: "Didan", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//     {Name: "Tarenwa Victor", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//     {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//   ]   
//     },
//     {Material: "Cement", Region: "Northern", Price: 33000, Unit: "Bags",Supplier:[
//       {Name: "Atia Moses", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: `Ocora Simon`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Oluka John", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "Cement", Region: "West Nile", Price: 34000, Unit: "Bags", Supplier:[
//       {Name: "Odur David", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Ojune Simon", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Malaika Peter", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
//     {Material: "Cement", Region: "Eastern", Price: 35000, Unit: "ton", Supplier:[
//       {Name: "Wabudi Simon", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Omali Vincent", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ]},
// /////////////////////////////steel/////////////////////////
//     {Material: "Steel", Region: "Western", Price: 1000, Unit: "ton", 
//     Supplier:[
//     {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//     {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//     {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//     {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//   ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]
     
//     },
     
  
//     {Material: "Steel", Region: "Northern", Price: 2000, Unit: "ton",
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ], Size: [{R8:22000, }, {Y10:34000}, {Y12:36000}, {Y16:38000}, {Y18:44000}, {Y25:48000}, {Y32:55000}]},

//     {Material: "Steel", Region: "West Nile", Price: 3000, Unit: "ton", 
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ], Size: [{R8:30000, }, {Y10:2000}, {Y12:4000}, {Y16:77000}, {Y18:60000}, {Y25:55000}, {Y32:7000}]},
//     {Material: "Steel", Region: "Eastern", Price: 4000, Unit: "ton", 
//     Supplier:[
//       {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//       {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//       {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//       {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//     ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]},








//   ]

//   const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
//   const [selectedMaterial, setSelectedMaterial] = useState(materials[0].value);

//   const [regionSelected, setRegionSelected] = useState(false);
//   const [materialSelected, setMaterialSelected] = useState(false);

//   const[filteredResults, setFilteredResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   const handleRegionChange = (e) => {
//     setSelectedRegion(e.target.value);
//     setRegionSelected(e.target.value !== regions[0].value);
//   };

//   // const handleMaterialChange = (e) => {
//   //   setSelectedMaterial(e.target.value);
//   //   setMaterialSelected(e.target.value !== materials[0].value);
//   // };

//   const handleMaterialChange = (e) => {
//     setSelectedMaterial(e.target.value);
//     setMaterialSelected(e.target.value !== materials[0].value);
  
//     // const filteredResults = searchResults.filter((result) => {
//     //   const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
//     //   const isMaterialMatch =
//     //     (e.target.value === "Other" || result.Material.toLowerCase() === e.target.value.toLowerCase()) && isRegionMatch;
  
//     //   return isMaterialMatch;
//     // });
  
//     // Update the filtered results state
//     setFilteredResults(filteredResults);
//   };

//   const handleSearch = () => {
//     if (regionSelected && materialSelected) {
//       const filteredResults = searchResults.filter((result) => {
//         const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
//         const isMaterialMatch =
//           (selectedMaterial === "Other" || result.Material.toLowerCase() === selectedMaterial.toLowerCase());
  
//         // Combine the conditions to filter the results
//         return isRegionMatch && isMaterialMatch;
//       });
  
//       setFilteredResults(filteredResults);
//       setShowResults(true);
//     }
//   };
  
  

//   const resetSelection = () => {
//     setSelectedRegion(regions[0].value);
//     setSelectedMaterial(materials[0].value);
//     setRegionSelected(false);
//     setMaterialSelected(false);
//   };

//   return (
//     <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Materials Search</h1>
//       {regionSelected ? (
//         <div>
//           <h2 className="text-lg font-semibold">
//             {selectedRegion} Region has Been Selected
//           </h2>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Select Region</h2>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedRegion}
//             onChange={handleRegionChange}
//           >
//             {regions.map((region) => (
//               <option value={region.value} key={region.value}>
//                 {region.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {materialSelected ? (
//         <div>
//           <h2 className="text-lg font-semibold">
//             {selectedMaterial} has Been Selected
//           </h2>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Select Material</h2>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedMaterial}
//             onChange={handleMaterialChange}
//           >
//             {materials.map((material) => (
//               <option value={material.value} key={material.value}>
//                 {material.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {(regionSelected || materialSelected) && (
//         <div className="mt-4">
//           <button
//             className="bg-blue-500 text-white p-2 rounded"
//             onClick={resetSelection}
//           >
//             Reset
//           </button>
//         </div>
//       )}
//       {materialSelected && selectedMaterial === "Other" && (
//         <div>
//           <label htmlFor="otherMaterial" className="mt-2">
//             Input Material
//           </label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="Enter Other Material"
//           />
//         </div>
//       )}



// {(regionSelected || materialSelected) && (
//         <div className="mt-4">
//           <button
//             className="bg-blue-500 text-white p-2 rounded"
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//         </div>
//       )}

// {filteredResults.length > 0 && (
//         <div className="mt-4">
//           <h2 className="text-lg font-semibold">Search Results:</h2>
//           <ul>
//             {filteredResults.map((result, index) => (
//               <li key={index}>
//                 <p>Material: {result.Material}</p>
//                 <p>Region: {result.Region}</p>
//                 <p>Price: {result.Price} {result.Unit}</p>
//                 <p>Supplier: {result.Supplier[0].Name}</p>
//                 <p>Contacts: {result.Supplier[0].Contacts}</p>
//                 <p>Location: {result.Supplier[0].Location}</p>
//                 <p>Rating: {result.Supplier[0].Rating}</p>
//                 <p>Reviews: {result.Supplier[0].Reviews}</p>
//                 <p>Size
//                   {result.Size[0].R8} {result.Size[1].Y10} {result.Size[2].Y12} {result.Size[3].Y16} {result.Size[4].Y18} {result.Size[5].Y25} {result.Size[6].Y32}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Materials;



// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// function Materials() {
//   const regions = [
//     { value: '-- Select Region --' },
//     { value: 'Western' },
//     { value: 'Northern' },
//     { value: 'West Nile' },
//     { value: 'Eastern' }
//   ];

//   const materials = [
//     { value: '-- Select Material --' },
//     { value: 'Cement' },
//     { value: 'Steel' },
//     { value: 'Timber' },
//     { value: 'Bricks' },
//     { value: 'Tiles' },
//     { value: 'Paint' },
//     { value: 'Sanitary Fittings' },
//     { value: 'Electrical Fittings' },
//     { value: 'Roofing Materials' },
//     { value: 'Doors' },
//     { value: 'Windows' },
//     { value: 'Plumbing Materials' },
//     { value: 'Glass' },
//     { value: 'sand' },
//     { value: 'Furniture' },
//     { value: 'Flooring Materials' },
//     { value: 'Ceiling Materials' },
//     { value: 'Insulation Materials' },
//     { value: 'Other' }
//   ];

//   const searchResults = [
//         {Material: "sand", Region: "Western", Price: 1000, Unit: "tons", 
//         Supplier:[
//         {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//         {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//         {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//         {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//       ]   
//         },
//         {Material: "sand", Region: "Northern", Price: 2000, Unit: "ton",Supplier:[
//           {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: `Supplier Sand 2`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "sand", Region: "West Nile", Price: 3000, Unit: "ton", Supplier:[
//           {Name: "Supplier Sand 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Sand 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Sand 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "sand", Region: "Eastern", Price: 4000, Unit: "ton", Supplier:[
//           {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
    
//         {Material: "Bricks", Region: "Western", Price: 1000, Unit: "ton", 
//         Supplier:[
//         {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//         {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//         {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//         {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//       ]
         
//         },
//         {Material: "Bricks", Region: "Northern", Price: 2000, Unit: "ton",
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "Bricks", Region: "West Nile", Price: 3000, Unit: "ton", 
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "Bricks", Region: "Eastern", Price: 4000, Unit: "ton", 
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
    
    
    
//         ///////////////////cement/////////////////////
//         {Material: "Cement", Region: "Western", Price: 32000, Unit: "Bags", 
//         Supplier:[
//         {Name: "Wammy", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//         {Name: "Didan", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//         {Name: "Tarenwa Victor", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//         {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//       ]   
//         },
//         {Material: "Cement", Region: "Northern", Price: 33000, Unit: "Bags",Supplier:[
//           {Name: "Atia Moses", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: `Ocora Simon`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Oluka John", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "Cement", Region: "West Nile", Price: 34000, Unit: "Bags", Supplier:[
//           {Name: "Odur David", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Ojune Simon", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Malaika Peter", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//         {Material: "Cement", Region: "Eastern", Price: 35000, Unit: "ton", Supplier:[
//           {Name: "Wabudi Simon", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Omali Vincent", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ]},
//     /////////////////////////////steel/////////////////////////
//         {Material: "Steel", Region: "Western", Price: 1000, Unit: "ton", 
//         Supplier:[
//         {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//         {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//         {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//         {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//       ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]
         
//         },
         
      
//         {Material: "Steel", Region: "Northern", Price: 2000, Unit: "ton",
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ], Size: [{R8:22000, }, {Y10:34000}, {Y12:36000}, {Y16:38000}, {Y18:44000}, {Y25:48000}, {Y32:55000}]},
    
//         {Material: "Steel", Region: "West Nile", Price: 3000, Unit: "ton", 
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ], Size: [{R8:30000, }, {Y10:2000}, {Y12:4000}, {Y16:77000}, {Y18:60000}, {Y25:55000}, {Y32:7000}]},
//         {Material: "Steel", Region: "Eastern", Price: 4000, Unit: "ton", 
//         Supplier:[
//           {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
//           {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
//           {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
//           {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
//         ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]},
    
    
    
    
    
    
    
    
//       ]

//   const [selectedRegion, setSelectedRegion] = useState(regions[0].value);
//   const [selectedMaterial, setSelectedMaterial] = useState(materials[0].value);
//   const [regionSelected, setRegionSelected] = useState(false);
//   const [materialSelected, setMaterialSelected] = useState(false);
//   const [filteredResults, setFilteredResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);

//   const handleRegionChange = (e) => {
//     setSelectedRegion(e.target.value);
//     setRegionSelected(e.target.value !== regions[0].value);
//   };

//   const handleMaterialChange = (e) => {
//     setSelectedMaterial(e.target.value);
//     setMaterialSelected(e.target.value !== materials[0].value);
//   };

//   const handleSearch = () => {
//     if (regionSelected && materialSelected) {
//       const filteredResults = searchResults.filter((result) => {
//         const isRegionMatch = selectedRegion === regions[0].value || result.Region === selectedRegion;
//         const isMaterialMatch =
//           (selectedMaterial === "Other" || result.Material.toLowerCase() === selectedMaterial.toLowerCase());

//         return isRegionMatch && isMaterialMatch;
//       });

//       setFilteredResults(filteredResults);
//       setShowResults(true);
//     }
//   };

//   const resetSelection = () => {
//     setSelectedRegion(regions[0].value);
//     setSelectedMaterial(materials[0].value);
//     setRegionSelected(false);
//     setMaterialSelected(false);
//     setFilteredResults([]);
//     setShowResults(false);
//   };

//   return (
//     <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold mb-4">Materials Search</h1>
//       {regionSelected ? (
//         <div>
//           <h2 className="text-lg font-semibold">
//             {selectedRegion} Region has Been Selected
//           </h2>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Select Region</h2>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedRegion}
//             onChange={handleRegionChange}
//           >
//             {regions.map((region) => (
//               <option value={region.value} key={region.value}>
//                 {region.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {materialSelected ? (
//         <div>
//           <h2 className="text-lg font-semibold">
//             {selectedMaterial} has Been Selected
//           </h2>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Select Material</h2>
//           <select
//             className="w-full p-2 border rounded"
//             value={selectedMaterial}
//             onChange={handleMaterialChange}
//           >
//             {materials.map((material) => (
//               <option value={material.value} key={material.value}>
//                 {material.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {(regionSelected || materialSelected) && (
//         <div className="mt-4">
//           <button
//             className="bg-blue-500 text-white p-2 rounded"
//             onClick={resetSelection}
//           >
//             Reset
//           </button>
//         </div>
//       )}

//       {materialSelected && selectedMaterial === "Other" && (
//         <div>
//           <label htmlFor="otherMaterial" className="mt-2">
//             Input Material
//           </label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             placeholder="Enter Other Material"
//           />
//         </div>
//       )}

//       {(regionSelected || materialSelected) && (
//         <div className="mt-4">
//           <button
//             className="bg-blue-500 text-white p-2 rounded"
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//         </div>
//       )}

//       {showResults && filteredResults.length > 0 && (
//         <div className="mt-4">
//           <h2 className="text-lg font-semibold">Search Results:</h2>
//           <table className="w-full border-collapse border mt-2">
//             <thead>
//               <tr>
//                 <th className="border p-2">Material</th>
//                 <th className="border p-2">Region</th>
//                 <th className="border p-2">Price</th>
//                 <th className="border p-2">Unit</th>
//                 <th className="border p-2">Supplier</th>
//                 <th className="border p-2">Contacts</th>
//                 <th className="border p-2">Location</th>
//                 <th className="border p-2">Rating</th>
//                 <th className="border p-2">Reviews</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredResults.map((result, index) => (
//                 <tr key={index}>
//                   <td className="border p-2">{result.Material}</td>
//                   <td className="border p-2">{result.Region}</td>
//                   <td className="border p-2">{result.Price}</td>
//                   <td className="border p-2">{result.Unit}</td>
//                   <td className="border p-2">{result.Supplier[0].Name}</td>
//                   <td className="border p-2">{result.Supplier[0].Contacts}</td>
//                   <td className="border p-2">{result.Supplier[0].Location}</td>
//                   <td className="border p-2">{result.Supplier[0].Rating}</td>
//                   <td className="border p-2">{result.Supplier[0].Reviews.join(', ')}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Materials;



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
            {Material: "sand", Region: "Western", Price: 1000, Unit: "tons", 
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
        
        
        
            ///////////////////cement/////////////////////
            {Material: "Cement", Region: "Western", Price: 32000, Unit: "Bags", 
            Supplier:[
            {Name: "Wammy", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
            {Name: "Didan", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
            {Name: "Tarenwa Victor", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
            {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
          ]   
            },
            {Material: "Cement", Region: "Northern", Price: 33000, Unit: "Bags",Supplier:[
              {Name: "Atia Moses", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: `Ocora Simon`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Oluka John", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ]},
            {Material: "Cement", Region: "West Nile", Price: 34000, Unit: "Bags", Supplier:[
              {Name: "Odur David", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: "Ojune Simon", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Malaika Peter", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ]},
            {Material: "Cement", Region: "Eastern", Price: 35000, Unit: "ton", Supplier:[
              {Name: "Wabudi Simon", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: "Omali Vincent", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ]},
        /////////////////////////////steel/////////////////////////
            {Material: "Steel", Region: "Western", Price: 1000, Unit: "ton", 
            Supplier:[
            {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
            {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
            {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
            {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
          ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]
             
            },
             
          
            {Material: "Steel", Region: "Northern", Price: 2000, Unit: "ton",
            Supplier:[
              {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ], Size: [{R8:22000, }, {Y10:34000}, {Y12:36000}, {Y16:38000}, {Y18:44000}, {Y25:48000}, {Y32:55000}]},
        
            {Material: "Steel", Region: "West Nile", Price: 3000, Unit: "ton", 
            Supplier:[
              {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ], Size: [{R8:30000, }, {Y10:2000}, {Y12:4000}, {Y16:77000}, {Y18:60000}, {Y25:55000}, {Y32:7000}]},
            {Material: "Steel", Region: "Eastern", Price: 4000, Unit: "ton", 
            Supplier:[
              {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
              {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
              {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
              {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
            ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]},
        
        
        
        
        
        
        
        
          ]

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
      )}
    </div>
  );
}

export default Materials;

