import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      // If not admin, proceed with normal login flow
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { token, user, msg } = response.data;
      alert(msg);

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-green-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
