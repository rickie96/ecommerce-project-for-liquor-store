
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ items, onUpdateQuantity, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        <a href="tel:0747838750" className="mt-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Unahitaji msaada? Piga 0747 838 750</a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Shopping Cart</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-50" />
            <div className="flex-grow">
              <h4 className="text-lg font-bold text-gray-900 tracking-tight">{item.name}</h4>
              <p className="text-indigo-600 font-black text-sm">{item.price.toLocaleString()} Tsh</p>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
              <button 
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-indigo-600 transition-colors font-black"
              >
                -
              </button>
              <span className="font-black text-gray-900 w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-indigo-600 transition-colors font-black"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-100 pt-8">
        <div className="flex justify-between text-base font-bold text-gray-400 mb-2 uppercase tracking-widest text-[10px]">
          <p>Subtotal</p>
          <p className="text-gray-900 text-sm font-black">{subtotal.toLocaleString()} Tsh</p>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-400 mb-6 uppercase tracking-widest text-[10px]">
          <p>Shipping</p>
          <p className="text-emerald-600">FREE Delivery</p>
        </div>
        <div className="flex justify-between text-3xl font-black text-gray-900 mb-8 tracking-tighter">
          <p>Total</p>
          <p>{subtotal.toLocaleString()} Tsh</p>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-gray-900 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-100 active:scale-95 mb-4"
        >
          Continue to Payment
        </button>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Maswali? Wasiliana nasi: <a href="tel:0747838750" className="text-indigo-600 hover:underline">0747 838 750</a>
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
