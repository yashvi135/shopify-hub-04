import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/coupons': 'Coupons',
  '/banners': 'Banners',
  '/payments': 'Payments',
  '/settings': 'Settings',
};

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-20" : "ml-[260px]"
      )}>
        <header className="h-16 border-b border-border bg-card sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-semibold text-foreground hidden md:block">
              {pageTitles[location.pathname] || 'Dashboard'}
            </h2>
            <div className="relative max-w-sm flex-1 ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search products, orders..." 
                className="pl-10 bg-secondary border-0 rounded-lg h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-lg h-9 w-9">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
