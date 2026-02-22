
import React, { useState } from 'react';
import { CartItem } from '../types';

interface PaymentFormProps {
  total: number;
  onComplete: (paymentMethod: string) => void;
  onBack: () => void;
  defaultPhone?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ total, onComplete, onBack, defaultPhone }) => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '');
  const [transactionCode, setTransactionCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete(`M-Pesa (${transactionCode || 'Confirmed'})`);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
      <button onClick={onBack} className="flex items-center text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 mb-8 group transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Cart
      </button>

      <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-emerald-600 px-5 py-2.5 rounded-xl text-white font-black text-xl tracking-tight shadow-lg shadow-emerald-100">
              M-PESA
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2 text-center tracking-tight">Lipa na M-Pesa</h2>
          <p className="text-gray-400 text-center text-sm font-bold uppercase tracking-widest mb-10">Secured Mobile Payment</p>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 mb-10">
            <h3 className="text-emerald-800 font-black mb-6 uppercase text-[10px] tracking-[0.2em] flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
              Payment Steps
            </h3>
            <ol className="text-sm text-emerald-900 space-y-4 font-bold">
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">1</span>
                Go to M-PESA menu on your phone
              </li>
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">2</span>
                Select <span className="text-emerald-800 ml-1">Lipa na M-PESA</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">3</span>
                Select <span className="text-emerald-800 ml-1">Buy Goods and Services</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">4</span>
                Enter Till: <span className="text-emerald-800 ml-1 font-black underline underline-offset-4 decoration-2 decoration-emerald-200">36049200</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">5</span>
                Enter Amount: <span className="text-emerald-800 ml-1 font-black text-lg">{total.toLocaleString()} Tsh</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black mr-4 shadow-sm">6</span>
                Enter M-PESA PIN to confirm
              </li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sender Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. 0712 XXX XXX" 
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-emerald-500 font-bold transition-all bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Transaction ID (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. RCL89XJ2YP" 
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-emerald-500 font-bold transition-all bg-gray-50/50"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-5 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center shadow-2xl shadow-gray-100 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay ${total.toLocaleString()} Tsh`
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Name: ERICK HUBERT MEENA • Account Verification Required
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
