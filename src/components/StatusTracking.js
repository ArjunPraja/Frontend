import React from "react";
import { useParams } from "react-router-dom";

function BookingStatus() {
  const { id } = useParams(); // Booking ID passed in URL

  // This would usually come from backend, dummy for now:
  const statuses = [
    "House-Type Selected",
    "Booking Confirmed",
    "On The Way",
    "Cancelled",
    "Finished",
  ];

  // Fake current status based on id just for demo
  const currentStatus = parseInt(id) % statuses.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Booking Status Tracker
      </h1>
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6">
        <ol className="relative border-l border-blue-300 ml-4">
          {statuses.map((status, index) => (
            <li key={index} className="mb-6 ml-4">
              <div
                className={`absolute w-3 h-3 rounded-full -left-1.5 ${
                  index <= currentStatus ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <p
                className={`text-lg font-medium ${
                  index <= currentStatus ? "text-blue-800" : "text-gray-500"
                }`}
              >
                {status}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default BookingStatus;
