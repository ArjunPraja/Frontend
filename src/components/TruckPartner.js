import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TruckPartner = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchTruckPartners = async () => {
      try {
        const res = await axios.get('http://localhost:5000/truck-partners');
        setPartners(res.data);
      } catch (error) {
        console.error('Error fetching truck partner data:', error);
      }
    };

    fetchTruckPartners();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-6">🚚 Truck Partners Overview</h2>
  
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50">
            <tr>
              {[
                "Name", "Email", "Contact", "RC Number", "ID Card", "Pancard",
                "Driving License", "Truck Type", "Package", "Price",
                "End Date", "Status", "On Work"
              ].map((heading, idx) => (
                <th key={idx} className="px-6 py-3 text-left font-semibold text-purple-800 uppercase tracking-wider">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((partner, index) => (
              <tr key={index} className="hover:bg-purple-50 transition duration-200">
                <td className="px-6 py-3">{partner.t_name}</td>
                <td className="px-6 py-3">{partner.t_email}</td>
                <td className="px-6 py-3">{partner.t_contact}</td>
                <td className="px-6 py-3">{partner.t_rc_number}</td>
                <td className="px-6 py-3">{partner.t_id_card_details}</td>
                <td className="px-6 py-3">{partner.t_pancard_details}</td>
                <td className="px-6 py-3">{partner.t_drivinglicence_details}</td>
                <td className="px-6 py-3">{partner.truck_type || "N/A"}</td>
                <td className="px-6 py-3">{partner.package_type || "N/A"}</td>
                <td className="px-6 py-3">{partner.price ? `₹${partner.price}` : "N/A"}</td>
                <td className="px-6 py-3">
                  {partner.end_date ? new Date(partner.end_date).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                    ${partner.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {partner.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium 
                    ${partner.on_work ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-800"}`}>
                    {partner.on_work ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default TruckPartner;
