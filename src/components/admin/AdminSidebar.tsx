import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Store, 
  Palette, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Crown,
  User,
  BarChart3
} from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const superAdminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Store, label: 'Boutiques', path: '/stores' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Palette, label: 'Home Page', path: '/templates' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const storeOwnerNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'My Products', path: '/inventory' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { role, setRole } = useRole();
  
  const navItems = role === 'SUPER_ADMIN' ? superAdminNavItems : storeOwnerNavItems;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-rose flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">S</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg block leading-tight">Surat</span>
              <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Garment</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Role Toggle - For Development */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <p className="text-[10px] text-sidebar-muted uppercase tracking-wider mb-2">Dev Mode</p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={role === 'SUPER_ADMIN' ? 'default' : 'ghost'}
              onClick={() => setRole('SUPER_ADMIN')}
              className={cn(
                "flex-1 text-xs h-8 rounded-lg gap-1",
                role === 'SUPER_ADMIN' 
                  ? "bg-gold text-white hover:bg-gold/90" 
                  : "text-sidebar-muted hover:text-sidebar-foreground"
              )}
            >
              <Crown className="w-3 h-3" />
              Admin
            </Button>
            <Button
              size="sm"
              variant={role === 'STORE_OWNER' ? 'default' : 'ghost'}
              onClick={() => setRole('STORE_OWNER')}
              className={cn(
                "flex-1 text-xs h-8 rounded-lg gap-1",
                role === 'STORE_OWNER' 
                  ? "bg-rose text-foreground hover:bg-rose/90" 
                  : "text-sidebar-muted hover:text-sidebar-foreground"
              )}
            >
              <User className="w-3 h-3" />
              Owner
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-gold to-gold/80 text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Current Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              role === 'SUPER_ADMIN' 
                ? "bg-gradient-to-br from-gold to-rose" 
                : "bg-rose"
            )}>
              {role === 'SUPER_ADMIN' ? (
                <Crown className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Store Owner'}
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                {role === 'SUPER_ADMIN' ? 'Full Access' : 'Silk & Satin Boutique'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border">
        <button 
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          )}
        >
          <LogOut className={cn("w-5 h-5 shrink-0", collapsed && "mx-auto")} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
