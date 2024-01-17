// pages/Home.js
import Navbar from './Navbar';
import Footer from './Footer';
import Link from "next/link";
import GetStarted from './GetStarted';

// import { Loader } from "@googlemaps/js-api-loader"

// const loader = new Loader({
//   apiKey: "YOUR_API_KEY",
//   version: "weekly",
//   ...additionalOptions,
// });

// loader.load().then(async () => {
//   const { Map } = await google.maps.importLibrary("maps");

//   map = new Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// });


function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Your Construction Project Management Hub Site Simplify
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Empower your construction projects with our comprehensive suite of tools and features designed to simplify project management and enhance your success in remote and upcountry areas. Explore the following key functionalities:
        </p>
        <Link href="/GetStarted" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-1 rounded mr-5" >
          Get Started
        </Link>
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-1 rounded mr-5 " >
          Login/Sign Up
          </Link>
        </div>
    </div>
  );
}

export default Home;
