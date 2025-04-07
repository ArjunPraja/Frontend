import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const packageOptions = [
  { type: "Silver", price: 10000 },
  { type: "Gold", price: 20000 },
  { type: "Platinum", price: 30000 },
];

const vehicleTypes = [
  { label: "Mini Truck (6x7)", value: "Mini Truck - 6x7" },
  { label: "Pickup Van (6x7)", value: "Pickup Van - 6x7" },
  { label: "Large Truck (5.5x14)", value: "Large Truck - 5.5x14" },
  { label: "Container (5.5x14)", value: "Container - 5.5x14" },
];

function BuyPackage() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [price, setPrice] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handlePackageChange = (e) => {
    const selected = packageOptions.find((p) => p.type === e.target.value);
    setSelectedPackage(selected.type);
    setPrice(selected.price);

    const dimension = selected.type === "Platinum" ? "5.5x14" : "6x7";
    const matchingVehicle = vehicleTypes.find((v) =>
      v.value.includes(dimension)
    );
    if (matchingVehicle) {
      setVehicle(matchingVehicle.value);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPackage || !price || !vehicle || !email) {
      setMessage("Please fill all fields.");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const orderRes = await axios.post("http://localhost:5000/api/buy-package/order", {
        amount: price,
        email,
      });

      const { order, key } = orderRes.data;

      const options = {
        key: key, // ✅ use dynamic key
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Truck Partner Package",
        description: `${selectedPackage} Package`,
        handler: async function (response) {
          const verifyRes = await axios.post("http://localhost:5000/api/buy-package/verify", {
            email,
            selectedPackage,
            price,
            vehicle,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          setMessage(verifyRes.data.message);
          navigate("/partner/Plogin"); 
        },
        prefill: {
          email,
        },
        theme: {
          color: "#84cc16",
        },

      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage("Error processing payment.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-lime-100 to-lime-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-lime-600 mb-6">
          Buy Package
        </h2>
        {message && (
          <div className="mb-4 text-center text-lg font-semibold text-blue-600">
            {message}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Select Package</label>
            <select
              value={selectedPackage}
              onChange={handlePackageChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Choose --</option>
              {packageOptions.map((option, i) => (
                <option key={i} value={option.type}>{option.type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price</label>
            <input type="text" value={price} readOnly className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Vehicle Type</label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Vehicle --</option>
              {vehicleTypes.map((type, i) => (
                <option key={i} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-600 text-white font-semibold py-2 rounded-md hover:bg-lime-700"
          >
            Submit & Pay
          </button>
        </form>
      </div>
    </div>
  );
}

export default BuyPackage;
