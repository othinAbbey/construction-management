
// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// function Gallery() {
//   const images = [
//     { src: "/assets/strf1.jpeg", title: "Steel Structure", category: "Fabrication" },
//     { src: "/assets/strf2.jpeg", title: "Bridge Works", category: "Infrastructure" },
//     { src: "/assets/strf3.jpeg", title: "Site Installation", category: "Construction" },
//     { src: "/assets/strf14.jpeg", title: "Welding Works", category: "Steel Works" },
//     { src: "/assets/strf15.jpeg", title: "Structural Steel", category: "Fabrication" },
//     { src: "/assets/strf16.jpeg", title: "Heavy Lifting", category: "Construction" },
//     { src: "/assets/strf17.jpeg", title: "Project Management", category: "Planning" },
//     { src: "/assets/strf18.jpeg", title: "Remote Site", category: "Logistics" },
//     { src: "/assets/strf19.jpeg", title: "Upcountry Project", category: "Development" },
//     { src: "/assets/strf31.jpeg", title: "Project Timeline", category: "Scheduling" },
//     { src: "/assets/strf32.jpeg", title: "Safety Measures", category: "Safety" },
//     { src: "/assets/strf35.jpeg", title: "Material Handling", category: "Logistics" },
//     { src: "/assets/strf36.jpeg", title: "Site Survey", category: "Planning" },
//     { src: "/assets/strf37.jpeg", title: "Construction Progress", category: "Monitoring" },
//     { src: "/assets/strf38.jpeg", title: "Project Collaboration", category: "Teamwork" },
//     { src: "/assets/strf39.jpeg", title: "Remote Management", category: "Remote Work" },
//     { src: "/assets/strf41.jpeg", title: "Upcountry Development", category: "Development" },
//     { src: "/assets/strf43.jpeg", title: "Construction Site", category: "Construction" },
//     { src: "/assets/strf44.jpeg", title: "Project Planning", category: "Planning" },
//     { src: "/assets/strf45.jpeg", title: "Safety Protocols", category: "Safety" },
//     { src: "/assets/strf46.jpeg", title: "Material Logistics", category: "Logistics" },
//     { src: "/assets/strf48.jpeg", title: "Site Inspection", category: "Monitoring" },
//     { src: "/assets/strf50.jpeg", title: "Construction Teamwork", category: "Collaboration" },
//     { src: "/assets/strf121.jpeg", title: "Remote Site Management", category: "Remote Work" },
//     { src: "/assets/strf33.jpeg", title: "Upcountry Project Development", category: "Development" },
//     { src: "/assets/strf34.jpeg", title: "Construction Progress", category: "Monitoring" },
//   ];

//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     setLoaded(true);
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">

//       <Navbar />

//       {/* HEADER */}
//       <div className="text-center py-8 sm:py-10 px-4">
//         <h1 className="text-2xl sm:text-3xl font-bold">
//           Project Gallery
//         </h1>
//         <p className="text-sm sm:text-base text-gray-600 mt-2">
//           Showcasing our construction and engineering projects
//         </p>
//       </div>

//       {/* GRID */}
//       <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-16">

//         <div className="
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-4
//           gap-3 sm:gap-4
//         ">

//           {images.map((img, index) => (
//             <div
//               key={index}
//               className={`
//                 bg-white shadow rounded overflow-hidden
//                 transform transition-all duration-700 ease-out
//                 hover:scale-105 hover:shadow-xl
//                 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
//               `}
//               style={{
//                 transitionDelay: `${index * 60}ms`,
//               }}
//             >

//               <img
//                 src={img.src}
//                 alt={img.title}
//                 className="
//                   w-full
//                   h-40 sm:h-44 md:h-48
//                   object-cover
//                   transition-transform duration-500
//                   hover:scale-110
//                 "
//                 loading="lazy"
//               />

//               <div className="p-2 sm:p-3">
//                 <p className="font-semibold text-xs sm:text-sm">
//                   {img.title}
//                 </p>
//                 <p className="text-[10px] sm:text-xs text-gray-500">
//                   {img.category}
//                 </p>
//               </div>

//             </div>
//           ))}

//         </div>
//       </div>



//     </div>
//   );
// }

// export default Gallery;

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Gallery() {
  const images = [
        { src: "/assets/strf1.jpeg", title: "Steel Structure", category: "Fabrication" },
    { src: "/assets/strf2.jpeg", title: "Bridge Works", category: "Infrastructure" },
    { src: "/assets/strf3.jpeg", title: "Site Installation", category: "Construction" },
    { src: "/assets/strf14.jpeg", title: "Welding Works", category: "Steel Works" },
    { src: "/assets/strf15.jpeg", title: "Structural Steel", category: "Fabrication" },
    { src: "/assets/strf16.jpeg", title: "Heavy Lifting", category: "Construction" },
    { src: "/assets/strf17.jpeg", title: "Project Management", category: "Planning" },
    { src: "/assets/strf18.jpeg", title: "Remote Site", category: "Logistics" },
    { src: "/assets/strf19.jpeg", title: "Upcountry Project", category: "Development" },
    { src: "/assets/strf31.jpeg", title: "Project Timeline", category: "Scheduling" },
    { src: "/assets/strf32.jpeg", title: "Safety Measures", category: "Safety" },
    { src: "/assets/strf35.jpeg", title: "Material Handling", category: "Logistics" },
    { src: "/assets/strf36.jpeg", title: "Site Survey", category: "Planning" },
    { src: "/assets/strf37.jpeg", title: "Construction Progress", category: "Monitoring" },
    { src: "/assets/strf38.jpeg", title: "Project Collaboration", category: "Teamwork" },
    { src: "/assets/strf39.jpeg", title: "Remote Management", category: "Remote Work" },
    { src: "/assets/strf41.jpeg", title: "Upcountry Development", category: "Development" },
    { src: "/assets/strf43.jpeg", title: "Construction Site", category: "Construction" },
    { src: "/assets/strf44.jpeg", title: "Project Planning", category: "Planning" },
    { src: "/assets/strf45.jpeg", title: "Safety Protocols", category: "Safety" },
    { src: "/assets/strf46.jpeg", title: "Material Logistics", category: "Logistics" },
    { src: "/assets/strf48.jpeg", title: "Site Inspection", category: "Monitoring" },
    { src: "/assets/strf50.jpeg", title: "Construction Teamwork", category: "Collaboration" },
    { src: "/assets/strf121.jpeg", title: "Remote Site Management", category: "Remote Work" },
    { src: "/assets/strf33.jpeg", title: "Upcountry Project Development", category: "Development" },
    { src: "/assets/strf34.jpeg", title: "Construction Progress", category: "Monitoring" },

  ];

  const [loaded, setLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col relative">

      <Navbar />

      {/* HEADER */}
      <div className="text-center py-8 sm:py-10 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Project Gallery
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Click any image to view full size
        </p>
      </div>

      {/* GRID */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 mb-16">

        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-3 sm:gap-4
        ">

          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`
                bg-white shadow rounded overflow-hidden cursor-pointer
                transform transition-all duration-700 ease-out
                hover:scale-105 hover:shadow-xl
                ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
              `}
              style={{
                transitionDelay: `${index * 60}ms`,
              }}
            >

              <img
                src={img.src}
                alt={img.title}
                className="
                  w-full 
                  h-40 sm:h-44 md:h-48 
                  object-cover 
                  transition-transform duration-500 
                  hover:scale-110
                "
                loading="lazy"
              />

              <div className="p-2 sm:p-3">
                <p className="font-semibold text-xs sm:text-sm">
                  {img.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {img.category}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* 🔥 FULLSCREEN MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full relative">

            {/* CLOSE BUTTON */}
            <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            {/* IMAGE */}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded"
            />

            {/* INFO */}
            <div className="text-center text-white mt-3">
              <p className="font-semibold">{selectedImage.title}</p>
              <p className="text-sm text-gray-300">{selectedImage.category}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Gallery;