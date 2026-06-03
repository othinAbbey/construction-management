
"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Link from "next/link";

function Home() {
  const images = [
    "/assets/water-projects/psp.JPG",
    "/assets/water-projects/Panel Tank.JPG",
    "/assets/steel-projects/strf1.jpeg",
    "/assets/steel-projects/strf2.jpeg",
    "/assets/steel-projects/strf3.jpeg",
  ];

  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sections = {
    overview: {
      title: "Company Overview",
      items: [
        "Registered civil engineering & construction company operating across Uganda",
        "Specialists in water infrastructure, steel structures, and civil works",
        "Delivering government and private sector infrastructure projects",
        "Focused on rural and urban development solutions",
      ],
    },

    water: {
      title: "Water Infrastructure Delivery",
      items: [
        "Successfully delivered clean water systems in Northern Uganda (Gulu, Lira, Arua)",
        "Installed borehole pumping systems for rural communities",
        "Built school and health center water supply systems",
        "Supported sustainable water access for 50,000+ people",
      ],
    },

    steel: {
      title: "Steel & Industrial Construction",
      items: [
        "Constructed over 2,300+ sqm warehouse structures",
        "Fabricated steel frames for commercial buildings and factories",
        "Delivered roofing systems for schools and institutions",
        "Industrial-grade structural engineering solutions",
      ],
    },

    civil: {
      title: "Civil Engineering Works",
      items: [
        "Road drainage and culvert installation projects",
        "Site excavation and foundation works",
        "Concrete slabs, retaining walls, and structural bases",
        "Infrastructure supervision and project management",
      ],
    },

    regions: {
      title: "Regional Coverage",
      items: [
        "Northern Uganda: Water systems & rural infrastructure",
        "Central Uganda: Steel works & commercial buildings",
        "Eastern Uganda: Civil works & drainage systems",
        "Rural districts: Community development projects",
      ],
    },
  };

  return (
    <div className="relative overflow-hidden text-white">

      <Navbar />

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === index ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.4)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 overflow-y-auto">

        <div className="text-center max-w-6xl py-10">

          {/* HERO */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3">
            C & A CONTRACTORS LIMITED
          </h1>

          <p className="text-gray-200 max-w-3xl mx-auto mb-8">
            A trusted Ugandan construction company delivering water systems,
            steel structures, and civil engineering works across multiple regions.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">

            <Link href="/GetStarted" className="bg-white text-black py-3 px-6 rounded-full font-semibold">
              Get Started
            </Link>

            <Link href="/gallery" className="bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-full font-semibold">
              View Projects
            </Link>

            <Link href="/contact" className="border border-white py-3 px-6 rounded-full font-semibold">
              Contact Us
            </Link>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <h2 className="text-2xl font-bold">120+</h2>
              <p className="text-xs text-gray-300">Water Systems Delivered</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <h2 className="text-2xl font-bold">2,300 m²</h2>
              <p className="text-xs text-gray-300">Warehouse Coverage</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <h2 className="text-2xl font-bold">50,000+</h2>
              <p className="text-xs text-gray-300">Lives Impacted</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <h2 className="text-2xl font-bold">4+</h2>
              <p className="text-xs text-gray-300">Regions Covered</p>
            </div>

          </div>

          {/* TABS */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">

            <div className="flex flex-wrap justify-center gap-3 mb-6">

              {Object.keys(sections).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    activeTab === key
                      ? "bg-white text-black"
                      : "border border-white text-white"
                  }`}
                >
                  {sections[key].title}
                </button>
              ))}

            </div>

            <h3 className="text-xl font-bold mb-4">
              {sections[activeTab].title}
            </h3>

            <ul className="space-y-2 text-left text-gray-200">

              {sections[activeTab].items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-400">✔</span>
                  {item}
                </li>
              ))}

            </ul>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;