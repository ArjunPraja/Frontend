import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const PLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
// 👉 Check for hardcoded admin login
if (email === "admin@gmail.com" && password === "admin@gmail.com") {
  const adminUser = {
    email,
    role: "admin",
    name: "Admin User",
    uuid: "admin-uuid", // dummy uuid
  };

  // Simulate token
  const dummyToken = "admin-token-123";

  // Set values in localStorage
  localStorage.setItem("token", dummyToken);
  localStorage.setItem("role", "admin");
  localStorage.setItem("user", JSON.stringify(adminUser));

  alert("Logged in as Admin");
  return navigate("/admin/dashboard");
}


    try {
      const response = await axios.post("http://localhost:5000/partner/login", {
        email,
        password,
      });

      const { token, partner } = response.data;

      localStorage.setItem("partner_token", token);
      localStorage.setItem("partner", JSON.stringify(partner));

      navigate("/partner/Profile");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error.response?.data?.msg || error.message);
      setErrorMsg(error.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border-lime-500 border-l-4">
        <h2 className="text-3xl font-extrabold text-lime-600 text-center mb-6">
          Partner Login
        </h2>

        {errorMsg && (
          <p className="mb-4 text-center text-red-600 font-medium">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <Link to="/partner/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/partner/register" className="text-lime-600 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PLogin;
