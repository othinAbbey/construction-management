import "@/styles/globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function App({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* <Navbar /> */}

      <main className="flex-1 ">
        <Component {...pageProps} />
      </main>

      <Footer />

    </div>
  );
}

export default App;