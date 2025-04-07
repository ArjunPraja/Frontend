import React from 'react';
import { useNavigate } from "react-router-dom";

function Vehical() {
  const navigate = useNavigate();

  const handleBooking = () => {
    const isLoggedIn = localStorage.getItem("token"); // or use your actual auth token key
    if (isLoggedIn) {
      navigate("/booking");
    } else {
      alert("Please login first!");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Vehicle Types Section */}
      <div className="h-fit bg-white-50 min-h-screen pt-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 text-gray-900 drop-shadow-lg shadow-green-500">
          Types Of <span className="text-lime-500 drop-shadow-2xl shadow-green-500">Vehicle</span>
        </h1>

        <div className="flex flex-col md:flex-row flex-wrap justify-center mb-10">
          {[{ label: "1 BHK" }, { label: "2 BHK" }, { label: "3 BHK" }].map((item, index) => (
            <div key={index} className="h-auto w-full md:w-1/2 lg:w-1/4 p-4 md:p-6">
              <div className="h-full bg-white-100 shadow-2xl shadow-green-500 rounded-2xl text-center p-4">
                <img
                  src={`/images/tata${index === 2 ? "2" : ""}.svg`}
                  className="img-fluid rounded-top h-32 md:h-48 mx-auto"
                  alt="Vehicle type"
                />
                <p className="text-xl font-bold hover:text-green-500 mt-4 md:mt-8">{item.label}</p>
                <hr className="border-black border-2 mb-4 mt-2" />
                <button
                  onClick={handleBooking}
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
      <div className="h-fit w-full p-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 text-gray-900 drop-shadow-lg shadow-green-500">
          See Our <span className="text-lime-500 drop-shadow-2xl shadow-green-500">Pricing</span>
        </h1>

        <div className="flex flex-col md:flex-row flex-wrap justify-center">
          {[
            { label: "1 BHK", price: "₹ 4000" },
            { label: "2 BHK", price: "₹ 6000" },
            { label: "3 BHK", price: "₹ 8000" },
            { label: "4 BHK", price: "₹ 10000" },
          ].map((item, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/4 p-4">
              <div className="h-full bg-white-100 shadow-2xl shadow-green-500 rounded-2xl text-center p-4">
                <p className="text-2xl font-bold hover:text-green-500 mt-4">{item.label}</p>
                <p className="text-2xl font-bold hover:text-green-500 mb-16">{item.price}</p>
                <div className="my-6 text-left px-2">
                  <p className="mb-2">✓ 6x7 fit Vehicle will be sent</p>
                  <p className="mb-2">✓ After Booking 45 Minutes Vehicle Will reach your location</p>
                  <p className="mb-16">✓ Secure Payment</p>
                </div>
                <button
                  onClick={handleBooking}
                  className="h-12 w-32 bg-black text-white text-xl rounded-lg hover:bg-green-500 hover:text-black mt-4 mb-2"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="h-fit w-full bg-white-100 shadow-2xl shadow-green-500 mt-16 p-6 mb-32">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="text-center md:text-left md:w-1/2 mb-8 mt-8 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">Let's begin with Home Shifting.</h1>
          </div>
          <div className="md:w-1/2 mt-8">
            <p className="text-lg mb-4">
              Shift Your Home From Anywhere Anytime in Ahmedabad. If You Face Some
              Problem So Contact Us our team will try to solve Your Problem As Soon As Possible.
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

export default Vehical;
