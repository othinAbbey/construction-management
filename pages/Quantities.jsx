import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Quantities() {
  const [quantities, setQuantities] = useState([
    { image: "https://picsum.photos/seed/picsum/200/300", name: "Bricks", type: "Cement", unit: "pcs", price: 1000, total: 0, quantity: 0, size: "N/A" },
    { image: 'https://picsum.photos/seed/picsum/200/300', name: 'Blocks', type: 'Solid', size: '100 X 200 X 400', unit: "pcs", price: 2000, total: 0, quantity: 0 },
    { image: 'https://picsum.photos/seed/picsum/200/300', name: 'Solid Blocks', type: 'Solid', size: '200 X 200 X 400', unit: "pcs", price: 3000, total: 0, quantity: 0 },
    { image: 'https://picsum.photos/seed/picsum/200/300', name: 'Hollow Blocks', type: 'Hollow', size: '200 X 200 X 400', unit: "pcs", price: 4000, total: 0, quantity: 0 },
    { image: 'https://picsum.photos/seed/picsum/200/300', name: 'Solid Blocks', type: 'Hollow', size: '150 X 200 X 400', unit: "pcs", price: 5000, total: 0, quantity: 0 },
  ]);

  // Function to handle quantity input changes
  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index].quantity = value;
    updatedQuantities[index].total = value * updatedQuantities[index].price;
    setQuantities(updatedQuantities);

    
  };

  

  return (
    <div className="mt-16 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold">Quantities</h1>
      <h2 className="text-lg font-semibold mt-4">SITE LOCATION</h2>
      {quantities.map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-lg mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <img className="w-20 h-20 object-cover rounded-lg" src={item.image} alt={item.name} />
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.type}</p>
              <p className="text-sm text-gray-600">Size: {item.size}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="text-lg font-semibold w-16 text-center border rounded p-1"
              />
              <p className="text-sm text-gray-600 ml-2">{item.unit}</p>
            </div>
            {/* <p className="text-lg font-semibold">{item.price}</p> */}
            <p className="text-lg font-semibold">{item.total}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Quantities;
