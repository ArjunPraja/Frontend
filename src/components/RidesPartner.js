import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClock, FiDollarSign, FiMapPin, FiUser, FiTruck, FiCalendar } from "react-icons/fi";

function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [myRideHistory, setMyRideHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    const partner = JSON.parse(localStorage.getItem("partner"));
    const token = localStorage.getItem("partner_token");

    if (!partner || !token) {
      console.warn("Partner or token not found in localStorage.");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch available rides
        const ridesRes = await axios.get("http://localhost:5000/bookings/payment-status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const availableRides = ridesRes.data.data.filter(
          ride => ride.payment_status_active && !ride.finish_active && !ride.cancel_active
        );
        setRides(availableRides);

        // Fetch ride history
        const historyRes = await axios.get(
          `http://localhost:5000/api/rides/partner/${partner._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyRideHistory(historyRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmRide = async (ride) => {
    if (!ride || !ride._id) return;

    setConfirming(true);
    try {
      const token = localStorage.getItem("partner_token");
      const partner = JSON.parse(localStorage.getItem("partner"));

      const rideData = {
        Booking_ID: ride._id,
        truckpartner: partner._id,
        total_trip: 1,
        start_time: new Date(),
        expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
        today_earning: ride.price,
        total_earning: ride.price,
        originalBooking: ride._id,
      };

      await axios.post("http://localhost:5000/api/rides", rideData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setRides(prev => prev.filter(r => r._id !== ride._id));
      setMyRideHistory(prev => [{
        ...rideData,
        bookingDetails: ride,
        _id: Date.now().toString() // temporary ID for UI
      }, ...prev]);

      alert(`Ride confirmed successfully! Booking ID: ${ride._id}`);
    } catch (err) {
      console.error("Error confirming ride:", err);
      alert("Failed to confirm ride. Please try again.");
    } finally {
      setConfirming(false);
      setSelectedRide(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Your Rides Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your available rides and view your ride history
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 font-medium text-sm flex-1 text-center ${activeTab === "available" ? "text-lime-600 border-b-2 border-lime-500" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("available")}
            >
              Available Rides
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm flex-1 text-center ${activeTab === "history" ? "text-lime-600 border-b-2 border-lime-500" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("history")}
            >
              My Ride History
            </button>
          </div>

          <div className="p-6">
            {activeTab === "available" ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Rides</h2>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-500"></div>
                  </div>
                ) : rides.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiTruck className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No rides available</h3>
                    <p className="text-gray-500 mt-1">Check back later for new ride opportunities</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride) => (
                      <div
                        key={ride._id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {ride.movefrom} → {ride.moveto}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                              ₹{ride.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FiUser className="mr-2 text-gray-400" />
                              <span>{ride.bname}</span>
                            </div>
                            <div className="flex items-center">
                              <FiMapPin className="mr-2 text-gray-400" />
                              <span>{ride.state}, {ride.zipcode}</span>
                            </div>
                            {ride.htype && (
                              <div className="flex items-center">
                                <FiMapPin className="mr-2 text-gray-400" />
                                <span>House Type: {ride.htype}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 px-5 py-3">
                          <button
                            onClick={() => {
                              setSelectedRide(ride);
                            }}
                            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                          >
                            <FiTruck className="mr-2" />
                            Accept This Ride
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Ride History</h2>
                {historyLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-500"></div>
                  </div>
                ) : myRideHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiClock className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">No ride history yet</h3>
                    <p className="text-gray-500 mt-1">Your completed rides will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRideHistory.map((ride) => (
                      <div
                        key={ride._id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                            {ride.bookingDetails?.movefrom || "N/A"} → {ride.bookingDetails?.moveto || "N/A"}
                          </h3>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                              ₹{ride.today_earning.toLocaleString()}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Trip #{ride.total_trip}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 text-gray-400" />
                            <span>Started: {formatDate(ride.start_time)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-gray-400" />
                            <span>Completed: {formatDate(ride.expiry_time)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-gray-400" />
                            <span>Customer: {ride.bookingDetails?.bname || "N/A"}</span>
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="mr-2 text-gray-400" />
                            <span>Booking ID: {ride.Booking_ID}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Ride Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Ride Assignment</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{selectedRide.movefrom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{selectedRide.moveto}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{selectedRide.bname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">₹{selectedRide.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-medium text-sm break-all">{selectedRide.razorpay_payment_id}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">By confirming, you agree to:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-block bg-lime-100 text-lime-800 rounded-full p-1 mr-2">
                        <FiClock className="h-3 w-3" />
                      </span>
                      Complete the ride within 24 hours
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-lime-100 text-lime-800 rounded-full p-1 mr-2">
                        <FiTruck className="h-3 w-3" />
                      </span>
                      Be responsible for the goods during transit
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block bg-lime-100 text-lime-800 rounded-full p-1 mr-2">
                        <FiDollarSign className="h-3 w-3" />
                      </span>
                      Payment will be processed after delivery
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedRide(null)}
                  disabled={confirming}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmRide(selectedRide)}
                  disabled={confirming}
                  className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  {confirming ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Confirming...
                    </>
                  ) : (
                    "Confirm Assignment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableRides;