import React from "react";
import { FaTruckMoving, FaMapMarkedAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-white py-16 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-10 relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-200 rounded-full opacity-30 animate-pulse"></div>
        
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-lime-700 text-center mb-8 tracking-wide">
          About <span className="text-gray-900">Us</span>
        </h2>

        {/* First Section */}
        <div className="flex items-start gap-4 mb-6">
          <FaTruckMoving className="text-lime-600 text-4xl mt-1" />
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong className="text-lime-700">"Home shifting"</strong> refers to the process of relocating or moving from one residence to another. It involves transporting household belongings, furniture, and personal items from the current home to a new one.
            <br />
            <br />
            Our service is exclusively available in <span className="font-semibold text-lime-700">Ahmedabad</span>, ensuring personalized and efficient handling of your move.
          </p>
        </div>

        {/* Second Section */}
        <div className="flex items-start gap-4">
          <FaMapMarkedAlt className="text-blue-600 text-4xl mt-1" />
          <p className="text-lg text-gray-700 leading-relaxed">
            When people need to shift homes, they turn to professional movers. Our team is trained, trusted, and dedicated to making your transition <span className="font-semibold text-blue-700">smooth, secure, and stress-free</span>.
            <br />
            <br />
            Whether it’s a local apartment or a full family house, we treat every move with the care it deserves.
          </p>
        </div>

        {/* Quote or Tagline */}
        <div className="mt-10 text-center italic text-gray-600">
          <p>“We don’t just move belongings — we move comfort, trust, and happiness.”</p>
        </div>
      </div>
    </div>
  );
};

export default About;
