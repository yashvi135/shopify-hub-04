import { useState } from 'react';
import { orders } from '@/data/mockData';
import { OrderStatus } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Download, Eye, Heart, Scissors, Truck, Sparkles } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';

type TimeFilter = 'today' | 'week' | 'month' | 'all';
type StatusFilter = 'all' | OrderStatus;

const statusConfig = {
  received: { 
    label: 'Order Received 💝', 
    icon: Heart,
    style: 'bg-secondary text-foreground border-border',
    shortLabel: 'Received'
  },
  curating: { 
    label: 'Curating Fabric 🧵', 
    icon: Scissors,
    style: 'bg-warning/10 text-warning border-warning/30',
    shortLabel: 'Curating'
  },
  dispatched: { 
    label: 'Dispatched 🚚', 
    icon: Truck,
    style: 'bg-primary/10 text-primary border-primary/30',
    shortLabel: 'Dispatched'
  },
  delivered: { 
    label: 'Delivered with Love ✨', 
    icon: Sparkles,
    style: 'bg-success/10 text-success border-success/30',
    shortLabel: 'Delivered'
  },
};

export function OrdersTable() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { role, currentStoreId } = useRole();

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (role === 'STORE_OWNER' && order.storeId !== currentStoreId) return false;
    return true;
  });

  const relevantOrders = role === 'STORE_OWNER' 
    ? orders.filter(o => o.storeId === currentStoreId)
    : orders;

  const getStatusCounts = () => {
    return {
      all: relevantOrders.length,
      received: relevantOrders.filter(o => o.status === 'received').length,
      curating: relevantOrders.filter(o => o.status === 'curating').length,
      dispatched: relevantOrders.filter(o => o.status === 'dispatched').length,
      delivered: relevantOrders.filter(o => o.status === 'delivered').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'received', 'curating', 'dispatched', 'delivered'] as StatusFilter[]).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="gap-2 rounded-2xl"
          >
            <span>{status === 'all' ? 'All Orders' : statusConfig[status].shortLabel}</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-2 rounded-full",
                statusFilter === status ? "bg-primary-foreground/20 text-primary-foreground" : ""
              )}
            >
              {statusCounts[status]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-[150px] rounded-2xl">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2 rounded-2xl">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Orders Table */}
      <div className="modern-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              {role === 'SUPER_ADMIN' && <TableHead className="font-semibold">Store</TableHead>}
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <TableRow key={order.id} className="group">
                  <TableCell className="font-mono font-medium text-primary">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-foreground">
                          {order.customerName.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                  </TableCell>
                  {role === 'SUPER_ADMIN' && (
                    <TableCell className="text-muted-foreground">{order.storeName}</TableCell>
                  )}
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="text-muted-foreground">{order.items}</TableCell>
                  <TableCell className="font-semibold">₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-full", status.style)}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
