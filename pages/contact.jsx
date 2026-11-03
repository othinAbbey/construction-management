"use client";

import { useState } from "react";
import { api } from "../lib/pm";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // hidden spam trap: real visitors never fill it
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [status, setStatus] = useState({ kind: "", text: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ kind: "", text: "" });
    try {
      await api("/api/contact", { method: "POST", auth: false, body: form });
      setStatus({ kind: "ok", text: "Thank you. Your message has been received and we will reply soon." });
      setForm({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (err) {
      setStatus({ kind: "error", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">


      {/* HERO */}
      <div className="pt-12 text-center px-4">
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
            required
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <textarea
            name="message"
            required
            minLength={5}
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          {/* hidden spam trap */}
          <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {status.text && (
            <div className={`p-3 rounded text-sm text-left ${status.kind === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {status.text}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Message"}
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

    </div>
  );
}