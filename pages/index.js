// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import Link from "next/link";

// function Home() {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     setLoaded(true);
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">

//       <Navbar />

//       {/* HERO SECTION */}
//       <div className="text-center px-4 sm:px-6 md:px-10 lg:px-20 py-10 sm:py-14 flex flex-col items-center">

//         {/* TITLE */}
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight max-w-3xl">
//           Welcome to Your Construction Project Management Hub Site
//         </h1>

//         {/* DESCRIPTION */}
//         <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl">
//           Empower your construction projects with tools designed for efficiency, structure, and real-world execution across remote and upcountry sites.
//         </p>

//         {/* BUTTONS */}
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">

//           <Link
//             href="/GetStarted"
//             className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded transition"
//           >
//             Get Started
//           </Link>

//           <Link
//             href="/login"
//             className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded transition"
//           >
//             Login / Sign Up
//           </Link>

//           <Link
//             href="/gallery"
//             className="w-full sm:w-auto bg-gray-800 hover:bg-black text-white font-semibold py-2 px-5 rounded transition"
//           >
//             View Gallery
//           </Link>

//         </div>
//       </div>

//       {/* <Footer /> */}

//     </div>
//   );
// }

// export default Home;


import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-gray-100 h-screen overflow-hidden flex flex-col">

      <Navbar />

      {/* HERO SECTION (fills remaining space) */}
      <div className="flex-1 flex items-center justify-center px-4">

        <div className="text-center flex flex-col items-center max-w-3xl">

          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Welcome to Your Construction Project Management Hub Site
          </h1>

          {/* DESCRIPTION */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8">
            Empower your construction projects with tools designed for efficiency, structure, and real-world execution across remote and upcountry sites.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

            <Link
              href="/GetStarted"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded transition"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded transition"
            >
              Login / Sign Up
            </Link>

            <Link
              href="/gallery"
              className="bg-gray-800 hover:bg-black text-white font-semibold py-2 px-5 rounded transition"
            >
              View Gallery
            </Link>

          </div>

        </div>

      </div>

      {/* Optional footer pinned (no scroll) */}
      <div className="shrink-0">
        {/* <Footer /> */}
      </div>

    </div>
  );
}

export default Home;