import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Truck, Contact, Wallet, Calendar, LogOut } from 'lucide-react';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('admin_token');
    navigate('/'); // Redirect to homepage
    window.location.reload();

  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin/dashboard" className="text-4xl font-extrabold text-lime-600">
          Home<span className="text-gray-900">Shifting</span>
        </Link>

        {/* Navigation Links - Always visible */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/admin/dashboard" label="Dashboard" icon={<Home size={18} />} />
          <NavItem to="/admin/users" label="Users" icon={<Users size={18} />} />
          <NavItem to="/admin/truck-partners" label="Truck Partners" icon={<Truck size={18} />} />
          <NavItem to="/admin/rides" label="Rides" icon={<Calendar size={18} />} />
          <NavItem to="/admin/bookings" label="Bookings" icon={<Calendar size={18} />} />
          <NavItem to="/admin/transactions" label="Transactions" icon={<Wallet size={18} />} />
          <NavItem to="/admin/contacts" label="Contacts" icon={<Contact size={18} />} />
        </div>

        {/* Logout Button - Always visible */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
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

export default AdminNavbar;
