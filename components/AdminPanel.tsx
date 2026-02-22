
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, StockLog, OrderStatus, Expense } from '../types';
import { db } from '../services/dbService';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onLogout: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDirectSale: (items: {product: Product, quantity: number}[], paymentMethod: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, onUpdateProduct, onLogout, onUpdateOrderStatus, onDirectSale }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions' | 'database' | 'reports' | 'finance' | 'pos'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dbStats, setDbStats] = useState(db.getStats());
  const [expenses, setExpenses] = useState<Expense[]>(db.getExpenses());
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Operational' });

  // POS State
  const [posCart, setPosCart] = useState<{product: Product, quantity: number}[]>([]);
  const [posPaymentMethod, setPosPaymentMethod] = useState('Cash');

  useEffect(() => {
    setDbStats(db.getStats());
    setExpenses(db.getExpenses());
  }, [products, orders]);

  const handleAddToPosCart = (product: Product) => {
    if (product.stock <= 0) return;
    setPosCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromPosCart = (productId: string) => {
    setPosCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleCompleteDirectSale = () => {
    if (posCart.length === 0) return;
    onDirectSale(posCart, posPaymentMethod);
    setPosCart([]);
    alert('Direct sale recorded successfully!');
  };

  const posTotal = posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    };
    db.addExpense(expense);
    setExpenses(db.getExpenses());
    setDbStats(db.getStats());
    setNewExpense({ description: '', amount: '', category: 'Operational' });
  };

  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => sum + order.total, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const movementStats = useMemo(() => {
    const logs = db.getStockLogs();
    const stats: Record<string, { in: number, out: number }> = {};
    
    logs.forEach(log => {
      if (!stats[log.productId]) stats[log.productId] = { in: 0, out: 0 };
      if (log.type === 'IN') stats[log.productId].in += log.quantity;
      else stats[log.productId].out += log.quantity;
    });

    const totalIn = logs.filter(l => l.type === 'IN').reduce((sum, l) => sum + l.quantity, 0);
    const totalOut = logs.filter(l => l.type === 'OUT').reduce((sum, l) => sum + l.quantity, 0);

    return { stats, totalIn, totalOut };
  }, [products, orders]);

  const weeklyData = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const logs = db.getStockLogs().filter(log => log.timestamp >= oneWeekAgo);
    
    const stockIn = logs.filter(l => l.type === 'IN');
    const stockOut = logs.filter(l => l.type === 'OUT');
    
    // Grouping for the report
    const stockInByProduct: Record<string, {name: string, qty: number}> = {};
    stockIn.forEach(log => {
      if (!stockInByProduct[log.productId]) stockInByProduct[log.productId] = { name: log.productName, qty: 0 };
      stockInByProduct[log.productId].qty += log.quantity;
    });

    const stockOutByProduct: Record<string, {name: string, qty: number}> = {};
    stockOut.forEach(log => {
      if (!stockOutByProduct[log.productId]) stockOutByProduct[log.productId] = { name: log.productName, qty: 0 };
      stockOutByProduct[log.productId].qty += log.quantity;
    });

    return {
      stockInItems: Object.values(stockInByProduct),
      stockOutItems: Object.values(stockOutByProduct),
      totalIn: stockIn.reduce((sum, l) => sum + l.quantity, 0),
      totalOut: stockOut.reduce((sum, l) => sum + l.quantity, 0),
      dateRange: `${new Date(oneWeekAgo).toLocaleDateString()} - ${new Date().toLocaleDateString()}`
    };
  }, [products, orders, activeTab]);

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleResetDB = () => {
    if (window.confirm('WARNING: This will wipe all orders and reset inventory to defaults. Proceed?')) {
      db.resetDatabase();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">Admin Dashboard</h1>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Database Linked</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Sales
            </button>
            <button 
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Direct Sale
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'finance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Finance
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              Reports
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'database' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              DB
            </button>
          </div>
          <button onClick={onLogout} className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10 print:hidden">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
          <h3 className="text-2xl font-black text-emerald-600 tabular-nums">{dbStats.totalRevenue.toLocaleString()} <span className="text-xs font-bold">Tsh</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Net Profit</p>
          <h3 className={`text-2xl font-black tabular-nums ${dbStats.netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {dbStats.netProfit.toLocaleString()} <span className="text-xs font-bold">Tsh</span>
          </h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expenses</p>
          <h3 className="text-2xl font-black text-rose-500 tabular-nums">{dbStats.totalExpenses.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stock Out</p>
          <h3 className="text-2xl font-black text-rose-500 tabular-nums">{movementStats.totalOut}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Age</p>
          <h3 className="text-2xl font-black text-gray-900 tabular-nums">{dbStats.businessDays} <span className="text-xs font-bold text-gray-300">Days</span></h3>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cost Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sale Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit/Unit</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6 flex items-center space-x-4">
                        <img src={product.image} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                        <div>
                          <div className="font-black text-gray-900 text-sm tracking-tight">{product.name}</div>
                          <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{product.category}</div>
                        </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-400 tabular-nums">{(product.costPrice || 0).toLocaleString()} Tsh</td>
                    <td className="px-8 py-6 font-black text-gray-900 tabular-nums">{product.price.toLocaleString()} Tsh</td>
                    <td className="px-8 py-6">
                      <span className="text-emerald-600 font-black text-xs">
                        +{(product.price - (product.costPrice || 0)).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${
                        product.stock === 0 ? 'bg-rose-50 text-rose-600' :
                        product.stock < 10 ? 'bg-orange-50 text-orange-600' : 
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {product.stock} Units
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleEditClick(product)} className="bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Value</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Feedback</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 font-black text-indigo-600 text-sm">#{order.id}</td>
                    <td className="px-8 py-6 text-gray-500 text-[11px] font-bold uppercase tracking-widest">{order.date}</td>
                    <td className="px-8 py-6 font-black text-gray-900 tabular-nums">{order.total.toLocaleString()} Tsh</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        order.status === OrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' :
                        order.status === OrderStatus.CANCELLED ? 'bg-rose-50 text-rose-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {order.feedback ? (
                        <div className="max-w-[200px]">
                          <p className="text-[10px] font-bold text-emerald-600 italic truncate" title={order.feedback}>
                            "{order.feedback}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No feedback</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      {order.status === OrderStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, OrderStatus.COMPLETED)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => onUpdateOrderStatus(order.id, OrderStatus.CANCELLED)}
                            className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status !== OrderStatus.PENDING && (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Select Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(product => (
                <button 
                  key={product.id}
                  disabled={product.stock <= 0}
                  onClick={() => handleAddToPosCart(product)}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                    product.stock <= 0 ? 'border-gray-50 opacity-50 cursor-not-allowed' : 'border-gray-50 hover:border-indigo-500 hover:bg-indigo-50/30'
                  }`}
                >
                  <img src={product.image} className="w-12 h-12 rounded-xl object-cover mr-4" />
                  <div className="flex-grow">
                    <p className="font-black text-gray-900 text-sm">{product.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{product.price.toLocaleString()} Tsh • {product.stock} in stock</p>
                  </div>
                  <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Sale Summary</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Physical Office Sale</p>
            </div>
            <div className="flex-grow p-8 space-y-4 overflow-y-auto max-h-[400px]">
              {posCart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.product.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.quantity} x {item.product.price.toLocaleString()} Tsh</p>
                  </div>
                  <button onClick={() => handleRemoveFromPosCart(item.product.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {posCart.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-gray-400 font-bold text-sm">Cart is empty</p>
                </div>
              )}
            </div>
            <div className="p-8 bg-gray-50 rounded-b-3xl space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                <span className="text-2xl font-black text-gray-900 tabular-nums">{posTotal.toLocaleString()} Tsh</span>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Method</label>
                <select 
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-bold text-sm bg-white"
                  value={posPaymentMethod}
                  onChange={(e) => setPosPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>M-Pesa</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <button 
                disabled={posCart.length === 0}
                onClick={handleCompleteDirectSale}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Record Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-sm"
                  placeholder="e.g. Rent, Electricity, Transport"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount (Tsh)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-sm"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 focus:border-indigo-500 outline-none font-bold text-sm bg-white"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option>Operational</option>
                  <option>Marketing</option>
                  <option>Logistics</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all">
                Add Expense
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Expense History</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: {dbStats.totalExpenses.toLocaleString()} Tsh</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{expense.date}</td>
                      <td className="px-8 py-4 font-bold text-gray-900 text-sm">{expense.description}</td>
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-[9px] font-black uppercase tracking-widest text-gray-500">{expense.category}</span>
                      </td>
                      <td className="px-8 py-4 text-right font-black text-rose-600 tabular-nums">{expense.amount.toLocaleString()} Tsh</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-300 font-bold italic">No expenses recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-center mb-10 print:mb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight print:text-xl">Weekly Stock Movement Report</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Period: {weeklyData.dateRange}</p>
            </div>
            <button onClick={() => window.print()} className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center hover:bg-indigo-600 transition-all print:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12 print:gap-4 print:mb-6">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Stock In (Restocks)</p>
              <h4 className="text-3xl font-black text-emerald-700">{weeklyData.totalIn} <span className="text-sm">Units</span></h4>
            </div>
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Total Stock Out (Sales)</p>
              <h4 className="text-3xl font-black text-rose-700">{weeklyData.totalOut} <span className="text-sm">Units</span></h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-8">
            <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">Stock In (Replenishments)</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 font-bold">
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {weeklyData.stockInItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 font-bold text-gray-800">{item.name}</td>
                      <td className="py-3 text-right font-black text-emerald-600">+{item.qty}</td>
                    </tr>
                  ))}
                  {weeklyData.stockInItems.length === 0 && <tr><td colSpan={2} className="py-8 text-center text-gray-300 font-bold italic">No restocks this week</td></tr>}
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">Stock Out (Customer Sales)</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 font-bold">
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {weeklyData.stockOutItems.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 font-bold text-gray-800">{item.name}</td>
                      <td className="py-3 text-right font-black text-rose-600">-{item.qty}</td>
                    </tr>
                  ))}
                  {weeklyData.stockOutItems.length === 0 && <tr><td colSpan={2} className="py-8 text-center text-gray-300 font-bold italic">No sales this week</td></tr>}
                </tbody>
              </table>
            </section>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100 text-center print:mt-6 print:pt-6">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Generated by ASUBAA Store Intelligence • {new Date().toLocaleString()}</p>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 p-10 print:hidden">
          <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">System Storage</h2>
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Indexed Objects</p>
              <p className="text-xl font-black text-gray-900">{dbStats.totalProducts + dbStats.totalOrders}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage footprint</p>
              <p className="text-xl font-black text-gray-900">{dbStats.storageSize}</p>
            </div>
          </div>
          <button onClick={handleResetDB} className="bg-rose-50 text-rose-600 border border-rose-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
            Hard Reset Database
          </button>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Update Stock</h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{editingProduct.name}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-10 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cost Price (Incoming Cash)</label>
                  <input type="number" step="1" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none font-black text-xl tabular-nums text-emerald-600" value={editingProduct.costPrice || 0} onChange={(e) => setEditingProduct({...editingProduct, costPrice: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sale Price (Tsh)</label>
                  <input type="number" step="1" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none font-black text-xl tabular-nums" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Stock Units</label>
                  <input type="number" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none font-black text-xl tabular-nums" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}/>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-600 shadow-xl transition-all active:scale-95">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
