import { orders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  received: 'bg-secondary text-foreground',
  packed: 'bg-warning/10 text-warning',
  dispatched: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

export function RecentOrdersList() {
  const recent = orders.slice(0, 5);

  return (
    <div className="modern-card p-6 animate-fade-in h-full">
      <h3 className="text-lg font-semibold text-foreground mb-1">Recent Orders</h3>
      <p className="text-sm text-muted-foreground mb-4">Last 5 orders</p>
      <div className="space-y-4">
        {recent.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{order.customerName}</p>
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
