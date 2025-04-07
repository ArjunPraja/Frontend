import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck } from 'lucide-react';

const ATransaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6 min-h-screen pt-24">
      <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6">
        <Truck size={28} /> All Transactions
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-50 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Transaction ID</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Type</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Amount</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Account Holder</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Truck Partner</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Date</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Rides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx, index) => (
              <tr key={index} className="hover:bg-purple-50 transition duration-200">
                <td className="px-6 py-4">{tx.transaction_id}</td>
                <td className={`px-6 py-4 capitalize ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type}
                </td>
                <td className="px-6 py-4 font-semibold">₹{tx.amount}</td>
                <td className="px-6 py-4">{tx.account_holder_name}</td>
                <td className="px-6 py-4">{tx.truckpartner?.t_name || 'N/A'}</td>
                <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {tx.rides.length > 0 ? tx.rides.map((r, i) => (
                    <div key={i}>{r.Booking_ID}</div>
                  )) : 'No Rides'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ATransaction;
