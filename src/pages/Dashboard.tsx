import { ShoppingCart, DollarSign, Package, Store, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrdersChart } from '@/components/admin/OrdersChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { dashboardStats, stores } from '@/data/mockData';
import { useRole } from '@/contexts/RoleContext';

export default function Dashboard() {
  const { role, currentStoreId } = useRole();
  const currentStore = stores.find(s => s.id === currentStoreId);

  // For store owner, show their store stats
  const stats = role === 'STORE_OWNER' && currentStore ? {
    totalOrders: currentStore.totalOrders,
    totalRevenue: currentStore.revenue,
    totalProducts: currentStore.productCount,
    orderChange: 12.5,
    revenueChange: 8.3,
  } : dashboardStats;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {role === 'SUPER_ADMIN' ? 'Dashboard' : `Welcome, ${currentStore?.ownerName || 'Store Owner'}`}
        </h1>
        <p className="text-muted-foreground">
          {role === 'SUPER_ADMIN' 
            ? "Overview of your garment marketplace" 
            : `Manage your store: ${currentStore?.name || ''}`
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders.toLocaleString()} 
          change={stats.orderChange}
          trend="up"
          icon={ShoppingCart}
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`} 
          change={stats.revenueChange}
          trend="up"
          icon={DollarSign}
        />
        <StatsCard 
          title={role === 'SUPER_ADMIN' ? "Total Products" : "My Products"} 
          value={role === 'SUPER_ADMIN' ? dashboardStats.totalProducts.toLocaleString() : stats.totalProducts.toString()} 
          icon={Package}
        />
        {role === 'SUPER_ADMIN' ? (
          <StatsCard 
            title="Active Stores" 
            value={dashboardStats.activeStores} 
            icon={Store}
          />
        ) : (
          <StatsCard 
            title="Product Limit" 
            value={`${currentStore?.productCount || 0}/${currentStore?.productLimit || 0}`} 
            icon={TrendingUp}
          />
        )}
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

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
