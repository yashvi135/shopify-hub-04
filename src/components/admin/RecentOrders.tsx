import { orders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentOrders() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Latest orders from all stores</p>
        </div>
        <a href="/orders" className="text-sm font-medium text-primary hover:underline">
          View all
        </a>
      </div>

      <div className="space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div 
            key={order.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {order.customerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-card-foreground">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.storeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-card-foreground">₹{order.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{order.items} items</p>
              </div>
              <Badge 
                variant="outline" 
                className={cn("capitalize", statusStyles[order.status])}
              >
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
