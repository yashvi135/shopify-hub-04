import { orders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const statusStyles: Record<string, string> = {
  received: 'bg-warning/10 text-warning',
  packed: 'bg-info/10 text-info',
  dispatched: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

export function RecentOrdersList() {
  const recent = orders.slice(0, 5);

  return (
    <div className="modern-card p-6 animate-fade-in h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Last 5 orders</p>
        </div>
        <Link to="/orders" className="text-sm text-primary hover:underline font-medium">View All</Link>
      </div>
      <div className="space-y-3">
        {recent.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0">
            <div className="min-w-0">
              <p className="font-medium text-sm">{order.customerName}</p>
              <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <p className="font-semibold text-sm">₹{order.totalAmount.toLocaleString()}</p>
              <Badge variant="secondary" className={cn("text-xs rounded-full capitalize", statusStyles[order.status])}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
