import { ShoppingCart, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrdersList } from '@/components/admin/RecentOrdersList';
import { dashboardStats } from '@/data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your garment store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Orders" value={dashboardStats.totalOrders.toLocaleString()} icon={ShoppingCart} />
        <StatsCard title="Total Revenue" value={`₹${(dashboardStats.totalRevenue / 100000).toFixed(1)}L`} icon={DollarSign} />
        <StatsCard title="Total Products" value={dashboardStats.totalProducts.toLocaleString()} icon={Package} />
        <StatsCard title="Low Stock" value={dashboardStats.lowStockProducts.toString()} icon={AlertTriangle} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentOrdersList />
        </div>
      </div>
    </div>
  );
}
