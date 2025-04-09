import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';


const Wallet = () => {
  const partner = JSON.parse(localStorage.getItem('partner'));
  const partnerId = partner?._id;

  const [walletSummary, setWalletSummary] = useState({
    totalEarning: 0,
    todayEarning: 0,
    withdrawableAmount: 0,
    totalTrips: 0,
    totalRides: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankInfo, setBankInfo] = useState({
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: ''
  });
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    amount: '',
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!partnerId) return;
  
      try {
        setLoading(true);
        const [summaryRes, txnRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/rides/wallet/summary/${partnerId}`),
          axios.get(`http://localhost:5000/api/transactions/${partnerId}?sort=-date&limit=50`)
        ]);
  
        const transactionsData = txnRes.data?.data || [];
  
        const totalDebits = transactionsData
          .filter(txn => txn.type === 'debit')
          .reduce((sum, txn) => sum + txn.amount, 0);
  
        const totalEarning = summaryRes.data.totalEarning;
  
        setWalletSummary({
          ...summaryRes.data,
          withdrawableAmount: totalEarning - totalDebits
        });
  
        setTransactions(transactionsData);
        
      } catch (error) {
        console.error("Fetch error:", error);
        setError('Failed to load wallet data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [partnerId]);
  

  const validateForm = () => {
    const errors = {
      amount: '',
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: ''
    };

    let isValid = true;

    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      errors.amount = 'Please enter a valid amount';
      isValid = false;
    } else if (Number(withdrawAmount) > walletSummary.withdrawableAmount) {
      errors.amount = 'Amount exceeds available balance';
      isValid = false;
    }

    if (!bankInfo.account_holder_name.trim()) {
      errors.account_holder_name = 'Account holder name is required';
      isValid = false;
    }

    if (!bankInfo.account_number.trim() || !/^\d{9,18}$/.test(bankInfo.account_number)) {
      errors.account_number = 'Valid account number is required (9-18 digits)';
      isValid = false;
    }

   
    if (!bankInfo.bank_name.trim()) {
      errors.bank_name = 'Bank name is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;

    setIsWithdrawing(true);
    setError('');
    setWithdrawSuccess(false);

    const withdrawalData = {
      truckpartner: partnerId,
      ...bankInfo,
      amount: Number(withdrawAmount),
      type: 'debit',
      transaction_id: `TXN${Date.now()}`,
      date: new Date(),
      status: 'pending'
    };

    try {
      const response = await axios.post('http://localhost:5000/api/transactions', withdrawalData);
      
      // Update local state
      setTransactions(prev => [response.data.data, ...prev]);
      setWalletSummary(prev => ({
        ...prev,
        withdrawableAmount: prev.withdrawableAmount - Number(withdrawAmount),
        totalEarning: prev.totalEarning 
        
      }));
      
      setWithdrawSuccess(true);
      setWithdrawAmount('');
      setBankInfo({
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
        bank_name: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setWithdrawSuccess(false), 5000);
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError(error.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
  };

  return (
    <div className="min-h-screen pt-24 max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Wallet Dashboard</h2>
      
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'transactions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'withdraw' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {withdrawSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>Withdrawal request submitted successfully!</p>
        </div>
      )}

      {activeTab === 'summary' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(walletSummary.todayEarning)}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(walletSummary.totalEarning)}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Withdrawable Balance</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(walletSummary.withdrawableAmount)}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
            >
              Withdraw Funds
            </button>
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-10">
          <h3 className="text-xl font-semibold mb-6">Withdraw Funds</h3>
          
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Available Balance</label>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                {formatCurrency(walletSummary.withdrawableAmount)}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className={`border ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-8 pr-4 py-2 w-full`}
                />
              </div>
              {formErrors.amount && <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bank Account Details</label>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={bankInfo.account_holder_name}
                  onChange={(e) => setBankInfo({ ...bankInfo, account_holder_name: e.target.value })}
                  placeholder="Account Holder Name"
                  className={`border ${formErrors.account_holder_name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 w-full`}
                />
                {formErrors.account_holder_name && <p className="text-red-500 text-sm mt-1">{formErrors.account_holder_name}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={bankInfo.account_number}
                  onChange={(e) => setBankInfo({ ...bankInfo, account_number: e.target.value.replace(/\D/g, '') })}
                  placeholder="Account Number"
                  className={`border ${formErrors.account_number ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 w-full`}
                />
                {formErrors.account_number && <p className="text-red-500 text-sm mt-1">{formErrors.account_number}</p>}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={bankInfo.ifsc_code}
                  onChange={(e) => setBankInfo({ ...bankInfo, ifsc_code: e.target.value.toUpperCase() })}
                  placeholder="IFSC Code"
                  className={`border ${formErrors.ifsc_code ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 w-full`}
                />
                
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={bankInfo.bank_name}
                  onChange={(e) => setBankInfo({ ...bankInfo, bank_name: e.target.value })}
                  placeholder="Bank Name"
                  className={`border ${formErrors.bank_name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 w-full`}
                />
                {formErrors.bank_name && <p className="text-red-500 text-sm mt-1">{formErrors.bank_name}</p>}
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className={`w-full py-3 rounded-lg font-medium ${isWithdrawing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isWithdrawing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Withdrawal...
                </span>
              ) : 'Request Withdrawal'}
            </button>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700 mt-4">
              <p className="font-medium">Note:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Minimum withdrawal amount is ₹100</li>
                <li>Withdrawals may take 2-3 business days to process</li>
                <li>A 2% processing fee may apply for amounts below ₹1000</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && !loading && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Transaction History</h3>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="mt-2 text-lg">No transactions found</p>
              <p className="mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((txn, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {txn.type === 'credit' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {txn.type === 'credit' ? 'Credit' : 'Withdrawal'} - {txn.transaction_id}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                        </div>
                      </div>
                      
                      {txn.type === 'debit' && (
                        <div className="mt-3 ml-10 space-y-1 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">Bank:</span> {txn.bank_name || 'N/A'}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Account:</span> ****{txn.account_number?.slice(-4)}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">IFSC:</span> {txn.ifsc_code}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        txn.status === 'success' ? 'bg-green-100 text-green-800' :
                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {txn.status || 'processed'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;