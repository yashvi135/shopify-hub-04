export interface Store {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  storeId: string;
  isPublished: boolean;
  image: string;
  sku: string;
}

export interface Order {
  id: string;
  customerName: string;
  storeName: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  isActive: boolean;
  category: 'minimal' | 'modern' | 'classic' | 'bold';
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeStores: number;
  orderChange: number;
  revenueChange: number;
}

export interface ChartData {
  name: string;
  orders: number;
  revenue: number;
}
