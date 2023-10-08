// import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// import { Loader } from "@googlemaps/js-api-loader";
// let map;
// const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
// const zoom = 14;
// const url = "https://maps.googleapis.com/maps/api/staticmap";
// // @ts-ignore google.maps.plugins
// const loader = new Loader({
//   apiKey: "AIzaSyAdZ-GrfAodlQq-cybk4RY63Eep7ly1mMg",
//   version: "weekly",
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const wrapper = document.getElementById("wrapper");

//   wrapper.style.backgroundImage = `url(${url}?center=${center.lat},${center.lng}&zoom=${zoom}&scale=2&size=${wrapper.clientWidth}x${wrapper.clientHeight}&key=YOUR_API_KEY)`;
//   wrapper.addEventListener("click", () => {
//     wrapper.remove();
//     loader.load().then(() => {
//       map = new google.maps.Map(document.getElementById("map"), {
//         center,
//         zoom,
//       });
//     });
//   });
// });

// // const Materials = () => {
// const wrapper = document.getElementById("wrapper");
// import { useEffect } from "react"; // Import useEffect for DOMContentLoaded

// function Materials() {
//   useEffect(() => {
//     document.addEventListener("DOMContentLoaded", () => {
//       const wrapper = document.getElementById("mapWrapper");
//       const center = { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }; // Replace with your coordinates
//       const zoom = YOUR_ZOOM_LEVEL; // Replace with your desired zoom level
//       const url = "https://maps.googleapis.com/maps/api/staticmap";

//       wrapper.style.backgroundImage = `url(${url}?center=${center.lat},${center.lng}&zoom=${zoom}&scale=2&size=${wrapper.clientWidth}x${wrapper.clientHeight}&key=YOUR_API_KEY)`;

//       wrapper.addEventListener("click", () => {
//         wrapper.remove();
//         // Load Google Maps JavaScript API
//         const script = document.createElement("script");
//         script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
//         script.async = true;
//         script.defer = true;
//         document.head.appendChild(script);
//       });
//     });
//   }, []); // Empty dependency array means this effect runs once after the component mounts

//   // JSX for your Materials component
//   return (
//     <div className="mt-16">
//       <h3>Materials</h3>
//       <div id="mapWrapper" className="w-full h-96"></div>
//     </div>
//   );
// }

// export default Materials;

import { useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter to access the router
import dynamic from "next/dynamic"; // Import dynamic to load Google Maps script dynamically

import { Loader } from "@googlemaps/js-api-loader";
let map;
const center = { lat: 41.90476224706472, lng: 12.49822074385094 };
const zoom = 14;
const url = "https://maps.googleapis.com/maps/api/staticmap";
// @ts-ignore google.maps.plugins
const loader = new Loader({
  apiKey: "AIzaSyAdZ-GrfAodlQq-cybk4RY63Eep7ly1mMg",
  version: "weekly",
});
const GoogleMap = dynamic(() => import(map), {
  ssr: false, // Disable server-side rendering for this component
});

function Materials() {
  const router = useRouter(); // Initialize the router
  // Replace with the desired latitude and longitude
  // Replace with the desired zoom level

  useEffect(() => {
    const center = { lat: 40.7128, lng: -74.006 };
    const zoom = 12;

    // Handle clicks on the map wrapper
    const handleMapClick = () => {
      router.push("/map"); // Redirect to the map page when the wrapper is clicked
    };

    const wrapper = document.getElementById("mapWrapper");
    if (wrapper) {
      wrapper.style.backgroundImage = `url(https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&scale=2&size=${wrapper.clientWidth}x${wrapper.clientHeight}&key=YOUR_API_KEY)`;
      wrapper.addEventListener("click", handleMapClick);
    }

    return () => {
      // Remove event listener when the component unmounts
      if (wrapper) {
        wrapper.removeEventListener("click", handleMapClick);
      }
    };
  }, [router]);

  return (
    <div className="mt-16">
      <h3>Materials</h3>
      <div id="mapWrapper" className="w-full h-96"></div>
    </div>
  );
}

export default Materials;
