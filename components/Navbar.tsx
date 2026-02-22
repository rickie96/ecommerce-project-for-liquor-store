
import React from 'react';
import { View, User } from '../types';

interface NavbarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  cartCount: number;
  currentUser: User | null;
  onLogout: () => void;
  onStartCheckout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onViewChange, 
  cartCount, 
  currentUser, 
  onLogout,
  onStartCheckout
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onViewChange('home')}>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tighter">
              ASUBAA STORE
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <button 
              onClick={() => onViewChange('home')}
              className={`${currentView === 'home' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors`}
            >
              Home
            </button>
            <button 
              onClick={() => onViewChange('shop')}
              className={`${currentView === 'shop' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors`}
            >
              Shop
            </button>
            {currentUser && (
              <button 
                onClick={() => onViewChange('orders')}
                className={`${currentView === 'orders' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors`}
              >
                My Orders
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onStartCheckout}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-rose-600 rounded-full shadow-lg shadow-rose-200">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-100">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mteja</p>
                  <p className="text-xs font-black text-gray-900 tracking-tight">{currentUser.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onViewChange('login')}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Ingia
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
