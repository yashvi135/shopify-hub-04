import { OrdersTable } from '@/components/admin/OrdersTable';
import { useRole } from '@/contexts/RoleContext';

export default function Orders() {
  const { role } = useRole();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">
          {role === 'SUPER_ADMIN' 
            ? 'Track and manage all orders across stores'
            : 'Track orders for your store'
          }
        </p>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
