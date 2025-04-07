import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();
    // You'd typically send this info to the backend to trigger OTP
    console.log("Send code to:", email, mobile);
  };

  const handleVerifyAndReset = (e) => {
    e.preventDefault();
    // Verify the code and redirect to reset password screen
    console.log("Verification code entered:", code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 to-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-lime-400 border-l-4">
        <h2 className="text-2xl font-extrabold text-lime-600 text-center mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered mobile number and email to receive a verification code.
        </p>

        <form className="space-y-4" onSubmit={handleSendCode}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-lime-500"
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-lime-500"
              placeholder="Enter email address"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 rounded-md transition"
          >
            Send Verification Code
          </button>
        </form>

        <form className="mt-6 space-y-4" onSubmit={handleVerifyAndReset}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enter Verification Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-lime-500"
              placeholder="Enter the code you received"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition"
          >
            Verify & Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
