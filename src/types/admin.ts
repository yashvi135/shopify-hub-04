export interface Store {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  productLimit: number;
  productCount: number;
  ownerName: string;
  ownerEmail: string;
  revenue: number;
  totalOrders: number;
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
  description?: string;
}

export type OrderStatus = 'received' | 'curating' | 'dispatched' | 'delivered';

export interface Order {
  id: string;
  customerName: string;
  storeName: string;
  storeId: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
  products: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  isActive: boolean;
  category: 'minimal' | 'modern' | 'classic' | 'bold';
}

export type HomePageRowType = 'hero_banner' | 'top_selling' | 'category_circles' | 'sponsored_brands';

export interface HomePageRow {
  id: string;
  type: HomePageRowType;
  title: string;
  isVisible: boolean;
  order: number;
  config?: {
    bannerImage?: string;
    categories?: string[];
    brandIds?: string[];
  };
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

export interface CategoryStats {
  name: string;
  count: number;
  revenue: number;
}
