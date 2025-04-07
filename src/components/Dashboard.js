import React from 'react';
import { Users, Calendar, Wallet, Truck } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-lime-50 via-white to-slate-100 min-h-screen pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          👋 Welcome, Admin!
        </h1>
        <h2 className="text-2xl font-semibold text-lime-600 mb-6">
          Explore the Home<span className="text-gray-700">Shifting</span> Admin Portal
        </h2>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed max-w-2xl mb-10">
          This portal is your command center. Here, you can effortlessly manage users, oversee bookings,
          collaborate with truck partners, and keep an eye on transactions. It’s built for smooth operations
          and better decision-making.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WelcomeCard
            title="Users"
            description="Manage and monitor registered users."
            icon={<Users size={26} className="text-blue-500" />}
          />
          <WelcomeCard
            title="Bookings"
            description="Track all active and completed bookings."
            icon={<Calendar size={26} className="text-green-500" />}
          />
          <WelcomeCard
            title="Truck Partners"
            description="Oversee truck partners and collaborations."
            icon={<Truck size={26} className="text-yellow-500" />}
          />
          <WelcomeCard
            title="Transactions"
            description="Review payment flows and earnings."
            icon={<Wallet size={26} className="text-purple-500" />}
          />
        </div>

        {/* Footer Message */}
        <div className="mt-12 p-6 bg-white border border-lime-100 shadow rounded-xl text-center">
          <p className="text-gray-700 text-lg">
            Ready to explore? Use the sidebar to navigate and start managing your platform efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

const WelcomeCard = ({ title, description, icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col gap-3 border border-gray-100 hover:shadow-lg transition">
    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default Dashboard;
