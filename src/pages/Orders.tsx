import { useState } from 'react';
import { orders as initialOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Download, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

const statusConfig: Record<OrderStatus, { label: string; style: string; icon: any }> = {
  received: { label: 'Received', icon: Clock, style: 'bg-secondary text-foreground' },
  packed: { label: 'Packed', icon: Package, style: 'bg-warning/10 text-warning' },
  dispatched: { label: 'Dispatched', icon: Truck, style: 'bg-primary/10 text-primary' },
  delivered: { label: 'Delivered', icon: CheckCircle, style: 'bg-success/10 text-success' },
};

export default function Orders() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = statusFilter === 'all' ? orderList : orderList.filter(o => o.status === statusFilter);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const statusCounts = {
    all: orderList.length,
    received: orderList.filter(o => o.status === 'received').length,
    packed: orderList.filter(o => o.status === 'packed').length,
    dispatched: orderList.filter(o => o.status === 'dispatched').length,
    delivered: orderList.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track orders</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-2xl">
          <Download className="w-4 h-4" />
          Export to Excel
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'received', 'packed', 'dispatched', 'delivered'] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className="gap-2 rounded-2xl"
          >
            <span>{s === 'all' ? 'All Orders' : statusConfig[s].label}</span>
            <Badge variant="secondary" className={cn("text-xs px-2 rounded-full", statusFilter === s ? "bg-primary-foreground/20 text-primary-foreground" : "")}>
              {statusCounts[s]}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="modern-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="group">
                <TableCell className="font-mono font-medium text-primary">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.address}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="font-semibold">₹{order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="rounded-full text-xs w-fit">{order.paymentMethod}</Badge>
                    <Badge variant="secondary" className={cn("rounded-full text-xs w-fit", order.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}>
                    <SelectTrigger className={cn("w-[140px] rounded-full text-xs h-8", statusConfig[order.status].style)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="packed">Packed</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="font-bold">Order {order.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{order.customerName}</p></div>
                          <div><p className="text-muted-foreground">Date</p><p className="font-medium">{order.date}</p></div>
                          <div><p className="text-muted-foreground">Address</p><p className="font-medium">{order.address}</p></div>
                          <div><p className="text-muted-foreground">Payment</p><p className="font-medium">{order.paymentMethod} • {order.paymentStatus}</p></div>
                        </div>
                        <div className="border-t border-border pt-4">
                          <p className="font-semibold mb-3">Products</p>
                          {order.products.map((p, i) => (
                            <div key={i} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                              <span>{p.name} × {p.quantity}</span>
                              <span className="font-medium">₹{(p.price * p.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold mt-3 pt-3 border-t border-border">
                            <span>Total</span>
                            <span>₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
