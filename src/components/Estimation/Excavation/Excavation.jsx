import React from "react";
import MyTable from "../../Totals/Tables";
function Excavation() {
  const dimensions = [
    {
      name: "length",
      label: "Length (m)",
      type: "number",
    },
    {
      name: "width",
      label: "Width (m)",
      type: "number",
    },
    {
      name: "depth",
      label: "Depth (m)",
      type: "number",
    },
  ];
  const excavationTrips = [
    {
      name: "Quantity",
      label: "Quantity",
      type: "number",
    },

    {
      name: "tripVolume",
      label: "1 Truck Volume",
      type: "number",
    },
    {
      name: "unitRateExcavation",
      label: "Unit Price For Excavation",
      type: "number",
    },
    {
      name: "unitRateTrip",
      label: "Unit Transport Rate",
      type: "number",
    },
  ];
  const totals = [
    {
      name: "totalExcavation",
      label: "Total Volume",
      type: "number",
    },
    {
      name: "totalTrip",
      label: "Total Trips",
      type: "number",
    },

    {
      name: "totalCost",
      label: "Total Cost",
      type: "number",
    },
  ];

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
      <div className=" p-6 rounded-lg shadow-md flex flex-col sm:flex-row p-0 m-0">
        <div className=" p-6 rounded-lg shadow-md mr-3 p-2">
          <h2>Ground Dimensions:</h2>
          {dimensions.map((dimension, index) => (
            <div className="flex flex-col" key={index}>
              <label
                htmlFor={dimension.name}
                className="text-sm font-medium mb-2"
              >
                {dimension.label}
              </label>
              <input
                type={dimension.type}
                id={dimension.name}
                className="border border-gray-300 rounded py-1 px-2 h-5"
              />
            </div>
          ))}
        </div>
        <div className=" p-6 rounded-lg shadow-md p-2">
          <h2>Excavation Quantity & Trip Volumn:</h2>
          {excavationTrips.map((trip, index) => (
            <div className="flex flex-col" key={index}>
              <label htmlFor={trip.name} className="text-sm font-medium mb-2">
                {trip.label}
              </label>
              <input
                key={index}
                type={trip.type}
                id={trip.name}
                className="border border-gray-300 rounded py-1 px-2 h-5"
              />
            </div>
          ))}
        </div>
        <div className="max-w-full max-h-[400px] overflow-auto">
          <MyTable />
        </div>
      </div>
    </div>
  );
}
export default Excavation;
