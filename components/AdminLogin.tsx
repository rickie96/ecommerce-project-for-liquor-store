
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (pass: string) => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '3604') { // Default secret PIN
      onLogin(passcode);
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 transform transition-all">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Portal</h2>
          <p className="text-gray-500 text-sm">Please enter the security PIN to manage the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              placeholder="Enter PIN"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl border-2 text-center text-2xl font-black tracking-[1em] focus:outline-none transition-all ${
                error ? 'border-rose-500 animate-shake bg-rose-50' : 'border-gray-100 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {error && <p className="text-rose-500 text-xs font-bold mt-2 text-center uppercase tracking-widest">Invalid Security PIN</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-600 shadow-xl transition-all active:scale-95"
          >
            Authenticate
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Return to Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
