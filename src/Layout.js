import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarPartner from "./components/NavbarPartner";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import PHome from "./components/PHome";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Booking from "./components/Booking";
import Services from "./components/Services";
import Contact from "./components/Contact";
import PContact from "./components/PContect";
import BuyPackage from "./components/ByPackage";
import Vehical from "./components/Vehical";
import BookingsTable from "./components/BookingsTable";
import BookingStatus from "./components/StatusTracking";
import PRegister from "./components/PRegister";
import PLogin from "./components/PLogin";
import ForgotPassword from "./components/ForgotPassword";
import PartnerProfile from "./components/PartnerProfile";
import AvailableRides from "./components/RidesPartner";
import Wallet from "./components/Wallet";
import Dashboard from './components/Dashboard';
import Auser from "./components/Ausers";
import TruckPartner from "./components/TruckPartner";
import ARides from "./components/ARides";
import ABooking from "./components/ABooking";
import ATransaction from "./components/ATransaction";
import AContact from "./components/Acontact";
import Unauthorized from "./components/Unauthorized";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
  const location = useLocation();
  const isPartnerRoute = location.pathname.startsWith("/partner");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : isPartnerRoute ? (
        <NavbarPartner />
      ) : (
        <Navbar />
      )}

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Vehicle" element={<Vehical />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/MyBooking" element={<BookingsTable />} />
          <Route path="/booking/status/:id" element={<BookingStatus />} />

          {/* Partner Routes */}
          <Route path="/partner/pregister" element={<PRegister />} />
          <Route path="/partner/plogin" element={<PLogin />} />
          <Route path="/partner/forgot-password" element={<ForgotPassword />} />
          <Route path="/partner/phome" element={<PHome />} />
          <Route path="/partner/contact" element={<PContact />} />
          <Route path="/partner/buy_package" element={<BuyPackage />} />
          <Route path="/partner/about" element={<About />} />
          <Route path="/partner/profile" element={<PartnerProfile />} />
          <Route path="/partner/ride" element={<AvailableRides />} />
          <Route path="/partner/mywallet" element={<Wallet />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roleRequired="admin">
                <Auser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/truck-partners"
            element={
              <ProtectedRoute roleRequired="admin">
                <TruckPartner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rides"
            element={
              <ProtectedRoute roleRequired="admin">
                <ARides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roleRequired="admin">
                <ABooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute roleRequired="admin">
                <ATransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute roleRequired="admin">
                <AContact />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default Layout;
