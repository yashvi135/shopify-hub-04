import { Store, Product, Order, Template, DashboardStats, ChartData, HomePageRow, CategoryStats } from '@/types/admin';

export const stores: Store[] = [
  { 
    id: '1', 
    name: 'Silk & Satin Boutique', 
    location: 'Ring Road, Surat', 
    isActive: true, 
    productLimit: 50, 
    productCount: 32,
    ownerName: 'Meera Patel',
    ownerEmail: 'meera@silksatin.in',
    revenue: 1250000,
    totalOrders: 156
  },
  { 
    id: '2', 
    name: 'Royal Ethnic Wear', 
    location: 'Varachha Road, Surat', 
    isActive: true, 
    productLimit: 100, 
    productCount: 78,
    ownerName: 'Raj Sharma',
    ownerEmail: 'raj@royalethnic.in',
    revenue: 2340000,
    totalOrders: 289
  },
  { 
    id: '3', 
    name: 'Zari & Zardozi', 
    location: 'Textile Market, Surat', 
    isActive: true, 
    productLimit: 75, 
    productCount: 45,
    ownerName: 'Fatima Khan',
    ownerEmail: 'fatima@zarizardozi.in',
    revenue: 1890000,
    totalOrders: 198
  },
  { 
    id: '4', 
    name: 'Modern Drapes', 
    location: 'Adajan, Surat', 
    isActive: false, 
    productLimit: 30, 
    productCount: 12,
    ownerName: 'Priya Desai',
    ownerEmail: 'priya@moderndrapes.in',
    revenue: 450000,
    totalOrders: 67
  },
  { 
    id: '5', 
    name: 'Heritage Handlooms', 
    location: 'Katargam, Surat', 
    isActive: true, 
    productLimit: 60, 
    productCount: 58,
    ownerName: 'Arjun Nair',
    ownerEmail: 'arjun@heritagehandlooms.in',
    revenue: 1780000,
    totalOrders: 234
  },
];

export const products: Product[] = [
  { id: '1', name: 'Banarasi Silk Saree', category: 'Sarees', price: 12999, stock: 15, storeId: '1', isPublished: true, image: '🥻', sku: 'SS-001', description: 'Handwoven Banarasi silk with gold zari work' },
  { id: '2', name: 'Chanderi Cotton Saree', category: 'Sarees', price: 4999, stock: 28, storeId: '1', isPublished: true, image: '🥻', sku: 'SS-002', description: 'Lightweight Chanderi with subtle motifs' },
  { id: '3', name: 'Embroidered Anarkali', category: 'Ethnic', price: 8999, stock: 12, storeId: '2', isPublished: true, image: '👗', sku: 'RE-001', description: 'Floor-length Anarkali with intricate embroidery' },
  { id: '4', name: 'Zardozi Lehenga Set', category: 'Bridal', price: 45999, stock: 5, storeId: '2', isPublished: true, image: '👗', sku: 'RE-002', description: 'Heavy bridal lehenga with zardozi work' },
  { id: '5', name: 'Tussar Silk Dupatta', category: 'Accessories', price: 2999, stock: 35, storeId: '3', isPublished: true, image: '🧣', sku: 'ZZ-001', description: 'Pure Tussar silk with hand-painted motifs' },
  { id: '6', name: 'Patola Saree', category: 'Sarees', price: 35999, stock: 3, storeId: '3', isPublished: false, image: '🥻', sku: 'ZZ-002', description: 'Authentic Patan Patola double ikat saree' },
  { id: '7', name: 'Silk Kurta Set', category: 'Ethnic', price: 5999, stock: 22, storeId: '5', isPublished: true, image: '👘', sku: 'HH-001', description: 'Pure silk kurta with handloom finish' },
  { id: '8', name: 'Ikat Print Dress', category: 'Dress', price: 3499, stock: 18, storeId: '5', isPublished: true, image: '👗', sku: 'HH-002', description: 'Contemporary ikat printed cotton dress' },
  { id: '9', name: 'Kanjivaram Saree', category: 'Sarees', price: 28999, stock: 0, storeId: '1', isPublished: true, image: '🥻', sku: 'SS-003', description: 'Traditional Kanjivaram with temple border' },
  { id: '10', name: 'Designer Palazzo Set', category: 'Ethnic', price: 4299, stock: 30, storeId: '2', isPublished: true, image: '👘', sku: 'RE-003', description: 'Flowy palazzo with printed kurta' },
];

export const orders: Order[] = [
  { id: 'ORD-2401', customerName: 'Priya Sharma', storeName: 'Silk & Satin Boutique', storeId: '1', total: 17998, status: 'delivered', date: '2024-01-25', items: 2, products: ['Banarasi Silk Saree', 'Chanderi Cotton Saree'] },
  { id: 'ORD-2402', customerName: 'Anjali Mehta', storeName: 'Royal Ethnic Wear', storeId: '2', total: 45999, status: 'curating', date: '2024-01-25', items: 1, products: ['Zardozi Lehenga Set'] },
  { id: 'ORD-2403', customerName: 'Kavita Reddy', storeName: 'Zari & Zardozi', storeId: '3', total: 38998, status: 'received', date: '2024-01-24', items: 2, products: ['Patola Saree', 'Tussar Silk Dupatta'] },
  { id: 'ORD-2404', customerName: 'Sneha Gupta', storeName: 'Heritage Handlooms', storeId: '5', total: 9498, status: 'dispatched', date: '2024-01-24', items: 2, products: ['Silk Kurta Set', 'Ikat Print Dress'] },
  { id: 'ORD-2405', customerName: 'Ritu Agarwal', storeName: 'Silk & Satin Boutique', storeId: '1', total: 28999, status: 'delivered', date: '2024-01-23', items: 1, products: ['Kanjivaram Saree'] },
  { id: 'ORD-2406', customerName: 'Deepa Joshi', storeName: 'Royal Ethnic Wear', storeId: '2', total: 13298, status: 'curating', date: '2024-01-23', items: 2, products: ['Embroidered Anarkali', 'Designer Palazzo Set'] },
  { id: 'ORD-2407', customerName: 'Nisha Verma', storeName: 'Zari & Zardozi', storeId: '3', total: 2999, status: 'delivered', date: '2024-01-22', items: 1, products: ['Tussar Silk Dupatta'] },
  { id: 'ORD-2408', customerName: 'Pooja Singh', storeName: 'Heritage Handlooms', storeId: '5', total: 5999, status: 'received', date: '2024-01-22', items: 1, products: ['Silk Kurta Set'] },
];

export const templates: Template[] = [
  { id: '1', name: 'Ivory Elegance', description: 'Clean, minimalist layout with ivory tones', preview: '✨', isActive: true, category: 'minimal' },
  { id: '2', name: 'Golden Luxe', description: 'Premium design with gold accents throughout', preview: '👑', isActive: false, category: 'classic' },
  { id: '3', name: 'Rose Garden', description: 'Soft pinks and florals for feminine appeal', preview: '🌸', isActive: false, category: 'modern' },
  { id: '4', name: 'Regal Heritage', description: 'Traditional motifs with royal aesthetics', preview: '🏰', isActive: false, category: 'classic' },
  { id: '5', name: 'Modern Minimal', description: 'Contemporary design with bold typography', preview: '◼️', isActive: false, category: 'bold' },
  { id: '6', name: 'Festive Glow', description: 'Vibrant colors perfect for celebrations', preview: '🎉', isActive: false, category: 'bold' },
];

export const homePageRows: HomePageRow[] = [
  { id: '1', type: 'hero_banner', title: 'Hero Banner', isVisible: true, order: 1, config: { bannerImage: '/banner.jpg' } },
  { id: '2', type: 'category_circles', title: 'Shop by Category', isVisible: true, order: 2, config: { categories: ['Sarees', 'Ethnic', 'Bridal', 'Accessories'] } },
  { id: '3', type: 'top_selling', title: 'Top Selling', isVisible: true, order: 3 },
  { id: '4', type: 'sponsored_brands', title: 'Featured Boutiques', isVisible: true, order: 4, config: { brandIds: ['1', '2', '3'] } },
];

export const dashboardStats: DashboardStats = {
  totalOrders: 944,
  totalRevenue: 7710000,
  totalProducts: 225,
  activeStores: 4,
  orderChange: 15.8,
  revenueChange: 12.3,
};

export const categoryStats: CategoryStats[] = [
  { name: 'Silk Sarees', count: 89, revenue: 2890000 },
  { name: 'Ethnic Wear', count: 67, revenue: 1560000 },
  { name: 'Bridal Collection', count: 23, revenue: 1890000 },
  { name: 'Cotton Sarees', count: 45, revenue: 890000 },
];

export const dailyChartData: ChartData[] = [
  { name: 'Mon', orders: 32, revenue: 185000 },
  { name: 'Tue', orders: 45, revenue: 245000 },
  { name: 'Wed', orders: 38, revenue: 198000 },
  { name: 'Thu', orders: 52, revenue: 312000 },
  { name: 'Fri', orders: 68, revenue: 425000 },
  { name: 'Sat', orders: 85, revenue: 565000 },
  { name: 'Sun', orders: 48, revenue: 295000 },
];

export const weeklyChartData: ChartData[] = [
  { name: 'Week 1', orders: 245, revenue: 1450000 },
  { name: 'Week 2', orders: 312, revenue: 1890000 },
  { name: 'Week 3', orders: 287, revenue: 1680000 },
  { name: 'Week 4', orders: 356, revenue: 2150000 },
];

export const monthlyChartData: ChartData[] = [
  { name: 'Aug', orders: 756, revenue: 4250000 },
  { name: 'Sep', orders: 823, revenue: 4890000 },
  { name: 'Oct', orders: 945, revenue: 5780000 },
  { name: 'Nov', orders: 1234, revenue: 7890000 },
  { name: 'Dec', orders: 1567, revenue: 9450000 },
  { name: 'Jan', orders: 944, revenue: 7710000 },
];
