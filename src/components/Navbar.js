import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Home, Truck, CalendarCheck, Settings, Phone, Info, User, LogIn, LogOut, ChevronDown } from "lucide-react";

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const partnerData = localStorage.getItem("partner");

    if (token || partnerData) {
      setIsLoggedIn(true);
      setRole(userRole || "partner");
    } else {
      setIsLoggedIn(false);
      setRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole("");
    navigate("/login");
  };

  const DropdownItem = ({ to, label, icon, onClick }) => (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => 
          `flex items-center px-4 py-2 hover:bg-gray-100 transition duration-200 ${
            isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
          }`
        }
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </NavLink>
    </li>
  );

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-lime-600 hover:text-lime-700 transition">
          Home<span className="text-gray-900">Shifting</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItem to="/" label="Home" icon={<Home size={18} />} />
          <NavItem to="/Vehicle" label="Vehicle" icon={<Truck size={18} />} />
          
          {isLoggedIn && <NavItem to="/Booking" label="Booking" icon={<CalendarCheck size={18} />} />}
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-lg font-medium text-gray-700 hover:text-blue-500 transition duration-300 focus:outline-none"
            >
              <Settings size={18} className="mr-1" />
              Pages
              <ChevronDown size={16} className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50 border border-gray-100"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <ul className="py-1">
                  <DropdownItem 
                    to="/Contact" 
                    label="Contact" 
                    icon={<Phone size={16} />}
                    onClick={() => setDropdownOpen(false)} 
                  />
                  
                  {isLoggedIn && (
                    <DropdownItem 
                      to="/MyBooking" 
                      label="My Booking" 
                      icon={<CalendarCheck size={16} />}
                      onClick={() => setDropdownOpen(false)} 
                    />
                  )}
                  
                  <DropdownItem 
                    to="/About" 
                    label="About Us" 
                    icon={<Info size={16} />}
                    onClick={() => setDropdownOpen(false)} 
                  />
                  
                  {!isLoggedIn && (
                    <DropdownItem 
                      to="/partner/phome" 
                      label="Delivery Partners" 
                      icon={<User size={16} />}
                      onClick={() => setDropdownOpen(false)} 
                    />
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Login/Logout Button */}
        <div className="flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
            >
              <LogIn size={18} className="mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center text-lg font-medium px-3 py-2 rounded-md transition duration-300 ${
        isActive 
          ? "text-blue-600 bg-blue-50" 
          : "text-gray-700 hover:text-blue-500 hover:bg-blue-50"
      }`
    }
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </NavLink>
);

export default Navbar;