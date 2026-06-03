import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Link from "next/link";

const serviceCategories = [
  {
    title: "Civil Engineering Works",
    description:
      "End-to-end civil construction services for infrastructure development across Uganda.",
    items: [
      "Road drainage & culverts",
      "Site clearing & excavation",
      "Concrete works (slabs, foundations, retaining walls)",
      "Project supervision & site management",
    ],
  },
  {
    title: "Water Infrastructure Systems",
    description:
      "Design and installation of sustainable water supply systems for communities and institutions.",
    items: [
      "Borehole motorisation systems",
      "Pump installation & pipeline networks",
      "School & health facility water systems",
      "Rural water supply projects",
    ],
  },
  {
    title: "Steel & Structural Works",
    description:
      "Heavy-duty steel fabrication and industrial structural engineering solutions.",
    items: [
      "Warehouse construction (2,300+ sqm)",
      "Steel roofing structures",
      "Industrial sheds & frames",
      "Commercial steel fabrication",
    ],
  },
  {
    title: "Planning & Cost Engineering",
    description:
      "Accurate estimation, materials planning, and project cost control.",
    items: [
      "Materials take-off & estimation",
      "Budget planning & control",
      "Site feasibility studies",
      "Project scheduling",
    ],
  },
];

function Services() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">

      <Navbar />

      {/* HERO */}
      <div className="pt-28 text-center px-4">

        <h1
          className={`text-4xl md:text-5xl font-extrabold text-gray-800 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Our Engineering Services
        </h1>

        <p
          className={`max-w-3xl mx-auto text-gray-600 mt-4 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Delivering high-quality infrastructure solutions across Uganda —
          water systems, steel works, and civil engineering projects.
        </p>

      </div>

      {/* SERVICES GRID */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid gap-6 sm:grid-cols-2">

        {serviceCategories.map((service, index) => (
          <div
            key={index}
            className={`relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] group
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
            style={{ transitionDelay: `${index * 150}ms` }}
          >

            {/* glow accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <h2 className="text-xl font-bold text-gray-800 mb-2 relative z-10">
              {service.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4 relative z-10">
              {service.description}
            </p>

            <ul className="space-y-2 mb-6 relative z-10">

              {service.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="text-green-600 font-bold">✔</span>
                  {item}
                </li>
              ))}

            </ul>

            <Link
              href="/contact"
              className="relative z-10 inline-block bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300"
            >
              Request Service
            </Link>

          </div>
        ))}

      </div>

      {/* STATS SECTION */}
      <div className="bg-black text-white py-14">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-6 text-center">

          {[
            ["120+", "Water Systems Delivered"],
            ["2,300 m²", "Steel Coverage Built"],
            ["50,000+", "Lives Impacted"],
            ["4+", "Regions Covered"],
          ].map((stat, i) => (
            <div
              key={i}
              className="opacity-0 animate-fadeUp"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}
            >
              <h3 className="text-3xl font-bold text-yellow-400">
                {stat[0]}
              </h3>
              <p className="text-sm text-gray-300">{stat[1]}</p>
            </div>
          ))}

        </div>

      </div>

      <Footer />

      {/* ANIMATION KEYFRAMES */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeUp {
          animation: fadeUp 0.8s ease forwards;
        }
      `}</style>

    </div>
  );
}

export default Services;