import React from "react";

function MyTable() {
  const data = [
    {
      column1: "Abbey",
      column2: "Christiansen",
      column3: "Josehu  ",
    },
    {
      column1: "value1",
      column2: "value2",
      column3: "value3",
    },
    {
      column1: "value1",
      column2: "value2",
      column3: "value3",
      column4: "value4",
    },
  ];
  // Assuming data is an array of objects, and each object represents a row
  // Each property in the object corresponds to a column
  return (
    <>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Column 1</th>
            <th className="px-4 py-2">Column 2</th>
            <th className="px-4 py-2">Column 3</th>
            <th className="px-4 py-2">Column 3</th>

            {/* Add more <th> elements for additional columns */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{row.column1}</td>
              <td className="border px-4 py-2">{row.column2}</td>
              <td className="border px-4 py-2">{row.column3}</td>
              <td className="border px-4 py-2">{row.column4}</td>
              {/* Add more <td> elements for additional columns */}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="bg-blue-500 rounded-lg text-sm sm:text-xs lg:text-lg ">
        Comfirm and Submit to Project
      </button>
    </>
  );
}

export default MyTable;
