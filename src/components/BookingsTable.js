// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user")); // 👤 User from localStorage
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         if (!user?.id || !token) {
//           console.error("User ID or token not found");
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:5000/api/bookings/user/${user.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setBookings(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [user?.id, token]);

//   if (loading)
//     return (
//       <div className="text-center mt-10 text-lg">Loading your bookings...</div>
//     );

//   return (
//     <div className="px-4 sm:px-8 lg:px-16 min-h-screen pt-24">
//       <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-400 drop-shadow">
//         My Bookings
//       </h2>

//       {bookings.length === 0 ? (
//         <p className="text-center text-gray-500">No bookings found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-2xl shadow-2xl shadow-lime-300">
//           <table className="min-w-full bg-white text-sm text-left border-collapse">
//             <thead className="bg-lime-500 text-white uppercase text-xs font-semibold">
//               <tr>
//                 <th className="px-6 py-4">No</th>
//                 <th className="px-6 py-4">Name</th>
//                 <th className="px-6 py-4">House-type</th>
//                 <th className="px-6 py-4">Move from</th>
//                 <th className="px-6 py-4">Move to</th>
//                 <th className="px-6 py-4">State</th>
//                 <th className="px-6 py-4">Zip code</th>
//                 <th className="px-6 py-4">Price</th>
//                 <th className="px-6 py-4">Order ID</th>
//                 <th className="px-6 py-4">Payment ID</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {bookings.map((booking, index) => (
//                 <tr
//                   key={booking._id || index}
//                   className="border-b hover:bg-lime-50 transition duration-300"
//                 >
//                   <td className="px-6 py-4 font-semibold">{index + 1}</td>
//                   <td className="px-6 py-4">{booking.bname}</td>
//                   <td className="px-6 py-4">{booking.htype}</td>
//                   <td className="px-6 py-4">{booking.movefrom}</td>
//                   <td className="px-6 py-4">{booking.moveto}</td>
//                   <td className="px-6 py-4">{booking.state}</td>
//                   <td className="px-6 py-4">{booking.zipcode}</td>
//                   <td className="px-6 py-4 text-green-600 font-semibold">
//                     ₹{booking.price}
//                   </td>
//                   <td className="px-6 py-4 text-xs break-all">
//                     {booking.razorpay_order_id || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 text-xs break-all">
//                     {booking.razorpay_payment_id || "N/A"}
//                   </td>
//                   <td className="px-6 py-4">
//                     <Link
//                       to={`/booking/status/${booking._id}`}
//                       className="px-3 py-1 rounded-full text-white text-xs bg-blue-600 hover:bg-blue-700 transition"
//                     >
//                       {booking.status || "Pending"}
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg transition"
//                       onClick={() => alert("Cancel feature coming soon")}
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.id || !token) {
          console.error("User ID or token not found");
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
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading your bookings...</div>;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 min-h-screen pt-24">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-400 drop-shadow">
        My Bookings
      </h2>

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
                key={booking._id}
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
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    booking.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : booking.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {booking.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {booking.status !== "Cancelled" ? (
                    <button
                      onClick={() => cancelBooking(booking._id)}
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
    </div>
  );
};

export default MyBookings;  





