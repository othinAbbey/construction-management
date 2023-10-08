import "@/styles/globals.css";

// pages/_app.js

// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import '../styles/globals.css';

// function App({ Component, pageProps }) {
//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <Navbar />
//       <Component {...pageProps} />
//       <Footer />
//     </div>
//   );
// }

// export default App;

// pages/_app.js

import Navbar from "./Navbar";
import Footer from "./Footer";
// import '../styles/globals.css';
import './globals.css'


function App({ Component, pageProps }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow"> {/* Use 'main' element to ensure proper accessibility */}
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

