import { useState } from 'react';
import { stores, products, orders } from '@/data/mockData';
import { Store } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { MapPin, Package, ShoppingCart, Plus, Settings, TrendingUp, Crown, User, Mail } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

export function StoresGrid() {
  const [storeList, setStoreList] = useState<Store[]>(stores);
  const { role } = useRole();

  const toggleStoreStatus = (storeId: string) => {
    setStoreList(prev => 
      prev.map(s => 
        s.id === storeId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const updateProductLimit = (storeId: string, limit: number) => {
    setStoreList(prev => 
      prev.map(s => 
        s.id === storeId ? { ...s, productLimit: limit } : s
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Boutique Management</h1>
          <p className="text-muted-foreground">Manage all registered boutiques and their limits</p>
        </div>
        {role === 'SUPER_ADMIN' && (
          <Button className="gap-2 rounded-2xl shadow-gold">
            <Plus className="w-4 h-4" />
            Add Boutique
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {storeList.map((store) => (
          <div 
            key={store.id}
            className={cn(
              "luxury-card overflow-hidden",
              !store.isActive && "opacity-60"
            )}
          >
            {/* Store Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-semibold text-lg text-card-foreground">{store.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{store.location}</span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "rounded-full",
                    store.isActive 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  )}
                >
                  {store.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{store.ownerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{store.ownerEmail}</p>
                </div>
              </div>
            </div>

            {/* Product Limit Section - Super Admin Only */}
            {role === 'SUPER_ADMIN' && (
              <div className="p-6 border-b border-border bg-gold-light/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium">Product Limit</span>
                  </div>
                  <span className="text-sm font-bold text-gold">{store.productLimit}</span>
                </div>
                <Slider
                  value={[store.productLimit]}
                  onValueChange={(v) => updateProductLimit(store.id, v[0])}
                  max={200}
                  min={10}
                  step={5}
                  className="mb-3"
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Products Used</span>
                    <span>{store.productCount} / {store.productLimit}</span>
                  </div>
                  <Progress 
                    value={(store.productCount / store.productLimit) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            )}

            {/* Store Stats */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <p className="text-lg font-display font-bold text-card-foreground">{store.productCount}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="text-center">
                <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-5 h-5 text-success" />
                </div>
                <p className="text-lg font-display font-bold text-card-foreground">{store.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
              <div className="text-center">
                <div className="w-11 h-11 rounded-xl bg-gold-light flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
                <p className="text-lg font-display font-bold text-card-foreground">₹{(store.revenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>

            {/* Store Actions */}
            <div className="p-4 bg-secondary/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active</span>
                <Switch 
                  checked={store.isActive}
                  onCheckedChange={() => toggleStoreStatus(store.id)}
                />
              </div>
              <Button size="sm" className="rounded-xl gap-1">
                <Settings className="w-4 h-4" />
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
