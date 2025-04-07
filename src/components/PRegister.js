import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    partnerName: '',
    aadhaar: '',
    pan: '',
    drivingLicence: '',
    rcNumber: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/partner/register', {
        t_name: formData.partnerName,
        t_email: formData.email,
        t_password: formData.password,
        t_contact: formData.contact,
        t_rc_number: formData.rcNumber,
        t_id_card_details: formData.aadhaar,
        t_pancard_details: formData.pan,
        t_drivinglicence_details: formData.drivingLicence,
        t_picture: 'placeholder.jpg', // update when adding image upload
        truck_type: 'Mini Truck', // replace or make dynamic later
      });

      alert('Partner registered successfully!');

      setFormData({
        partnerName: '',
        aadhaar: '',
        pan: '',
        drivingLicence: '',
        rcNumber: '',
        contact: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      navigate('/partner/Buy_Package');
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-lime-100 to-white flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-2xl border border-lime-500">
        <h2 className="text-4xl font-extrabold text-lime-600 mb-8 text-center drop-shadow-lg">
          Partner Registration
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Partner Name" name="partnerName" placeholder="Enter Name" value={formData.partnerName} onChange={handleChange} />
          <Input label="Aadhaar Number" name="aadhaar" placeholder="Enter Aadhaar Number" value={formData.aadhaar} onChange={handleChange} />
          <Input label="PAN Card Number" name="pan" placeholder="Enter PAN Number" value={formData.pan} onChange={handleChange} />
          <Input label="Driving Licence Number" name="drivingLicence" placeholder="Enter Driving Licence Number" value={formData.drivingLicence} onChange={handleChange} />
          <Input label="RC Number" name="rcNumber" placeholder="Enter RC Book Number" value={formData.rcNumber} onChange={handleChange} />
          <Input label="Contact Number" name="contact" placeholder="Enter Contact Number" value={formData.contact} onChange={handleChange} />
          <Input label="Email" name="email" type="email" placeholder="Enter your Email" value={formData.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />

          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white text-lg font-bold py-3 px-10 rounded-full shadow-md transition-all duration-300"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Input component
const Input = ({ label, name, placeholder, value, onChange, type = 'text' }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-lg font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
    />
  </div>
);

export default PRegister;
