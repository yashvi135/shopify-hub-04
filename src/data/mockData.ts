import { Product, Category, Order, Coupon, Banner, StoreSettings, DashboardStats, ChartData, PaymentOverview } from '@/types/admin';

export const categories: Category[] = [
  {
    id: 'cat-1', name: 'Sarees', bannerImage: '🥻',
    subcategories: [
      { id: 'sub-1', name: 'Silk Sarees' },
      { id: 'sub-2', name: 'Cotton Sarees' },
      { id: 'sub-3', name: 'Georgette Sarees' },
      { id: 'sub-4', name: 'Banarasi Sarees' },
    ]
  },
  {
    id: 'cat-2', name: 'Ethnic Wear', bannerImage: '👗',
    subcategories: [
      { id: 'sub-5', name: 'Anarkali' },
      { id: 'sub-6', name: 'Kurta Sets' },
      { id: 'sub-7', name: 'Palazzo Sets' },
    ]
  },
  {
    id: 'cat-3', name: 'Bridal', bannerImage: '👰',
    subcategories: [
      { id: 'sub-8', name: 'Lehenga Sets' },
      { id: 'sub-9', name: 'Bridal Sarees' },
      { id: 'sub-10', name: 'Wedding Suits' },
    ]
  },
  {
    id: 'cat-4', name: 'Accessories', bannerImage: '🧣',
    subcategories: [
      { id: 'sub-11', name: 'Dupattas' },
      { id: 'sub-12', name: 'Stoles' },
      { id: 'sub-13', name: 'Jewelry' },
    ]
  },
  {
    id: 'cat-5', name: 'Dress', bannerImage: '👗',
    subcategories: [
      { id: 'sub-14', name: 'Casual Dresses' },
      { id: 'sub-15', name: 'Party Dresses' },
      { id: 'sub-16', name: 'Formal Dresses' },
    ]
  },
];

export const products: Product[] = [
  { id: '1', name: 'Banarasi Silk Saree', categoryId: 'cat-1', subcategoryId: 'sub-1', description: 'Handwoven Banarasi silk with gold zari work', fabric: 'Pure Silk', sku: 'SG-001', images: ['🥻'], purchasePrice: 10000, sellingPrice: 12999, mrp: 14999, discountPercent: 13, finalPrice: 12999, stock: 15, sizeVariants: ['Free Size'], colorVariants: ['Red', 'Gold', 'Maroon'], variantImages: {}, isPublished: true },
  { id: '2', name: 'Chanderi Cotton Saree', categoryId: 'cat-1', subcategoryId: 'sub-2', description: 'Lightweight Chanderi with subtle motifs', fabric: 'Cotton', sku: 'SG-002', images: ['🥻'], purchasePrice: 3500, sellingPrice: 4999, mrp: 5499, discountPercent: 9, finalPrice: 4999, stock: 28, sizeVariants: ['Free Size'], colorVariants: ['White', 'Blue', 'Green'], variantImages: {}, isPublished: true },
  { id: '3', name: 'Embroidered Anarkali', categoryId: 'cat-2', subcategoryId: 'sub-5', description: 'Floor-length Anarkali with intricate embroidery', fabric: 'Georgette', sku: 'SG-003', images: ['👗'], purchasePrice: 6500, sellingPrice: 8999, mrp: 9999, discountPercent: 10, finalPrice: 8999, stock: 12, sizeVariants: ['S', 'M', 'L', 'XL'], colorVariants: ['Navy', 'Wine', 'Black'], variantImages: {}, isPublished: true },
  { id: '4', name: 'Zardozi Lehenga Set', categoryId: 'cat-3', subcategoryId: 'sub-8', description: 'Heavy bridal lehenga with zardozi work', fabric: 'Velvet', sku: 'SG-004', images: ['👗'], purchasePrice: 35000, sellingPrice: 45999, mrp: 49999, discountPercent: 8, finalPrice: 45999, stock: 5, sizeVariants: ['S', 'M', 'L'], colorVariants: ['Red', 'Pink'], variantImages: {}, isPublished: true },
  { id: '5', name: 'Tussar Silk Dupatta', categoryId: 'cat-4', subcategoryId: 'sub-11', description: 'Pure Tussar silk with hand-painted motifs', fabric: 'Tussar Silk', sku: 'SG-005', images: ['🧣'], purchasePrice: 2000, sellingPrice: 2999, mrp: 3499, discountPercent: 14, finalPrice: 2999, stock: 35, sizeVariants: ['Free Size'], colorVariants: ['Beige', 'Yellow'], variantImages: {}, isPublished: true },
  { id: '6', name: 'Patola Saree', categoryId: 'cat-1', subcategoryId: 'sub-1', description: 'Authentic Patan Patola double ikat saree', fabric: 'Pure Silk', sku: 'SG-006', images: ['🥻'], purchasePrice: 28000, sellingPrice: 35999, mrp: 39999, discountPercent: 10, finalPrice: 35999, stock: 3, sizeVariants: ['Free Size'], colorVariants: ['Red', 'Green'], variantImages: {}, isPublished: false },
  { id: '7', name: 'Silk Kurta Set', categoryId: 'cat-2', subcategoryId: 'sub-6', description: 'Pure silk kurta with handloom finish', fabric: 'Silk', sku: 'SG-007', images: ['👘'], purchasePrice: 4000, sellingPrice: 5999, mrp: 6999, discountPercent: 14, finalPrice: 5999, stock: 22, sizeVariants: ['S', 'M', 'L', 'XL'], colorVariants: ['White', 'Cream'], variantImages: {}, isPublished: true },
  { id: '8', name: 'Ikat Print Dress', categoryId: 'cat-5', subcategoryId: 'sub-14', description: 'Contemporary ikat printed cotton dress', fabric: 'Cotton', sku: 'SG-008', images: ['👗'], purchasePrice: 2500, sellingPrice: 3499, mrp: 3999, discountPercent: 12, finalPrice: 3499, stock: 18, sizeVariants: ['S', 'M', 'L', 'XL'], colorVariants: ['Blue', 'Brown'], variantImages: {}, isPublished: true },
  { id: '9', name: 'Kanjivaram Saree', categoryId: 'cat-1', subcategoryId: 'sub-1', description: 'Traditional Kanjivaram with temple border', fabric: 'Pure Silk', sku: 'SG-009', images: ['🥻'], purchasePrice: 22000, sellingPrice: 28999, mrp: 32999, discountPercent: 12, finalPrice: 28999, stock: 0, sizeVariants: ['Free Size'], colorVariants: ['Purple', 'Gold'], variantImages: {}, isPublished: true },
  { id: '10', name: 'Designer Palazzo Set', categoryId: 'cat-2', subcategoryId: 'sub-7', description: 'Flowy palazzo with printed kurta', fabric: 'Rayon', sku: 'SG-010', images: ['👘'], purchasePrice: 3000, sellingPrice: 4299, mrp: 4999, discountPercent: 14, finalPrice: 4299, stock: 30, sizeVariants: ['S', 'M', 'L', 'XL'], colorVariants: ['Teal', 'Mustard', 'Pink'], variantImages: {}, isPublished: true },
];

export const orders: Order[] = [
  { id: 'ORD-2401', customerName: 'Priya Sharma', address: '45 Ring Road, Surat, Gujarat', products: [{ name: 'Banarasi Silk Saree', quantity: 1, price: 12999 }, { name: 'Chanderi Cotton Saree', quantity: 1, price: 4999 }], totalAmount: 17998, paymentMethod: 'Online', paymentStatus: 'paid', status: 'delivered', date: '2024-01-25' },
  { id: 'ORD-2402', customerName: 'Anjali Mehta', address: '12 Varachha Rd, Surat, Gujarat', products: [{ name: 'Zardozi Lehenga Set', quantity: 1, price: 45999 }], totalAmount: 45999, paymentMethod: 'Online', paymentStatus: 'paid', status: 'packed', date: '2024-01-25' },
  { id: 'ORD-2403', customerName: 'Kavita Reddy', address: '78 Textile Market, Surat, Gujarat', products: [{ name: 'Patola Saree', quantity: 1, price: 35999 }, { name: 'Tussar Silk Dupatta', quantity: 1, price: 2999 }], totalAmount: 38998, paymentMethod: 'COD', paymentStatus: 'pending', status: 'received', date: '2024-01-24' },
  { id: 'ORD-2404', customerName: 'Sneha Gupta', address: '23 Adajan, Surat, Gujarat', products: [{ name: 'Silk Kurta Set', quantity: 1, price: 5999 }, { name: 'Ikat Print Dress', quantity: 1, price: 3499 }], totalAmount: 9498, paymentMethod: 'Online', paymentStatus: 'paid', status: 'dispatched', date: '2024-01-24' },
  { id: 'ORD-2405', customerName: 'Ritu Agarwal', address: '56 Katargam, Surat, Gujarat', products: [{ name: 'Kanjivaram Saree', quantity: 1, price: 28999 }], totalAmount: 28999, paymentMethod: 'Online', paymentStatus: 'paid', status: 'delivered', date: '2024-01-23' },
  { id: 'ORD-2406', customerName: 'Deepa Joshi', address: '89 Udhna, Surat, Gujarat', products: [{ name: 'Embroidered Anarkali', quantity: 1, price: 8999 }, { name: 'Designer Palazzo Set', quantity: 1, price: 4299 }], totalAmount: 13298, paymentMethod: 'COD', paymentStatus: 'pending', status: 'packed', date: '2024-01-23' },
  { id: 'ORD-2407', customerName: 'Nisha Verma', address: '34 Piplod, Surat, Gujarat', products: [{ name: 'Tussar Silk Dupatta', quantity: 1, price: 2999 }], totalAmount: 2999, paymentMethod: 'Online', paymentStatus: 'paid', status: 'delivered', date: '2024-01-22' },
  { id: 'ORD-2408', customerName: 'Pooja Singh', address: '67 Vesu, Surat, Gujarat', products: [{ name: 'Silk Kurta Set', quantity: 1, price: 5999 }], totalAmount: 5999, paymentMethod: 'COD', paymentStatus: 'pending', status: 'received', date: '2024-01-22' },
];

export const coupons: Coupon[] = [
  { id: '1', code: 'FIRST20', discountType: 'percentage', discountValue: 20, applyOn: 'store', productIds: [], expiryDate: '2024-03-31', isActive: true },
  { id: '2', code: 'SILK500', discountType: 'flat', discountValue: 500, applyOn: 'product', productIds: ['1', '6', '9'], expiryDate: '2024-02-28', isActive: true },
  { id: '3', code: 'BRIDAL10', discountType: 'percentage', discountValue: 10, applyOn: 'product', productIds: ['4'], expiryDate: '2024-04-30', isActive: false },
];

export const banners: Banner[] = [
  { id: '1', image: '🎉', title: 'New Year Sale', subtitle: 'Upto 50% off on Silk Sarees', redirectTo: 'category', redirectId: 'cat-1', isActive: true, order: 1 },
  { id: '2', image: '👰', title: 'Bridal Collection', subtitle: 'Explore our exclusive bridal range', redirectTo: 'category', redirectId: 'cat-3', isActive: true, order: 2 },
  { id: '3', image: '🥻', title: 'Patola Special', subtitle: 'Handcrafted Patola Sarees', redirectTo: 'product', redirectId: '6', isActive: false, order: 3 },
];

export const storeSettings: StoreSettings = {
  storeName: 'Surat Garment',
  logo: '👗',
  gstNumber: '24AABCS1234F1Z5',
  contactEmail: 'info@suratgarment.in',
  contactPhone: '+91 98765 43210',
  shippingCharges: 99,
  freeShippingAbove: 999,
  codEnabled: true,
  gstPercent: 5,
};

export const dashboardStats: DashboardStats = {
  totalOrders: 944,
  totalRevenue: 7710000,
  totalProducts: 225,
  lowStockProducts: 8,
};

export const monthlyChartData: ChartData[] = [
  { name: 'Aug', revenue: 4250000 },
  { name: 'Sep', revenue: 4890000 },
  { name: 'Oct', revenue: 5780000 },
  { name: 'Nov', revenue: 7890000 },
  { name: 'Dec', revenue: 9450000 },
  { name: 'Jan', revenue: 7710000 },
];

export const paymentOverview: PaymentOverview = {
  totalSales: 7710000,
  codAmount: 2150000,
  onlineAmount: 5560000,
  pendingPayments: 860000,
};
