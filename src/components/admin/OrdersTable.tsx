import { useState } from 'react';
import { orders } from '@/data/mockData';
import { Order } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Filter, Download, Eye } from 'lucide-react';
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

type TimeFilter = 'today' | 'week' | 'month' | 'all';
type StatusFilter = 'all' | 'pending' | 'processing' | 'delivered' | 'cancelled';

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  processing: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function OrdersTable() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    // Time filtering would be implemented with actual dates
    return true;
  });

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'pending', 'processing', 'delivered', 'cancelled'] as StatusFilter[]).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="gap-2"
          >
            <span className="capitalize">{status}</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs px-1.5",
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
            <SelectTrigger className="w-[150px]">
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
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="group">
                <TableCell className="font-mono font-medium text-primary">
                  {order.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {order.customerName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.storeName}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell className="text-muted-foreground">{order.items}</TableCell>
                <TableCell className="font-semibold">₹{order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusStyles[order.status])}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
