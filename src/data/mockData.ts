import { Store, Product, Order, Template, DashboardStats, ChartData } from '@/types/admin';

export const stores: Store[] = [
  { id: '1', name: 'Downtown Fashion Hub', location: 'Mumbai Central', isActive: true },
  { id: '2', name: 'Style Street', location: 'Andheri West', isActive: true },
  { id: '3', name: 'Trendy Threads', location: 'Bandra', isActive: true },
  { id: '4', name: 'Fashion Forward', location: 'Juhu', isActive: false },
  { id: '5', name: 'Urban Outfits', location: 'Powai', isActive: true },
];

export const products: Product[] = [
  { id: '1', name: 'Classic White T-Shirt', category: 'T-Shirts', price: 599, stock: 150, storeId: '1', isPublished: true, image: '👕', sku: 'TS-001' },
  { id: '2', name: 'Slim Fit Denim Jeans', category: 'Jeans', price: 1499, stock: 80, storeId: '1', isPublished: true, image: '👖', sku: 'JN-001' },
  { id: '3', name: 'Summer Floral Dress', category: 'Dresses', price: 1999, stock: 45, storeId: '2', isPublished: true, image: '👗', sku: 'DR-001' },
  { id: '4', name: 'Leather Jacket', category: 'Jackets', price: 4999, stock: 25, storeId: '2', isPublished: false, image: '🧥', sku: 'JK-001' },
  { id: '5', name: 'Running Sneakers', category: 'Footwear', price: 2499, stock: 60, storeId: '3', isPublished: true, image: '👟', sku: 'FW-001' },
  { id: '6', name: 'Cotton Kurta', category: 'Ethnic', price: 899, stock: 100, storeId: '3', isPublished: true, image: '👘', sku: 'ET-001' },
  { id: '7', name: 'Formal Blazer', category: 'Formals', price: 3499, stock: 35, storeId: '5', isPublished: true, image: '🥋', sku: 'FM-001' },
  { id: '8', name: 'Sports Track Pants', category: 'Sportswear', price: 799, stock: 120, storeId: '5', isPublished: false, image: '🩳', sku: 'SP-001' },
  { id: '9', name: 'Woolen Sweater', category: 'Winter Wear', price: 1299, stock: 0, storeId: '1', isPublished: true, image: '🧶', sku: 'WW-001' },
  { id: '10', name: 'Silk Saree', category: 'Ethnic', price: 5999, stock: 15, storeId: '2', isPublished: true, image: '🥻', sku: 'ET-002' },
];

export const orders: Order[] = [
  { id: 'ORD-001', customerName: 'Priya Sharma', storeName: 'Downtown Fashion Hub', total: 2098, status: 'delivered', date: '2024-01-25', items: 3 },
  { id: 'ORD-002', customerName: 'Rahul Mehta', storeName: 'Style Street', total: 4999, status: 'processing', date: '2024-01-25', items: 1 },
  { id: 'ORD-003', customerName: 'Anjali Patel', storeName: 'Trendy Threads', total: 3398, status: 'pending', date: '2024-01-24', items: 2 },
  { id: 'ORD-004', customerName: 'Vikram Singh', storeName: 'Urban Outfits', total: 1299, status: 'delivered', date: '2024-01-24', items: 1 },
  { id: 'ORD-005', customerName: 'Neha Gupta', storeName: 'Downtown Fashion Hub', total: 5997, status: 'processing', date: '2024-01-23', items: 4 },
  { id: 'ORD-006', customerName: 'Amit Kumar', storeName: 'Style Street', total: 899, status: 'cancelled', date: '2024-01-23', items: 1 },
  { id: 'ORD-007', customerName: 'Pooja Reddy', storeName: 'Trendy Threads', total: 2499, status: 'delivered', date: '2024-01-22', items: 1 },
  { id: 'ORD-008', customerName: 'Arjun Nair', storeName: 'Urban Outfits', total: 6498, status: 'pending', date: '2024-01-22', items: 3 },
];

export const templates: Template[] = [
  { id: '1', name: 'Minimal Clean', description: 'Simple, elegant layout with focus on products', preview: '🎨', isActive: true, category: 'minimal' },
  { id: '2', name: 'Modern Grid', description: 'Contemporary grid-based design with animations', preview: '🖼️', isActive: false, category: 'modern' },
  { id: '3', name: 'Classic Elegance', description: 'Traditional layout with sophisticated typography', preview: '📜', isActive: false, category: 'classic' },
  { id: '4', name: 'Bold Impact', description: 'High contrast design with large visuals', preview: '⚡', isActive: false, category: 'bold' },
  { id: '5', name: 'Fresh Vibes', description: 'Colorful and playful design for younger audience', preview: '🌈', isActive: false, category: 'modern' },
  { id: '6', name: 'Premium Luxe', description: 'Luxury-focused design with gold accents', preview: '✨', isActive: false, category: 'classic' },
];

export const dashboardStats: DashboardStats = {
  totalOrders: 1247,
  totalRevenue: 4856000,
  totalProducts: 856,
  activeStores: 4,
  orderChange: 12.5,
  revenueChange: 8.3,
};

export const dailyChartData: ChartData[] = [
  { name: 'Mon', orders: 45, revenue: 125000 },
  { name: 'Tue', orders: 52, revenue: 148000 },
  { name: 'Wed', orders: 38, revenue: 98000 },
  { name: 'Thu', orders: 65, revenue: 178000 },
  { name: 'Fri', orders: 78, revenue: 215000 },
  { name: 'Sat', orders: 92, revenue: 285000 },
  { name: 'Sun', orders: 68, revenue: 195000 },
];

export const weeklyChartData: ChartData[] = [
  { name: 'Week 1', orders: 312, revenue: 856000 },
  { name: 'Week 2', orders: 285, revenue: 742000 },
  { name: 'Week 3', orders: 368, revenue: 985000 },
  { name: 'Week 4', orders: 425, revenue: 1125000 },
];

export const monthlyChartData: ChartData[] = [
  { name: 'Jan', orders: 1247, revenue: 3450000 },
  { name: 'Feb', orders: 1089, revenue: 2980000 },
  { name: 'Mar', orders: 1456, revenue: 4120000 },
  { name: 'Apr', orders: 1678, revenue: 4850000 },
  { name: 'May', orders: 1234, revenue: 3560000 },
  { name: 'Jun', orders: 1567, revenue: 4280000 },
];
