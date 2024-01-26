import React, { useState } from 'react';

function Materials() {
    const regions = [
        { name: 'Central', districts: ['Buikwe','Bukomansimbi','Butambala','Buvuma','Gomba','Kalangala','Kalungu','Kayunga','Kiboga','Kyankwanzi ','Kyotera','Mubende','Nakaseke','Rakai','Sembabule','Mpigi','Mityana','Masaka','Lyantonde','Lwengo','Wakiso', 'Kampala', 'Mukono', 'Luwero','Mityana'] },
        { name: 'Eastern', districts: ['Tororo', 'Soroti', 'Sironko','Serere','Paliisa','Ngora','Namutumba','Namisindwa','Namayingo','Mbale','Mayuge', 'Manafwa', 'Luuka','Kween','Kumi','Kibuku','Katakwi','Kapchorwa','Kamuli','Kaliro','Kaberamaido', 'Jinja', 'Iganga','Buyende','Butebo','Butaleja','Busia','Bulambuli','Bukwo','Bukedea','Bugiri','Bududa','Budaka','Amuria'] },
        { name: 'Western', districts: ['Buhweju', 'Bulisa', 'Bundibugyo','Bushenyi','Hoima','Ibanda','Isingiro','Kabale','Kabarole','Kamwenge','Kanungu','Kasese','Kibaale', 'Kiruhura', 'Kiryandongo','Kisoro','Kyegegwa','Kyenjojo','Masindi','Mbarara','Mitooma','Ntoroko','Ntungamo','Rubirizi','Rukungiri', 'Sheema'] },
        { name: 'Northern', districts: [,'Abim', 'Adjumani', 'Agago','Alebtong','Amolatar','Amudat','Amuru','Apac','Arua','Dokolo','Gulu','Kaabong','Kitgum', 'Koboko', 'Kole','Kotido','Lamwo','Lira','Maracha','Moroto','Moyo','Nakapiripirit','Napak','Nebbi','Nwoya', 'Otuke', 'Oyam','Pader','Yumbe','Zombo'] },
        // Add more regions with their respective districts
    ];

    const materials = [
        { name: 'Bricks', type: 'Cement', unit: 'pcs', price: 1000 },
        { name: 'Blocks', type: 'Solid', size: '100 X 200 X 400', unit: 'pcs', price: 2000 },
        { name: 'Solid Blocks', type: 'Solid', size: '200 X 200 X 400', unit: 'pcs', price: 3000 },
        { name: 'Hollow Blocks', type: 'Hollow', size: '200 X 200 X 400', unit: 'pcs', price: 4000 },
        { name: 'Solid Blocks', type: 'Hollow', size: '150 X 200 X 400', unit: 'pcs', price: 5000 },
        { name: 'Cement', type: 'Cement', unit: 'bags', price: 6000},
        { name: 'Sand', type: 'Sand', unit: 'trucks', price: 7000},
        { name: 'Aggregate', type: 'Aggregate', unit: 'trucks', price: 8000},
        { name: 'Iron Bars', type: 'Iron Bars', unit: 'bars', price: 9000},
        { name: 'Roofing Sheets', type: 'Roofing Sheets', unit: 'sheets', price: 10000},
        { name: 'Timber', type: 'Timber', unit: 'cubic meters', price: 11000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 12000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 13000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 15000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 16000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 19000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 20000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 21000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 22000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 24000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 25000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 27000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 28000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 29000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 30000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 31000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 32000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 33000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 34000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 35000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 36000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 37000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 38000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 39000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 40000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 41000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 42000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 43000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 44000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 45000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 46000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 47000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 48000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 49000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 50000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 51000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 52000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 55000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 56000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 58000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 59000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 60000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 61000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 64000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 65000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 66000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 67000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 68000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 69000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 70000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 72000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 73000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 74000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 75000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 76000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 77000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 78000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 79000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 81000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 82000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 83000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 84000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 85000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 86000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 87000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 88000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 90000}
        
        // Add more materials with their respective details
    ]
    //Variables for Material search
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');  
    const [showTable, setShowTable] = useState(false);
    const [addMaterial, setAddMaterial] = useState(false)

    // variables for material add
    const [selectedRegion2, setSelectedRegion2] = useState('');
    const [selectedDistrict2, setSelectedDistrict2] = useState('');
    const [selectedMaterial2, setSelectedMaterial2] = useState('');  
    const [showTable2, setShowTable2] = useState(false);

    //Variables for adding material
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('');


    const handleRegionChange = (event, formNumber) => {
        const region = event.target.value;
        if (formNumber === 1) {
            setSelectedRegion(region);
            setSelectedDistrict('');
            setSelectedMaterial('');
            setShowTable(false);
        } else if (formNumber === 2) {
            setSelectedRegion2(region);
            setSelectedDistrict2('');
            setSelectedMaterial2('');
            setShowTable2(false);
        }
    };

    const handleMaterialChange = (event, formNumber) => {
        const material = event.target.value;
        setSelectedMaterial2(material);
        if (formNumber === 1) {
            setSelectedMaterial(material);
            setShowTable(true);
        } else if (formNumber === 2) {
            setSelectedMaterial2(material);
            setShowTable2(true);
        }
    };

    const handleDistrictChange = (event, formNumber) => {
        const district = event.target.value;
        if (formNumber === 1) {
            setSelectedDistrict(district);
            setSelectedMaterial('');
            setShowTable(false);
        } else if (formNumber === 2) {
            setSelectedDistrict2(district);
            setSelectedMaterial2('');
            setShowTable2(false);
        }
    };

    const handleSubmit = (event, formNumber) => {
        event.preventDefault();
        // Handle form submission if needed
        // For now, you can update the state to show the table
        if (formNumber === 1) {
            setShowTable(true);
        } else if (formNumber === 2) {
            setShowTable2(true);
        }
    };
    
//    const handleAddMaterial = async ()=>{
//     const response = await fetch('http://localhost:3000/api/materials', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             material: selectedMaterial2,
//             description,
//             rate,
//         })
            
//         })
//     try{
//         const data = await response.json()
//         console.log(data)
//     } catch(err){
//         console.log(err)
//         // Log the response text to see the actual content
//         const responseText = await response.text();
//         console.log(responseText);
//     }
       
//    }

const handleAddMaterial = async () => {
    const response = await fetch('http://localhost:8000/materials/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            material: selectedMaterial2,
            description,
            rate,
        })
    });
const data = await response.json();
console.log(data);
    try {
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            // Log or handle the error
            console.error(`Server error: ${response.statusText}`);
        }
    } catch (err) {
        // Log the parsing error
        console.error(err);

        // If the response status is not OK, log the response text
        if (!response.ok) {
            const responseText = await response.text();
            console.log(responseText);
        }
    }
};

    return (
        <div className="mt-16 p-4 container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Your one-stop center for materials near you</h1>
            <div className="max-w-md mx-auto">
                <h2 className="text-xl mb-4">Fill in the form to get started</h2>
                <form onSubmit={(event) => handleSubmit(event, 1)} >
                    <select className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                            onChange={(event) => handleRegionChange(event,1)}
                            value={selectedRegion} >
                        <option value="Select Region">Select Region</option>
                        {regions.map((region, index) => (
                            <option key={index} value={region.name}>{region.name}</option>
                        ))}
                    </select>

                    {selectedRegion && (
                        <select onChange={(event)=>handleDistrictChange(event,1)} value={selectedDistrict} className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select District">Select District</option>
                            {regions.find(region => region.name === selectedRegion)?.districts.map((district, index) => (
                                <option key={index} value={district}>{district}</option>
                            ))}
                        </select>
                    )}

                    {selectedDistrict && (
                        <select onChange={(event)=>handleMaterialChange(event,1)} value={selectedMaterial}  className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select Material">Select Material</option>
                            {materials.map((material, index) => (
                                <option key={index} value={material.name}>{material.name}</option>
                            ))}
                        </select>
                    )}
                    

                    {showTable && selectedMaterial && (
                    // <table className="mt-4 border-collapse border border-gray-600">
                    //     <thead>
                    //         <tr>
                    //             <th className="border border-gray-600 p-2">Material</th>
                    //             <th className="border border-gray-600 p-2">Type</th>
                    //             <th className="border border-gray-600 p-2">Unit</th>
                    //             <th className="border border-gray-600 p-2">Price</th>
                    //         </tr>
                    //     </thead>
                    //     <tbody>
                    //         {materials.map((material, index) => (
                    //             material.name === selectedMaterial && (
                    //                 <tr key={index} className="border border-gray-600">
                    //                     <td className="border border-gray-600 p-2">{material.name}</td>
                    //                     <td className="border border-gray-600 p-2">{material.type.map((type,index)=>(key={index} type))}</td>
                    //                     <td className="border border-gray-600 p-2">{material.unit}</td>
                    //                     <td className="border border-gray-600 p-2">{material.price}</td>
                    //                 </tr>
                    //             )
                    //         ))}
                    //     </tbody>
                    // </table>

        <table className="mt-4 border-collapse border border-gray-600">
        <thead>
            <tr>
                <th className="border border-gray-600 p-2">Material</th>
                <th className="border border-gray-600 p-2">Type</th>
                <th className="border border-gray-600 p-2">Unit</th>
                <th className="border border-gray-600 p-2">Price</th>
            </tr>
        </thead>
        <tbody>
            {/* {materials
                .filter(material => material.name === selectedMaterial && material.type === 'Nails')
                .map((material, index) => (
                    material.type.map((size, sizeIndex) => (
                        <tr key={sizeIndex} className="border border-gray-600">
                            {sizeIndex === 0 ? (
                                <>
                                    <td rowSpan={material.type.length} className="border border-gray-600 p-2">{material.name}</td>
                                    <td className="border border-gray-600 p-2">{size}</td>
                                    <td rowSpan={material.type.length} className="border border-gray-600 p-2">{material.unit}</td>
                                    <td rowSpan={material.type.length} className="border border-gray-600 p-2">{material.price}</td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-gray-600 p-2">{size}</td>
                                </>
                            )}
                        </tr>
                    ))
                ))} */}


                            {materials.map((material, index) => (
                                material.name === selectedMaterial && (
                                    <tr key={index} className="border border-gray-600">
                                        <td className="border border-gray-600 p-2">{material.name}</td>
                                        <td className="border border-gray-600 p-2">{material.type}</td>
                                        <td className="border border-gray-600 p-2">{material.unit}</td>
                                        <td className="border border-gray-600 p-2">{material.price}</td>
                                    </tr>
                                )
                            ))}
        </tbody>
    </table>
                )}

                    {/* Add other form elements for material selection and other details */}
                </form>
            </div>
        {/* Adding materials */}
        <div>
            <h6>Are you a certified supplier?<span>Join Many of our suppliers</span></h6>
            <form onSubmit={(event) => handleSubmit(event, 2)}>
                    <select className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                            onChange={(event) => handleRegionChange(event,2)}
                            value={selectedRegion2} >
                        <option value="Select Region">Select Region</option>
                        {regions.map((region, index) => (
                            <option key={index} value={region.name}>{region.name}</option>
                        ))}
                    </select>

                    {selectedRegion2 && (
                        <select onChange={(event)=>handleDistrictChange(event,2)} value={selectedDistrict2} className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select District">Select District</option>
                            {regions.find(region => region.name === selectedRegion2)?.districts.map((district, index) => (
                                <option key={index} value={district}>{district}</option>
                            ))}
                        </select>
                    )}

                    {selectedDistrict2 && (
                        <select onChange={(event)=>handleMaterialChange(event,2)} value={selectedMaterial2}  className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select Material">Select Material</option>
                            {materials.map((material, index) => (
                                <option key={index} value={material.name}>{material.name}</option>
                            ))}
                        </select>
                    )}
                    

                    {showTable2 && selectedMaterial2 && (
                    <table className="mt-4 border-collapse border border-gray-600">
                        <thead>
                            <tr>
                                <th className="border border-gray-600 p-2">Material</th>
                                <th className="border border-gray-600 p-2">Type</th>
                                <th className="border border-gray-600 p-2">Unit</th>
                                <th className="border border-gray-600 p-2">Description</th>
                                <th className="border border-gray-600 p-2">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material, index) => (
                                material.name === selectedMaterial2 && (
                                    <tr key={index} className="border border-gray-600">
                                        <td className="border border-gray-600 p-2">{material.name}</td>
                                        <td className="border border-gray-600 p-2">{material.type}</td>
                                        <td className="border border-gray-600 p-2">{material.unit}</td>
                                        <td className="border border-gray-600 p-2"><input type='text'placeholder='Description'></input></td>
                                        <td className="border border-gray-600 p-2"><input type='numbers'placeholder='Enter Price'></input></td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                )}
                <button onClick={handleAddMaterial}>Add Material</button> 

                    {/* Add other form elements for material selection and other details */}
                </form>
            
        </div>
        </div>
    );
}



export default Materials;
