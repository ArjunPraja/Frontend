import React, { useState } from 'react';
import axios from 'axios';

function Booking() {
  const [form, setForm] = useState({
    bname: '',
    htype: '',
    price: '',
    movefrom: '',
    moveto: '',
    state: '',
    zipcode: '',
  });

  const [loading, setLoading] = useState(false);

  const housePrices = {
    '1bhk': 8000,
    '2bhk': 10000,
    '3bhk': 12000,
    '4bhk': 15000,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'htype') {
      setForm((prev) => ({
        ...prev,
        htype: value,
        price: housePrices[value] || '',
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id || userData?._id;

    if (!userId) {
      return alert("User not logged in");
    }

    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      return alert("Failed to load Razorpay SDK");
    }

    try {
      setLoading(true);

      const orderRes = await axios.post("http://localhost:5000/api/bookings/create-order", {
        ...form,
        userid: userId,
      });

      const { order } = orderRes.data;

      const options = {
        key: "rzp_test_c24H9ZLQiaptXy",
        amount: order.amount,
        currency: "INR",
        name: "BookMyRide",
        description: "Booking Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/bookings/confirm", {
              ...form,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              userid: userId,
            });
            alert("✅ Booking Successful");
            window.location.href = "/MyBooking";
          } catch (error) {
            console.error(error);
            alert("❌ Booking confirmation failed");
          }
        },
        prefill: {
          name: form.bname,
          email: userData?.email,
        },
        theme: {
          color: "#00FF7F",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (response) => {
        alert("❌ Payment Failed. Please try again.");
        console.error(response.error);
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 bg-gray-100">
      <div className="p-8 rounded-2xl shadow-2xl shadow-green-500 bg-white w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6">
          BOOKING <span className="text-lime-500">RIDE</span>
        </h1>
        <form className="space-y-4" onSubmit={handlePayment}>
          <input
            type="text"
            name="bname"
            placeholder="Full Name"
            value={form.bname}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={40}
            className="w-full border p-3 rounded outline-lime-500"
          />

          <select
            name="htype"
            required
            value={form.htype}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-lime-500"
          >
            <option value="">Select House Type</option>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
            <option value="4bhk">4 BHK</option>
          </select>

          <input
            type="text"
            name="price"
            placeholder="Price"
            value={form.price}
            readOnly
            className="w-full border p-3 rounded bg-gray-100 text-gray-600"
          />

          <input
            type="text"
            name="movefrom"
            placeholder="Moving From"
            required
            value={form.movefrom}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-lime-500"
          />

          <input
            type="text"
            name="moveto"
            placeholder="Moving To"
            required
            value={form.moveto}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-lime-500"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            required
            value={form.state}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-lime-500"
          />

          <input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            required
            pattern="\d{6}"
            title="Enter a valid 6-digit zipcode"
            value={form.zipcode}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-lime-500"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !form.bname ||
              !form.htype ||
              !form.price ||
              !form.movefrom ||
              !form.moveto ||
              !form.state ||
              !form.zipcode
            }
            className={`w-full text-white p-3 rounded transition duration-300 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? "Processing..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
