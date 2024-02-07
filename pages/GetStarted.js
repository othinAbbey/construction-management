// pages/Services.js

import Footer from "./Footer";
import Navbar from "./Navbar";
import Link from "next/link";

const servicesData = [
  {
    title: "Material Search",
    link: "Materials",
    description:
      "Easily search for construction materials by name, type, or specific attributes.",
  },
  {
    title: "Price Information",
    link: "Prices",
    description:
      "Get up-to-date pricing information from various suppliers. View historical price trends for specific materials.",
  },
  {
    title: "Materials Calculator",
    link: "Quantities",
    description:
      "Input project details, such as location, dimensions, and materials required. Estimate the overall cost of materials for your project.",
  },
  // Add more services as needed
];

function Services() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Our Services</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
              >
                <Link href={service.link}>
                  <h2 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h2>
                  <p className="text-gray-600">{service.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;
