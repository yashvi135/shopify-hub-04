export interface Product {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  fabric: string;
  sku: string;
  images: string[];
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
  sizeVariants: string[];
  colorVariants: string[];
  isPublished: boolean;
}

export interface Category {
  id: string;
  name: string;
  bannerImage: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export type OrderStatus = 'received' | 'packed' | 'dispatched' | 'delivered';
export type PaymentMethod = 'COD' | 'Online';
export type PaymentStatus = 'paid' | 'pending';

export interface Order {
  id: string;
  customerName: string;
  address: string;
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
}

export type DiscountType = 'flat' | 'percentage';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  applyOn: 'store' | 'product';
  productIds: string[];
  expiryDate: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  redirectTo: 'product' | 'category';
  redirectId: string;
  isActive: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  gstNumber: string;
  contactEmail: string;
  contactPhone: string;
  shippingCharges: number;
  freeShippingAbove: number;
  codEnabled: boolean;
  gstPercent: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface ChartData {
  name: string;
  revenue: number;
}

export interface PaymentOverview {
  totalSales: number;
  codAmount: number;
  onlineAmount: number;
  pendingPayments: number;
}
