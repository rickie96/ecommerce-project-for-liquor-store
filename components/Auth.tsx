
import React, { useState } from 'react';
import { User, View } from '../types';
import { db } from '../services/dbService';

interface AuthProps {
  mode: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onSwitchMode, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone,
        password
      };
      const success = db.registerUser(newUser);
      if (success) {
        db.loginUser(email, password);
        onAuthSuccess(newUser);
      } else {
        setError('Email already exists');
      }
    } else {
      const user = db.loginUser(email, password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {mode === 'login' ? 'Karibu Tena' : 'Jiunge Nasi'}
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            {mode === 'login' ? 'Ingia kwenye akaunti yako' : 'Tengeneza akaunti mpya'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Jina Kamili</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-gray-900 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Namba ya Simu</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-gray-900 transition-all"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Barua Pepe</label>
            <input 
              type="email" 
              required 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-gray-900 transition-all"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nenosiri</label>
            <input 
              type="password" 
              required 
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-gray-900 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            {mode === 'login' ? 'Ingia' : 'Jisajili'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-xs font-bold mb-4">
            {mode === 'login' ? 'Huna akaunti?' : 'Tayari una akaunti?'}
          </p>
          <button 
            onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
            className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors"
          >
            {mode === 'login' ? 'Tengeneza Akaunti' : 'Ingia Sasa'}
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="mt-6 w-full text-gray-300 font-black text-[10px] uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          Ghairi
        </button>
      </div>
    </div>
  );
};

export default Auth;
