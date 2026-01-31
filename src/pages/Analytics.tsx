import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { OrdersChart } from '@/components/admin/OrdersChart';
import { categoryStats } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Analytics() {
  const maxRevenue = Math.max(...categoryStats.map(c => c.revenue));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Insights and performance metrics for your marketplace</p>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart />
        
        {/* Category Performance Chart */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-display">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-sm text-gold font-display font-bold">
                      ₹{(cat.revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <Progress 
                    value={(cat.revenue / maxRevenue) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
