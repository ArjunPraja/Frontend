import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      // Use setTimeout to ensure state updates complete before navigation
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { username, email, contact, password, confirmPassword } = formData;

    if (!username.trim()) newErrors.username = "Full Name is required";
    else if (!/^[a-zA-Z\s]{3,50}$/.test(username)) 
      newErrors.username = "Must be 3-50 characters and alphabets only";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) 
      newErrors.email = "Invalid email format";

    if (!contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(contact)) 
      newErrors.contact = "Must be exactly 10 digits";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) 
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) 
      newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    setShouldRedirect(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        password: formData.password,
        role: "User",
      };

      const response = await axios.post(
        "http://localhost:5000/register",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.data.success) {
        setServerMessage(response.data.message || "Registration successful! Redirecting...");
        setShouldRedirect(true); // Trigger the useEffect for navigation
      } else {
        setServerMessage(response.data.msg || "Registration completed with warnings");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 
                      error.response?.data?.error || 
                      "Registration failed. Please try again.";
      setServerMessage(errorMsg);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        {serverMessage && (
          <div className={`p-4 rounded relative ${
            serverMessage.toLowerCase().includes("success") ? 
            "bg-green-100 text-green-700" : 
            "bg-red-100 text-red-700"
          }`}>
            {serverMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Form fields remain exactly the same as in your working version */}
          {[
            { id: "username", type: "text", label: "Full Name", autoComplete: "name" },
            { id: "email", type: "email", label: "Email address", autoComplete: "email" },
            { id: "contact", type: "tel", label: "Contact Number", autoComplete: "tel" },
            { id: "password", type: "password", label: "Password", autoComplete: "new-password" },
            { id: "confirmPassword", type: "password", label: "Confirm Password", autoComplete: "new-password" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="sr-only">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.label}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors[field.id] ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                value={formData[field.id]}
                onChange={handleChange}
              />
              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;