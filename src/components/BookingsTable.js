import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.id || !token) {
          setError("User ID or token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/bookings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id, token]);

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 min-h-screen pt-24">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-400 drop-shadow">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 text-gray-400">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-500">No bookings found</p>
          <p className="text-gray-400 mt-2">Your booking history will appear here</p>
          <Link
            to="/booking"
            className="mt-4 inline-block px-6 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
          >
            Make a Booking
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl shadow-lime-300">
          <table className="min-w-full bg-white text-sm text-left border-collapse">
            <thead className="bg-lime-500 text-white uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">House-type</th>
                <th className="px-6 py-4">Move from</th>
                <th className="px-6 py-4">Move to</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Zip code</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Payment ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="border-b hover:bg-lime-50 transition duration-300"
                >
                  <td className="px-6 py-4 font-semibold">{index + 1}</td>
                  <td className="px-6 py-4">{booking.bname}</td>
                  <td className="px-6 py-4">{booking.htype}</td>
                  <td className="px-6 py-4">{booking.movefrom}</td>
                  <td className="px-6 py-4">{booking.moveto}</td>
                  <td className="px-6 py-4">{booking.state}</td>
                  <td className="px-6 py-4">{booking.zipcode}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">₹{booking.price}</td>
                  <td className="px-6 py-4 text-xs break-all">{booking.razorpay_order_id || "N/A"}</td>
                  <td className="px-6 py-4 text-xs break-all">{booking.razorpay_payment_id || "N/A"}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/booking/status/${booking._id}`}
                      className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
                        booking.status === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : booking.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status !== "Cancelled" ? (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this booking?")) {
                            cancelBooking(booking._id);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;