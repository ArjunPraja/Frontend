import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

const ARides = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/rides');
        setRides(res.data);
      } catch (error) {
        console.error('Error fetching ride data:', error);
      }
    };

    fetchRides();
  }, []);

  return (
    <div className="p-6 min-h-screen pt-24">
      <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Truck size={28} /> All Ride Bookings
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Truck Partner</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Total Trip</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Start Time</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Expiry Time</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Today's Earning</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Total Earning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rides.map((ride, index) => (
              <tr key={index} className="hover:bg-purple-50 transition duration-200">
                <td className="px-6 py-4">{ride.Booking_ID}</td>
                <td className="px-6 py-4">{ride.truckpartner}</td>
                <td className="px-6 py-4">{ride.total_trip}</td>
                <td className="px-6 py-4">
                  {new Date(ride.start_time).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(ride.expiry_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-green-700 font-semibold">₹{ride.today_earning}</td>
                <td className="px-6 py-4 text-blue-700 font-semibold">₹{ride.total_earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ARides;
