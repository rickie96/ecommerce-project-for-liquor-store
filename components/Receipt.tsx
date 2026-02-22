
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { db } from '../services/dbService';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
  onFeedbackSubmit?: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ order, onClose, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState(order.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    db.addOrderFeedback(order.id, feedback);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      if (onFeedbackSubmit) onFeedbackSubmit();
    }, 1000);
  };
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 w-full"></div>
        
        <div className="p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Big Thanks!</h1>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">RECEIPT #{order.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center border ${
              order.status === OrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              order.status === OrderStatus.CANCELLED ? 'bg-rose-50 text-rose-700 border-rose-100' :
              'bg-orange-50 text-orange-700 border-orange-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {order.status === OrderStatus.COMPLETED ? 'Payment Confirmed' : 
               order.status === OrderStatus.CANCELLED ? 'Order Cancelled' : 
               'Awaiting Approval'}
            </div>
          </div>

          {order.status === OrderStatus.COMPLETED && !showSuccess && !order.feedback && (
            <div className="mb-12 bg-indigo-50 p-8 rounded-3xl border border-indigo-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-indigo-900 font-black text-lg mb-2 tracking-tight">Toa Maoni Yako</h3>
                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6">Tusaidie kujua kama umepata bidhaa zako salama</p>
                <form onSubmit={handleFeedbackSubmit}>
                  <textarea
                    className="w-full px-6 py-4 rounded-2xl border-2 border-white focus:border-indigo-500 outline-none font-bold text-gray-900 transition-all bg-white/50 mb-4 min-h-[100px]"
                    placeholder="Andika maoni yako hapa..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Inatuma...' : 'Tuma Maoni'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {(showSuccess || order.feedback) && (
            <div className="mb-12 bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-emerald-900 font-black text-sm uppercase tracking-widest">Asante kwa Maoni!</h3>
                <p className="text-emerald-600 font-bold text-xs italic mt-1">"{feedback || order.feedback}"</p>
              </div>
            </div>
          )}

          {order.aiMessage && (
            <div className="mb-12 bg-gray-50 p-8 rounded-3xl border border-gray-100 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16C10.9124 16 10.017 16.8954 10.017 18L10.017 21H4.01703V5C4.01703 3.89543 4.91246 3 6.01703 3H18.017C19.1216 3 20.017 3.89543 20.017 5V21H14.017Z" opacity="0.1"/>
                 </svg>
               </div>
              <p className="text-gray-800 italic leading-relaxed text-lg font-medium relative z-10">
                "{order.aiMessage}"
              </p>
              <div className="mt-6 flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-[10px] text-white font-black">AI</div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">ASUBAA Assistant</span>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-12">
            <h3 className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] border-b border-gray-100 pb-3 mb-6">Order Breakdown</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-4">
                  <span className="bg-gray-100 text-gray-900 w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-800 font-bold tracking-tight">{item.name}</span>
                </div>
                <span className="text-gray-900 font-black tabular-nums">{(item.price * item.quantity).toLocaleString()} Tsh</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 bg-gray-50 p-8 rounded-3xl mb-12 border border-gray-100">
            <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-gray-900 font-black">{order.total.toLocaleString()} Tsh</span>
            </div>
            <div className="flex justify-between text-gray-400 font-bold text-xs uppercase tracking-widest">
              <span>Delivery</span>
              <span className="text-emerald-600 font-black">FREE</span>
            </div>
            <div className="flex justify-between text-2xl text-gray-900 font-black pt-5 border-t border-gray-200 tracking-tighter">
              <span>Total Paid</span>
              <span className="tabular-nums">{order.total.toLocaleString()} Tsh</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onClose}
              className="flex-grow py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-gray-100 active:scale-95"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="py-5 px-8 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center justify-center active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
