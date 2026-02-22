
import { Product, Order, StockLog, User } from '../types';
import { PRODUCTS } from '../constants';

const DB_KEYS = {
  PRODUCTS: 'asubaa_inventory',
  ORDERS: 'asubaa_orders',
  LOGS: 'asubaa_stock_logs',
  USERS: 'asubaa_users',
  CURRENT_USER: 'asubaa_current_user',
  EXPENSES: 'asubaa_expenses',
  VERSION: 'asubaa_db_version'
};

const DB_VERSION = '1.1.0';

class DatabaseService {
  constructor() {
    this.init();
  }

  private init() {
    const version = localStorage.getItem(DB_KEYS.VERSION);
    const hasProducts = localStorage.getItem(DB_KEYS.PRODUCTS);

    if (version !== DB_VERSION || !hasProducts) {
      console.log('Initializing/Updating ASUBAA Database...');
      if (!hasProducts) this.saveProducts(PRODUCTS);
      if (!localStorage.getItem(DB_KEYS.ORDERS)) this.saveOrders([]);
      if (!localStorage.getItem(DB_KEYS.LOGS)) localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
      if (!localStorage.getItem(DB_KEYS.USERS)) localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
      if (!localStorage.getItem(DB_KEYS.EXPENSES)) localStorage.setItem(DB_KEYS.EXPENSES, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.VERSION, DB_VERSION);
    }
  }

  getExpenses(): any[] {
    const data = localStorage.getItem(DB_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  }

  saveExpenses(expenses: any[]): void {
    localStorage.setItem(DB_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  addExpense(expense: any): void {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    this.saveExpenses(expenses);
  }

  getUsers(): User[] {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  registerUser(user: User): boolean {
    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) return false;
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  loginUser(email: string, password?: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }

  getProducts(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : PRODUCTS;
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  }

  getOrders(): Order[] {
    const data = localStorage.getItem(DB_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
  }

  updateOrderStatus(orderId: string, status: any): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    const oldStatus = order.status;
    order.status = status;
    this.saveOrders(orders);

    // Log stock movement only when moving to COMPLETED from something else
    if (status === 'Completed' && oldStatus !== 'Completed') {
      order.items.forEach(item => {
        this.logStockMovement(item.id, item.name, item.quantity, 'OUT');
      });
    }
  }

  addOrderFeedback(orderId: string, feedback: string): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].feedback = feedback;
      this.saveOrders(orders);
    }
  }

  getStockLogs(): StockLog[] {
    const data = localStorage.getItem(DB_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  logStockMovement(productId: string, productName: string, quantity: number, type: 'IN' | 'OUT'): void {
    const logs = this.getStockLogs();
    const newLog: StockLog = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      productName,
      quantity,
      type,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    };
    logs.unshift(newLog);
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs));
  }

  resetDatabase(): void {
    localStorage.removeItem(DB_KEYS.PRODUCTS);
    localStorage.removeItem(DB_KEYS.ORDERS);
    localStorage.removeItem(DB_KEYS.LOGS);
    localStorage.removeItem(DB_KEYS.VERSION);
    window.location.reload();
  }

  getStats() {
    const products = this.getProducts();
    const orders = this.getOrders();
    const expenses = this.getExpenses();
    
    // Profit is now "immediate" - includes both Pending and Completed orders
    // but excludes Cancelled ones.
    const activeOrders = orders.filter(o => o.status !== 'Cancelled');
    
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
      
    const totalCostOfGoodsSold = activeOrders.reduce((sum, o) => {
      const orderCost = o.items.reduce((itemSum, item) => itemSum + ((item.costPrice || 0) * item.quantity), 0);
      return sum + orderCost;
    }, 0);
      
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const grossProfit = totalRevenue - totalCostOfGoodsSold;
    const netProfit = grossProfit - totalExpenses;

    // Calculate business running days
    let businessDays = 1;
    if (orders.length > 0) {
      const firstOrder = orders[orders.length - 1];
      const diffTime = Math.abs(Date.now() - firstOrder.timestamp);
      businessDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      totalExpenses,
      grossProfit,
      netProfit,
      businessDays,
      lastSync: new Date().toLocaleTimeString(),
      storageSize: (JSON.stringify(localStorage).length / 1024).toFixed(2) + ' KB'
    };
  }
}

export const db = new DatabaseService();
