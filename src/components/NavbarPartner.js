import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Home, Contact, User, Wallet, Settings, Truck, LogIn, LogOut, UserPlus } from 'lucide-react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status based on localStorage
    const partnerData = localStorage.getItem('partner');
    const partnerToken = localStorage.getItem('partner_token');
    if (partnerData && partnerToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('partner');
    localStorage.removeItem('partner_token');
    setIsLoggedIn(false);
    navigate('/partner/Plogin');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/partner/PHome" className="text-4xl font-extrabold text-lime-600">
          Home<span className="text-gray-900">Shifting</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {!isLoggedIn ? (
            <>
              <NavItem to="/partner/PHome" label="Home" icon={<Home size={18} />} />
              <NavItem to="/partner/Buy_Package" label="Buy Package" icon={<Wallet size={18} />} />
              <NavItem to="/partner/About" label="About Us" icon={<User size={18} />} />
              <NavItem to="/" label="User Section" icon={<User size={18} />} />
            </>
          ) : (
            <>
                          <NavItem to="/partner/Contact" label="Contact" icon={<Contact size={18} />} />

              <NavItem to="/partner/profile" label="Profile" icon={<User size={18} />} />
              <NavItem to="/partner/ride" label="Rides" icon={<Truck size={18} />} />
              <NavItem to="/partner/mywallet" label="My Wallet" icon={<Wallet size={18} />} />
            </>
          )}
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/partner/Plogin"
                className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Link>
              <Link
                to="/partner/Pregister"
                className="flex items-center bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                <UserPlus size={18} className="mr-2" />
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
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
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-500 hover:bg-blue-50'
      }`
    }
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </NavLink>
);

export default Navbar;