import { categoryStats, dashboardStats, stores } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Crown, Package, IndianRupee } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

export function AnalyticsCards() {
  const { role, currentStoreId } = useRole();

  // For store owner, filter to their store
  const currentStore = stores.find(s => s.id === currentStoreId);
  
  const topCategory = categoryStats[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Top Selling Category */}
      <Card className="luxury-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Crown className="w-4 h-4 text-gold" />
            Top Selling Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{topCategory.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {topCategory.count} products sold
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gold-light flex items-center justify-center">
              <span className="text-3xl">🥻</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="luxury-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-gold" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                ₹{role === 'SUPER_ADMIN' 
                  ? (dashboardStats.totalRevenue / 100000).toFixed(1) 
                  : currentStore 
                    ? (currentStore.revenue / 100000).toFixed(1)
                    : '0'
                }L
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-sm text-success">+{dashboardStats.revenueChange}%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="luxury-card md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-gold" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryStats.slice(0, 4).map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">₹{(cat.revenue / 100000).toFixed(1)}L revenue</p>
                </div>
                <span className="text-xs text-muted-foreground">{cat.count} sold</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
