"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted successfully (connect backend later)");
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      {/* HERO */}
      <div className="pt-28 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Contact Us
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Get in touch for project inquiries, quotations, or partnership opportunities.
        </p>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Send Message
          </button>

        </form>

        {/* INFO PANEL */}
        <div className="bg-black text-white p-6 rounded-xl">

          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Company Information
          </h2>

          <p className="text-gray-300 mb-4">
            C & A Contractors Limited<br />
            Civil Engineering & Construction Services
          </p>

          <p className="text-gray-300 mb-2">
            📍 Uganda (Operations Nationwide)
          </p>

          <p className="text-gray-300 mb-2">
            📞 +256 393242423
          </p>

          <p className="text-gray-300 mb-2">
            📧 cacontractorslimited@gmail.com
          </p>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">
              We respond within 24–48 hours for all project inquiries.
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}