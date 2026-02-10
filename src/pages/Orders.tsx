import { useState } from 'react';
import { orders as initialOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Download, Eye, Package, Truck, CheckCircle, Clock, Search, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<OrderStatus, { label: string; style: string; icon: any }> = {
  received: { label: 'Pending', icon: Clock, style: 'bg-warning/10 text-warning' },
  packed: { label: 'Packed', icon: Package, style: 'bg-info/10 text-info' },
  dispatched: { label: 'Shipped', icon: Truck, style: 'bg-primary/10 text-primary' },
  delivered: { label: 'Delivered', icon: CheckCircle, style: 'bg-success/10 text-success' },
};

const statusSteps: OrderStatus[] = ['received', 'packed', 'dispatched', 'delivered'];

export default function Orders() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredOrders = orderList.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast({ title: 'Status updated', description: `Order status changed to ${statusConfig[newStatus].label}` });
  };

  const statusCounts = {
    all: orderList.length,
    received: orderList.filter(o => o.status === 'received').length,
    packed: orderList.filter(o => o.status === 'packed').length,
    dispatched: orderList.filter(o => o.status === 'dispatched').length,
    delivered: orderList.filter(o => o.status === 'delivered').length,
  };

  const exportCSV = () => {
    const headers = 'Order ID,Customer,Date,Amount,Payment Method,Payment Status,Order Status\n';
    const rows = filteredOrders.map(o => `${o.id},${o.customerName},${o.date},${o.totalAmount},${o.paymentMethod},${o.paymentStatus},${o.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    toast({ title: 'Exported', description: 'Orders exported to CSV.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-sm text-muted-foreground">{orderList.length} Total Orders</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'received', 'packed', 'dispatched', 'delivered'] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className="gap-1.5"
          >
            <span>{s === 'all' ? 'All Orders' : statusConfig[s].label}</span>
            <Badge variant="secondary" className={cn("text-xs px-1.5 rounded-full", statusFilter === s ? "bg-primary-foreground/20 text-primary-foreground" : "")}>
              {statusCounts[s]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by Order ID, Customer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-0" />
      </div>

      {/* Orders Table */}
      <div className="modern-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-secondary/30">
                <TableCell className="font-mono font-medium text-primary text-sm">{order.id}</TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{order.customerName}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-sm">{order.products.length} items</TableCell>
                <TableCell className="font-semibold text-sm">₹{order.totalAmount.toLocaleString()}</TableCell>
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
                    <SelectTrigger className={cn("w-[130px] text-xs h-8 rounded-full", statusConfig[order.status].style)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusSteps.map(s => <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          Order {order.id}
                          <Badge className={cn("rounded-full", statusConfig[order.status].style)}>{statusConfig[order.status].label}</Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        {/* Status Timeline */}
                        <div className="flex items-center justify-between px-4">
                          {statusSteps.map((step, i) => {
                            const stepIdx = statusSteps.indexOf(order.status);
                            const isCompleted = i <= stepIdx;
                            const isCurrent = i === stepIdx;
                            const StepIcon = statusConfig[step].icon;
                            return (
                              <div key={step} className="flex flex-col items-center gap-1 relative flex-1">
                                {i > 0 && <div className={cn("absolute top-4 -left-1/2 w-full h-0.5", i <= stepIdx ? "bg-primary" : "bg-border")} />}
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2",
                                  isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground",
                                  isCurrent && "ring-4 ring-primary/20"
                                )}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={cn("text-xs font-medium", isCompleted ? "text-primary" : "text-muted-foreground")}>{statusConfig[step].label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="modern-card p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Customer</p>
                            <p className="font-medium text-sm">{order.customerName}</p>
                          </div>
                          <div className="modern-card p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Payment</p>
                            <p className="font-medium text-sm">{order.paymentMethod} • <span className={order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}>{order.paymentStatus}</span></p>
                          </div>
                          <div className="modern-card p-4 col-span-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Delivery Address</p>
                            <p className="font-medium text-sm">{order.address}</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Order Items</h4>
                          <div className="border rounded-lg overflow-hidden">
                            {order.products.map((p, i) => (
                              <div key={i} className="flex justify-between items-center px-4 py-3 border-b last:border-0 text-sm">
                                <div>
                                  <span className="font-medium">{p.name}</span>
                                  <span className="text-muted-foreground ml-2">× {p.quantity}</span>
                                </div>
                                <span className="font-semibold">₹{(p.price * p.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center px-4 py-3 bg-secondary/50 font-bold text-sm">
                              <span>Total Amount</span>
                              <span>₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="gap-1"><Printer className="w-4 h-4" /> Print Invoice</Button>
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
