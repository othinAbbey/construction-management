// pages/Home.js
import Navbar from './Navbar';
import Footer from './Footer';
import Link from "next/link";
import GetStarted from './GetStarted';


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
        <Link href="/GetStarted" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-1 rounded " >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Home;
