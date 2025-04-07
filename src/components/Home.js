import React from 'react';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user"); // assuming 'user' is stored in localStorage on login

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to track your goods.");
      navigate("/login");
      return;
    }

    const trackingId = e.target.tracking_id.value;
    if (trackingId) {
      navigate(`/track/${trackingId}`);
    }
  };

  const handleBook = () => {
    if (!isLoggedIn) {
      alert("Please log in to book a vehicle.");
      navigate("/login");
    } else {
      navigate("/book");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-blue-50 flex flex-col items-center justify-center px-4 relative pb-32">
        <div className="h-96 w-full flex items-center justify-center text-center">
          <h1 className="text-black font-bold text-4xl md:text-5xl lg:text-6xl">
            Track Your <span className="text-lime-500">Fleet</span>
          </h1>
        </div>

        {/* Tracking Form */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl p-4 md:p-8 rounded-3xl bg-white shadow-2xl">
          <h1 className="text-black font-bold text-xl md:text-2xl text-left mb-4">Track your goods</h1>
          <form className="space-y-4" onSubmit={handleTrackSubmit}>
            <div>
              <label htmlFor="tracking_id" className="block text-gray-700 font-medium">Tracking ID</label>
              <input
                id="tracking_id"
                name="tracking_id"
                type="number"
                placeholder="Enter your tracking ID"
                className="border border-gray-300 rounded-lg p-3 w-full h-12 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white h-12 text-xl rounded-full transition duration-300 hover:bg-green-500 hover:scale-105"
            >
              Track Now
            </button>
          </form>
        </div>
      </div>

      {/* Vehicle Types Section */}
      <div className="mt-32 md:mt-40 p-4 md:p-8 bg-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 text-gray-900 drop-shadow-lg shadow-green-500">
          Types Of <span className="text-lime-500">Vehicle</span>
        </h1>

        <div className="flex flex-wrap justify-center mt-10">
          {["1 BHK", "2 BHK", "3 BHK"].map((type, i) => (
            <div key={i} className="w-full md:w-1/2 lg:w-1/4 p-4">
              <div className="bg-white shadow-2xl shadow-green-500 rounded-2xl text-center p-4">
                <img
                  src={`/images/tata${i === 2 ? "2" : ""}.svg`}
                  alt="Vehicle type"
                  className="h-32 md:h-48 mx-auto"
                />
                <p className="text-xl font-bold hover:text-green-500 mt-4">{type}</p>
                <hr className="border-black border-2 my-2" />
                <button
                  onClick={handleBook}
                  className="h-12 w-32 bg-black text-white text-xl rounded-lg hover:bg-green-500 hover:text-black"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full p-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 text-gray-900 drop-shadow-lg shadow-green-500">
          See Our <span className="text-lime-500">Pricing</span>
        </h1>

        <div className="flex flex-wrap justify-center mt-10">
          {[
            { type: "1 BHK", price: 4000 },
            { type: "2 BHK", price: 6000 },
            { type: "3 BHK", price: 8000 },
            { type: "4 BHK", price: 10000 }
          ].map((item, i) => (
            <div key={i} className="w-full md:w-1/2 lg:w-1/4 p-4">
              <div className="bg-white shadow-2xl shadow-green-500 rounded-2xl text-center p-4">
                <p className="text-2xl font-bold hover:text-green-500 mt-4">{item.type}</p>
                <p className="text-2xl font-bold hover:text-green-500 mb-4">₹ {item.price}</p>
                <div className="text-left px-2 mb-6">
                  <p className="mb-2">✓ 6x7 fit Vehicle will be sent</p>
                  <p className="mb-2">✓ Within 45 Minutes vehicle will arrive</p>
                  <p>✓ Secure Payment</p>
                </div>
                <button
                  onClick={handleBook}
                  className="h-12 w-32 bg-black text-white text-xl rounded-lg hover:bg-green-500 hover:text-black mt-2"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white shadow-2xl shadow-green-500 mt-16 p-6 mb-32">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="text-center md:text-left md:w-1/2 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Let's begin with Home Shifting.</h1>
          </div>
          <div className="md:w-1/2">
            <p className="text-lg mb-4">
              Shift your home from anywhere anytime in Ahmedabad. If you face any issue, contact our support team.
            </p>
            <button
              onClick={() => navigate("/Contact")}
              className="h-12 w-32 bg-black text-white text-xl rounded-lg hover:bg-green-500 hover:text-black"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
