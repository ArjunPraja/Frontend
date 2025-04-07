import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", form);
      alert("✅ Your message has been sent!");
      setForm({ name: "", email: "", number: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send message. Try again.");
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen pt-24'>
      <div className='bg-white shadow-2xl shadow-lime-300 border border-lime-200 rounded-3xl p-10 w-full max-w-xl'>
        <h1 className='text-3xl md:text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-400 drop-shadow'>
          GOT ANY QUESTIONS?
        </h1>

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Name</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              required
              placeholder='Enter your Name'
              className='w-full p-3 border border-lime-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              required
              placeholder='Enter your Email'
              className='w-full p-3 border border-lime-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Contact Number</label>
            <input
              type='text'
              name='number'
              value={form.number}
              onChange={handleChange}
              required
              placeholder='Enter your Contact Number'
              className='w-full p-3 border border-lime-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Message</label>
            <textarea
              name='message'
              value={form.message}
              onChange={handleChange}
              required
              placeholder='Enter your Message'
              rows={4}
              className='w-full p-3 border border-lime-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 transition resize-none'
            ></textarea>
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              className='bg-gradient-to-r from-lime-500 to-green-400 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
