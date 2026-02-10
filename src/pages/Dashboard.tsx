import { ShoppingCart, IndianRupee, Package, AlertTriangle } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrdersList } from '@/components/admin/RecentOrdersList';
import { dashboardStats } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Orders" 
          value={dashboardStats.totalOrders.toLocaleString()} 
          icon={ShoppingCart} 
          change={12.5} 
          trend="up"
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${(dashboardStats.totalRevenue / 100000).toFixed(1)}L`} 
          icon={IndianRupee} 
          change={8.2} 
          trend="up"
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatsCard 
          title="Total Products" 
          value={dashboardStats.totalProducts.toLocaleString()} 
          icon={Package}
          iconBg="bg-info/10"
          iconColor="text-info"
          subtitle="Active in store"
        />
        <StatsCard 
          title="Low Stock Alert" 
          value={dashboardStats.lowStockProducts.toString()} 
          icon={AlertTriangle}
          iconBg="bg-destructive/10"
          iconColor="text-destructive"
          subtitle="Products need restock"
        />
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
