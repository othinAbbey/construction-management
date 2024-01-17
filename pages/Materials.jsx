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
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 14000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 15000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 16000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 17000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 18000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 19000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 20000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 21000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 22000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 23000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 24000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 25000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 26000},
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
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 53000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 54000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 55000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 56000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 57000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 58000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 59000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 60000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 61000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 62000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 63000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 64000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 65000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 66000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 67000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 68000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 69000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 70000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 71000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 72000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 73000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 74000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 75000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 76000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 77000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 78000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 79000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 80000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 81000},
        { name: 'Plumbing', type: 'Plumbing', unit: 'pieces', price: 82000},
        { name: 'Electrical', type: 'Electrical', unit: 'pieces', price: 83000},
        { name: 'Tiles', type: 'Tiles', unit: 'boxes', price: 84000},
        { name: 'Paint', type: 'Paint', unit: 'buckets', price: 85000},
        { name: 'Doors', type: 'Doors', unit: 'doors', price: 86000},
        { name: 'Windows', type: 'Windows', unit: 'windows', price: 87000},
        { name: 'Pipes', type: 'Pipes', unit: 'pipes', price: 88000},
        { name: 'Wires', type: 'Wires', unit: 'meters', price: 89000},
        { name: 'Nails', type: 'Nails', unit: 'kgs', price: 90000}
        
        // Add more materials with their respective details
    ]

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');  
    const [showTable, setShowTable] = useState(false);

    const handleRegionChange = (event) => {
        const region = event.target.value;
        setSelectedRegion(region);
        setSelectedDistrict('');
        setSelectedMaterial('');
        setShowTable(false); // Hide the table when the region is changed
    };

    const handleDistrictChange = (event) => {
        const district = event.target.value;
        setSelectedDistrict(district);
        setSelectedMaterial('');
        setShowTable(false);
    };

    const handleMaterialChange = (event) => {
        const material = event.target.value;
        setSelectedMaterial(material);
        setShowTable(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission if needed
        // For now, you can update the state to show the table
        setShowTable(true);
    };

    return (
        <div className="mt-16 p-4 container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Your one-stop center for materials near you</h1>
            <div className="max-w-md mx-auto">
                <h2 className="text-xl mb-4">Fill in the form to get started</h2>
                <form onSubmit={handleSubmit} >
                    <select className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                            onChange={handleRegionChange}
                            value={selectedRegion} >
                        <option value="Select Region">Select Region</option>
                        {regions.map((region, index) => (
                            <option key={index} value={region.name}>{region.name}</option>
                        ))}
                    </select>

                    {selectedRegion && (
                        <select onChange={handleDistrictChange} value={selectedDistrict} className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select District">Select District</option>
                            {regions.find(region => region.name === selectedRegion)?.districts.map((district, index) => (
                                <option key={index} value={district}>{district}</option>
                            ))}
                        </select>
                    )}

                    {selectedDistrict && (
                        <select onChange={handleMaterialChange} value={selectedMaterial}  className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300">
                            <option value="Select Material">Select Material</option>
                            {materials.map((material, index) => (
                                <option key={index} value={material.name}>{material.name}</option>
                            ))}
                        </select>
                    )}
                    

                    {showTable && selectedMaterial && (
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
        </div>
    );
}

export default Materials;
