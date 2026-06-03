"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      {/* HERO */}
      <div className="pt-28 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          About C & A Contractors Limited
        </h1>

        <p className="max-w-3xl mx-auto mt-4 text-gray-600">
          A trusted Ugandan civil engineering and construction company delivering
          sustainable infrastructure solutions in water systems, steel structures,
          and civil works.
        </p>
      </div>

      {/* COMPANY PROFILE */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">

        <div>
          <h2 className="text-2xl font-bold mb-3">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            C & A Contractors Limited is a civil engineering and construction firm
            specializing in water infrastructure, steel fabrication, and general
            civil works across Uganda. We focus on delivering durable, cost-effective,
            and sustainable engineering solutions for both public and private sector clients.
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Our projects span rural communities, urban developments, schools,
            health centers, and industrial facilities — with a strong commitment
            to quality and long-term impact.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-2xl font-bold mb-4">Core Values</h2>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Integrity in all engineering works</li>
            <li>✔ Quality-driven construction standards</li>
            <li>✔ Community-focused infrastructure development</li>
            <li>✔ Innovation in water and steel systems</li>
            <li>✔ Safety and compliance on all sites</li>
          </ul>
        </div>

      </div>

      {/* MISSION / VISION */}
      <div className="bg-black text-white py-16">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Our Mission</h2>
            <p className="text-gray-300">
              To deliver reliable and sustainable engineering solutions that improve
              infrastructure, access to clean water, and industrial development across Uganda.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Our Vision</h2>
            <p className="text-gray-300">
              To become a leading East African construction company recognized for
              excellence in civil engineering, water systems, and steel infrastructure.
            </p>
          </div>

        </div>

      </div>

      {/* EXPERIENCE STRIP */}
      <div className="py-16 text-center">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Our Experience
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">

          <div>
            <h3 className="text-3xl font-bold text-black">10+</h3>
            <p className="text-gray-600 text-sm">Years Experience</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">120+</h3>
            <p className="text-gray-600 text-sm">Water Systems</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">2,300 m²</h3>
            <p className="text-gray-600 text-sm">Steel Structures</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-black">50,000+</h3>
            <p className="text-gray-600 text-sm">Lives Impacted</p>
          </div>

        </div>

      </div>

    </div>
  );
}