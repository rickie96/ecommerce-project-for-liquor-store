
export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number; // Purchase price for profit calculation
  description: string;
  category: string;
  image: string;
  stock: number;
  demand: number; // Represents customer "needs" or interest level
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  timestamp: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'IN' | 'OUT';
  timestamp: number;
  date: string;
}

export interface Order {
  id: string;
  userId?: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  aiMessage?: string;
  feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export type View = 'home' | 'shop' | 'orders' | 'checkout' | 'receipt' | 'admin' | 'login' | 'register';
