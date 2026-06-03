"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Gallery() {
  const categories = [
    {
      id: "steel",
      title: "Steel Construction",
      folder: "/assets/steel-projects",
      projects: [
        {
          image: "strf1.jpeg",
          title: "Warehouse Steel Structure",
          description:
            "Fabrication and installation of large-scale steel warehouse frame.",
          location: "Central Uganda",
        },
        {
          image: "strf2.jpeg",
          title: "Industrial Roofing System",
          description:
            "Roofing system installation for commercial storage facility.",
          location: "Kampala",
        },
        {
          image: "strf3.jpeg",
          title: "Steel Frame Construction",
          description:
            "Structural steel framework for multi-purpose building.",
          location: "Entebbe",
        },
      ],
    },

    {
      id: "water",
      title: "Water Projects",
      folder: "/assets/water-projects",
      projects: [
        {
          image: "psp.JPG",
          title: "Borehole Motorisation System",
          description:
            "Successfully motorised 2 boreholes feeding a 100m³ storage tank for continuous water supply.",
          location: "Northern Uganda",
        },
        {
          image: "Motorised borehole.JPG",
          title: "Automated Borehole Upgrade",
          description:
            "Installed pumping automation system improving water distribution efficiency.",
          location: "Gulu District",
        },
        {
          image: "solar station.JPG",
          title: "Solar Water Pumping System",
          description:
            "Solar-powered pumping station reducing operational costs and improving sustainability.",
          location: "Lira District",
        },
        {
          image: "Inspection chamber.JPG",
          title: "Water Distribution Network",
          description:
            "Inspection chamber and pipeline system for community water distribution.",
          location: "Arua",
        },
      ],
    },
  ];

  const [active, setActive] = useState("steel");
  const activeCategory = categories.find((c) => c.id === active);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">

      <Navbar />

      {/* HEADER */}
      <div className="text-center pt-24 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Project Gallery
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          A showcase of completed infrastructure projects across Uganda —
          steel structures, water systems, and civil engineering works.
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center flex-wrap gap-3 mb-10 px-4">

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border
              ${
                active === cat.id
                  ? "bg-black text-white border-black shadow-lg scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
              }
            `}
          >
            {cat.title}
          </button>
        ))}

      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">

        {activeCategory.projects.map((project, index) => (
          <div
            key={index}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >

            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={`${activeCategory.folder}/${project.image}`}
                alt={project.title}
                className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h3 className="text-sm font-bold text-gray-800">
                {project.title}
              </h3>

              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {project.description}
              </p>

              <p className="text-xs text-blue-600 mt-3 font-medium">
                📍 {project.location}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* FOOTER STRIP */}
      <div className="bg-black text-white py-10 text-center">

        <h2 className="text-xl font-bold text-yellow-400">
          C & A Contractors Limited
        </h2>

        <p className="text-gray-300 text-sm mt-2">
          Delivering reliable infrastructure across Uganda
        </p>

      </div>
    </div>
   
  );
}