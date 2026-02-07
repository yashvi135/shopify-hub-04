import { paymentOverview, orders } from '@/data/mockData';
import { DollarSign, Truck, CreditCard, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Payments() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredOrders = orders.filter(o => {
    if (dateFrom && o.date < dateFrom) return false;
    if (dateTo && o.date > dateTo) return false;
    return true;
  });

  const stats = [
    { label: 'Total Sales', value: `₹${(paymentOverview.totalSales / 100000).toFixed(1)}L`, icon: DollarSign, color: 'bg-primary/10 text-primary' },
    { label: 'COD Amount', value: `₹${(paymentOverview.codAmount / 100000).toFixed(1)}L`, icon: Truck, color: 'bg-warning/10 text-warning' },
    { label: 'Online Paid', value: `₹${(paymentOverview.onlineAmount / 100000).toFixed(1)}L`, icon: CreditCard, color: 'bg-success/10 text-success' },
    { label: 'Pending', value: `₹${(paymentOverview.pendingPayments / 100000).toFixed(1)}L`, icon: Clock, color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Payment overview and sales reports</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-2xl">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="modern-card p-6 animate-fade-in">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", s.color)}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">From:</span>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="rounded-2xl w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">To:</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="rounded-2xl w-auto" />
        </div>
        {(dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Clear</Button>
        )}
      </div>

      {/* Sales Table */}
      <div className="modern-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Method</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-primary font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell><Badge variant="outline" className="rounded-full">{order.paymentMethod}</Badge></TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("rounded-full", order.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">₹{order.totalAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
