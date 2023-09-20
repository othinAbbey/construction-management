import React from "react";

function Excavation() {
  return (
    <div>
      <div>
        <div className="bg-red-500 p-6  h-2 rounded-lg shadow-md flex items-center">
          {" "}
          <img
            src="../src/assets/icons/excavation.jpg"
            alt="Exacvation icon"
            className="w-10 mr-2"
          />{" "}
          <h1 className="text-3xl font-semibold mb-4">Excavation </h1>
        </div>
      </div>
      <div className="bg-green-500 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center">
        <div className="bg-blue-500 p-6 rounded-lg shadow-md">
          <h2> Ground Dimensions </h2>
          <div className="flex flex-col">
            <label htmlFor="length" className="text-sm font-medium mb-2">
              Length (m)
            </label>
            <input
              type="number"
              id="length"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
            <label htmlFor="width" className="text-sm font-medium mb-2">
              Width (m)
            </label>
            <input
              type="number"
              id="width"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
            <label htmlFor="depth" className="text-sm font-medium mb-2">
              Depth (m)
            </label>
            <input
              type="number"
              id="depth"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
          </div>
        </div>
        <div className="bg-gray-500 p-6 rounded-lg shadow-md">
          <h2>Exacavation Quantity & Trip Voulume</h2>
          <div className="flex flex-col">
            <label
              htmlFor="excavationQuantity"
              className="text-sm font-medium mb-2"
            >
              Excavation Quantity
            </label>
            <input
              type="number"
              id="excavationQuantity"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
            <label htmlFor="tripVolume" className="text-sm font-medium mb-2">
              Trip Volume
            </label>
            <input
              type="number"
              id="tripVolume"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />

            <label htmlFor="tripVolume" className="text-sm font-medium mb-2">
              1 Trip Volume
            </label>
            <input
              type="number"
              id="tripVolume"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />

            <label htmlFor="price" className="text-sm font-medium mb-2">
              Unit Rate Excavation
            </label>
            <input
              type="number"
              id="price"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
            <label htmlFor="price" className="text-sm font-medium mb-2">
              Unit Rate Trip
            </label>
            <input
              type="number"
              id="price"
              className="border border-gray-300 rounded-lg py-2 px-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Excavation;
