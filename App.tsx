
import React, { useState, useMemo, useEffect } from 'react';
import { View, Product, CartItem, Order, OrderStatus, User } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import PaymentForm from './components/PaymentForm';
import Receipt from './components/Receipt';
import OrderList from './components/OrderList';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { generatePersonalizedMessage } from './services/geminiService';
import { db } from './services/dbService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [inventory, setInventory] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setInventory(db.getProducts());
    setOrders(db.getOrders());
    setCurrentUser(db.getCurrentUser());
    setIsLoaded(true);
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('shop');
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleStartCheckout = () => {
    if (!currentUser) {
      setCurrentView('login');
    } else {
      setCurrentView('checkout');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(inventory.map(p => p.category)));
    return ['All', ...cats];
  }, [inventory]);

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const catProducts = cat === 'All' ? inventory : inventory.filter(p => p.category === cat);
      const stockCount = catProducts.reduce((sum, p) => sum + p.stock, 0);
      const needCount = catProducts.reduce((sum, p) => sum + p.demand, 0);
      const availableItemsCount = catProducts.filter(p => p.stock > 0).length;
      const totalItemsInCategory = catProducts.length;

      return { 
        name: cat, 
        stock: stockCount, 
        needs: needCount,
        availableCount: availableItemsCount,
        totalCount: totalItemsInCategory
      };
    });
  }, [inventory, categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.includes('All')) return inventory;
    return inventory.filter(p => selectedCategories.includes(p.category));
  }, [inventory, selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (category === 'All') {
        return ['All'];
      }
      
      const newSelection = prev.filter(c => c !== 'All');
      if (newSelection.includes(category)) {
        const filtered = newSelection.filter(c => c !== category);
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newSelection, category];
      }
    });
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    const updatedInventory = inventory.map(p => 
      p.id === product.id ? { ...p, stock: p.stock - 1, demand: p.demand + 1 } : p
    );
    setInventory(updatedInventory);
    db.saveProducts(updatedInventory);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    if (delta > 0 && product.stock <= 0) return;
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
    const updatedInventory = inventory.map(p => 
      p.id === id ? { ...p, stock: p.stock - delta } : p
    );
    setInventory(updatedInventory);
    db.saveProducts(updatedInventory);
  };

  const handleCompletePayment = async (paymentMethod: string) => {
    const now = new Date();
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: currentUser?.id,
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      timestamp: now.getTime(),
      items: [...cart],
      total: cartTotal,
      status: OrderStatus.PENDING,
      paymentMethod,
    };

    setCurrentView('receipt');
    setCart([]);
    const aiMessage = await generatePersonalizedMessage(newOrder);
    const finalizedOrder = { ...newOrder, aiMessage };
    setOrders(prev => [finalizedOrder, ...prev]);
    db.addOrder(finalizedOrder);
    setCurrentOrder(finalizedOrder);
  };

  const handleAdminUpdateProduct = (updatedProduct: Product) => {
    const oldProduct = inventory.find(p => p.id === updatedProduct.id);
    if (oldProduct && updatedProduct.stock > oldProduct.stock) {
      const diff = updatedProduct.stock - oldProduct.stock;
      db.logStockMovement(updatedProduct.id, updatedProduct.name, diff, 'IN');
    }
    const updatedInventory = inventory.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setInventory(updatedInventory);
    db.saveProducts(updatedInventory);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('shop');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order && status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      // Return stock to inventory
      const updatedInventory = inventory.map(p => {
        const item = order.items.find(i => i.id === p.id);
        if (item) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      });
      setInventory(updatedInventory);
      db.saveProducts(updatedInventory);
    }
    
    db.updateOrderStatus(orderId, status);
    setOrders(db.getOrders());
  };

  const handleDirectSale = (items: {product: Product, quantity: number}[], paymentMethod: string) => {
    const now = new Date();
    const cartItems: CartItem[] = items.map(i => ({ ...i.product, quantity: i.quantity }));
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    
    const newOrder: Order = {
      id: `POS-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userId: 'ADMIN-POS',
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      timestamp: now.getTime(),
      items: cartItems,
      total,
      status: OrderStatus.COMPLETED,
      paymentMethod,
      feedback: 'Physical Office Sale'
    };

    // Update inventory stock
    const updatedInventory = inventory.map(p => {
      const soldItem = items.find(i => i.product.id === p.id);
      if (soldItem) {
        return { ...p, stock: p.stock - soldItem.quantity, demand: p.demand + soldItem.quantity };
      }
      return p;
    });

    setInventory(updatedInventory);
    db.saveProducts(updatedInventory);
    
    db.addOrder(newOrder);
    // Manually trigger stock movement log since db.addOrder doesn't do it anymore
    // and we are setting it to COMPLETED immediately
    items.forEach(item => {
      db.logStockMovement(item.product.id, item.product.name, item.quantity, 'OUT');
    });
    
    setOrders(db.getOrders());
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Connecting to ASUBAA Database...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <LandingPage onStartShopping={() => setCurrentView('shop')} />;
      case 'shop':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CartDrawer items={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={handleStartCheckout} />
            <header className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pata vinywaji baridi, popote ulipo.</h1>
              <p className="text-gray-500 text-lg">ASUBAA STORE - Chaguo namba moja kwa vinywaji bora na huduma ya haraka.</p>
            </header>
            <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex space-x-4 min-w-max px-1">
                {categoryStats.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`relative px-6 py-4 rounded-2xl border transition-all duration-300 text-left min-w-[200px] group ${
                      selectedCategories.includes(cat.name) ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    <div className={`font-black text-sm mb-4 flex items-center justify-between tracking-tight ${selectedCategories.includes(cat.name) ? 'text-indigo-700' : 'text-gray-900'}`}>
                      <span>{cat.name} <span className="text-xs opacity-50 ml-1">({cat.totalCount})</span></span>
                      {cat.availableCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                    </div>
                    <div className="flex flex-col space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Available</span>
                        <span className={cat.availableCount === 0 ? 'text-rose-500' : 'text-emerald-600'}>{cat.availableCount}/{cat.totalCount} Brands</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Inventory</span>
                        <span className="text-gray-700">{cat.stock} Bottles</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        );
      case 'orders':
        const userOrders = orders.filter(o => o.userId === currentUser?.id);
        return <OrderList orders={userOrders} onSelectOrder={(order) => { setCurrentOrder(order); setCurrentView('receipt'); }} />;
      case 'receipt':
        return currentOrder ? (
          <Receipt 
            order={currentOrder} 
            onClose={() => setCurrentView('shop')} 
            onFeedbackSubmit={() => setOrders(db.getOrders())}
          />
        ) : null;
      case 'admin':
        if (!isAdminAuthenticated) {
          return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} onCancel={() => setCurrentView('shop')} />;
        }
        return <AdminPanel products={inventory} orders={orders} onUpdateProduct={handleAdminUpdateProduct} onLogout={handleAdminLogout} onUpdateOrderStatus={handleUpdateOrderStatus} onDirectSale={handleDirectSale} />;
      case 'login':
        return <Auth mode="login" onAuthSuccess={handleAuthSuccess} onSwitchMode={(m) => setCurrentView(m)} onCancel={() => setCurrentView('shop')} />;
      case 'register':
        return <Auth mode="register" onAuthSuccess={handleAuthSuccess} onSwitchMode={(m) => setCurrentView(m)} onCancel={() => setCurrentView('shop')} />;
      default:
        return null;
    }
  };

  const content = currentView === 'checkout' && cartCount > 0 
    ? <PaymentForm total={cartTotal} onComplete={handleCompletePayment} onBack={() => setCurrentView('shop')} defaultPhone={currentUser?.phone} />
    : renderContent();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        cartCount={cartCount} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onStartCheckout={handleStartCheckout}
      />
      <main className="flex-grow">{content}</main>
      <a href="tel:0747838750" className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 transition-all duration-300 group flex items-center print:hidden">
        <div className="hidden group-hover:block mr-2 font-bold text-xs uppercase tracking-widest pl-2">Piga Simu / WhatsApp</div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
      <Footer onAdminClick={() => setCurrentView('admin')} />
    </div>
  );
};

export default App;
