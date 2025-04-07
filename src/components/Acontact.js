import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

const AContact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/contacts');
        setContacts(res.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="p-6 min-h-screen pt-24">
      <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Truck size={28} /> Contact Submissions
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Name</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Email</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Phone</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Message</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">UUID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact, index) => (
              <tr key={index} className="hover:bg-purple-50 transition duration-200">
                <td className="px-6 py-4">{contact.name}</td>
                <td className="px-6 py-4">{contact.email}</td>
                <td className="px-6 py-4">{contact.number}</td>
                <td className="px-6 py-4">{contact.message}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{contact.contact_uuid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AContact;
