import { useState } from 'react';
import { stores, products, orders } from '@/data/mockData';
import { Store } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { MapPin, Package, ShoppingCart, Plus, Settings, TrendingUp } from 'lucide-react';

export function StoresGrid() {
  const [storeList, setStoreList] = useState<Store[]>(stores);

  const toggleStoreStatus = (storeId: string) => {
    setStoreList(prev => 
      prev.map(s => 
        s.id === storeId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const getStoreStats = (storeId: string) => {
    const storeProducts = products.filter(p => p.storeId === storeId);
    const storeOrders = orders.filter(o => 
      stores.find(s => s.id === storeId)?.name === o.storeName
    );
    const revenue = storeOrders.reduce((sum, o) => sum + o.total, 0);
    
    return {
      products: storeProducts.length,
      orders: storeOrders.length,
      revenue,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Store Management</h3>
          <p className="text-sm text-muted-foreground">Manage all your stores in one place</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Store
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeList.map((store) => {
          const stats = getStoreStats(store.id);
          return (
            <div 
              key={store.id}
              className={cn(
                "bg-card rounded-xl border shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated",
                store.isActive ? "border-border/50" : "border-destructive/30 opacity-75"
              )}
            >
              {/* Store Header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground">{store.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={store.isActive 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {store.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{store.location}</span>
                    </div>
                  </div>
                  <Switch 
                    checked={store.isActive}
                    onCheckedChange={() => toggleStoreStatus(store.id)}
                  />
                </div>
              </div>

              {/* Store Stats */}
              <div className="p-5 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-card-foreground">{stats.products}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <ShoppingCart className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-lg font-bold text-card-foreground">{stats.orders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-lg font-bold text-card-foreground">₹{(stats.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>

              {/* Store Actions */}
              <div className="p-4 bg-secondary/30 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button size="sm" className="flex-1 gap-1">
                  <Package className="w-4 h-4" />
                  Inventory
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
