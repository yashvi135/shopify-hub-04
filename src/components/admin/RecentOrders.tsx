import { orders } from '@/data/mockData';
import { OrderStatus } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/contexts/RoleContext';
import { Link } from 'react-router-dom';

const statusConfig: Record<OrderStatus, { label: string; style: string }> = {
  received: { label: '💝 Received', style: 'bg-rose-light text-rose-foreground border-rose/30' },
  curating: { label: '🧵 Curating', style: 'bg-gold-light text-gold-foreground border-gold/30' },
  dispatched: { label: '🚚 Dispatched', style: 'bg-primary/10 text-primary border-primary/30' },
  delivered: { label: '✨ Delivered', style: 'bg-success/10 text-success border-success/30' },
};

export function RecentOrders() {
  const { role, currentStoreId } = useRole();
  
  const filteredOrders = role === 'STORE_OWNER'
    ? orders.filter(o => o.storeId === currentStoreId)
    : orders;

  return (
    <Card className="luxury-card animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display">Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'SUPER_ADMIN' ? 'Latest orders from all boutiques' : 'Your latest orders'}
            </p>
          </div>
          <Link to="/orders" className="text-sm font-medium text-gold hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredOrders.slice(0, 5).map((order) => {
            const status = statusConfig[order.status];
            return (
              <div 
                key={order.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
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
                    <p className="font-display font-bold text-card-foreground">₹{order.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("rounded-full text-xs", status.style)}
                  >
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
