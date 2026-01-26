import { OrdersTable } from '@/components/admin/OrdersTable';

export default function Orders() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Track and manage all orders from your stores</p>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
