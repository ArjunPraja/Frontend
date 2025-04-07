import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

const ABooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 min-h-screen pt-24">
      <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Truck size={28} /> All Bookings
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Booking Name</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">From</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">To</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">State</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Zip</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Price</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-purple-50 transition duration-200">
                  <td className="px-6 py-4">{booking.bname}</td>
                  <td className="px-6 py-4">{booking.movefrom}</td>
                  <td className="px-6 py-4">{booking.moveto}</td>
                  <td className="px-6 py-4">{booking.state}</td>
                  <td className="px-6 py-4">{booking.zipcode}</td>
                  <td className="px-6 py-4 text-green-700 font-semibold">₹{booking.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        booking.status === 'cancel'
                          ? 'bg-red-100 text-red-600'
                          : booking.status === 'finish'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ABooking;
