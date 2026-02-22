
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Empty Cellar</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-3">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter">Order History</h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onSelectOrder(order)}
          >
            <div className="flex flex-col sm:flex-row justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Order #{order.id}</p>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{order.date}</h3>
              </div>
              <div className="mt-6 sm:mt-0 flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Settled Amount</p>
                  <p className="text-2xl font-black text-gray-900 tabular-nums">{order.total.toLocaleString()} Tsh</p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  order.status === OrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  order.status === OrderStatus.CANCELLED ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-orange-50 text-orange-700 border-orange-100'
                }`}>
                  {order.status}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:scale-110 transition-transform">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" title={item.name} />
                </div>
              ))}
              {order.items.length > 5 && (
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                  +{order.items.length - 5}
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Via {order.paymentMethod}</span>
              <button className="text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:underline">View Receipt →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
