// AdminPage.js
import React from 'react';
import Link from 'next/link';

const AdminPage = () => {
  return (
    <div className="max-w-md mx-auto p-4 border rounded bg-gray-200">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link href="./addmat"><button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Material
        </button></Link>
        
        <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Edit Material
        </button>
        {/* Add more buttons for other functionalities */}
      </div>
      {/* Add admin-related content here */}
    </div>
  );
};

export default AdminPage;
