import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Image, 
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Tag, label: 'Coupons', path: '/coupons' },
  { icon: Image, label: 'Banners', path: '/banners' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-sidebar to-[hsl(215,28%,13%)] text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <span className="font-semibold text-base block leading-tight">Surat Garment</span>
              <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm text-foreground hover:bg-secondary z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "gradient-primary text-white shadow-lg shadow-primary/25" 
                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Admin Info */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-sidebar-accent">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Admin</p>
              <p className="text-xs text-sidebar-muted truncate">admin@suratgarment.in</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          )}
        >
          <LogOut className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
