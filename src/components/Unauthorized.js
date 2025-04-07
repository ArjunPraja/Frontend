import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
