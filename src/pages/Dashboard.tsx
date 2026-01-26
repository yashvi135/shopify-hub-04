import { ShoppingCart, DollarSign, Package, Store } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrdersChart } from '@/components/admin/OrdersChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { dashboardStats } from '@/data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your stores.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Orders" 
          value={dashboardStats.totalOrders.toLocaleString()} 
          change={dashboardStats.orderChange}
          trend="up"
          icon={ShoppingCart}
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${(dashboardStats.totalRevenue / 100000).toFixed(1)}L`} 
          change={dashboardStats.revenueChange}
          trend="up"
          icon={DollarSign}
        />
        <StatsCard 
          title="Total Products" 
          value={dashboardStats.totalProducts.toLocaleString()} 
          icon={Package}
        />
        <StatsCard 
          title="Active Stores" 
          value={dashboardStats.activeStores} 
          icon={Store}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrdersChart />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
