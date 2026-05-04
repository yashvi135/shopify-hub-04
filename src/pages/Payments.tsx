import { paymentOverview, orders } from '@/data/mockData';
import { IndianRupee, Truck, CreditCard, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const paymentMethodData = [
  { name: 'COD', value: 2150000, color: 'hsl(43, 96%, 56%)' },
  { name: 'UPI', value: 2800000, color: 'hsl(271, 81%, 56%)' },
  { name: 'Cards', value: 1560000, color: 'hsl(217, 91%, 60%)' },
  { name: 'Net Banking', value: 1200000, color: 'hsl(239, 84%, 67%)' },
];

export default function Payments() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { toast } = useToast();

  const filteredOrders = orders.filter(o => {
    if (dateFrom && o.date < dateFrom) return false;
    if (dateTo && o.date > dateTo) return false;
    return true;
  });

  const stats = [
    { label: 'Total Revenue', value: `₹${(paymentOverview.totalSales / 100000).toFixed(1)}L`, subtitle: 'This month', icon: IndianRupee, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'COD Payments', value: `₹${(paymentOverview.codAmount / 100000).toFixed(1)}L`, subtitle: '42% of total', icon: Truck, iconBg: 'bg-warning/10', iconColor: 'text-warning' },
    { label: 'Online Payments', value: `₹${(paymentOverview.onlineAmount / 100000).toFixed(1)}L`, subtitle: '58% of total', icon: CreditCard, iconBg: 'bg-success/10', iconColor: 'text-success' },
    { label: 'Pending', value: `₹${(paymentOverview.pendingPayments / 100000).toFixed(1)}L`, subtitle: 'To be collected', icon: Clock, iconBg: 'bg-destructive/10', iconColor: 'text-destructive' },
  ];

  const exportCSV = () => {
    const headers = 'Order ID,Customer,Date,Method,Status,Amount\n';
    const rows = filteredOrders.map(o => `${o.id},${o.customerName},${o.date},${o.paymentMethod},${o.paymentStatus},${o.totalAmount}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-report.csv';
    a.click();
    toast({ title: 'Downloaded', description: 'Sales report exported.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments & Analytics</h1>
          <p className="text-sm text-muted-foreground">Payment overview and sales reports</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="modern-card p-5 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.iconBg)}>
                <s.icon className={cn("w-5 h-5", s.iconColor)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="modern-card p-6">
          <h3 className="font-semibold mb-4">Payment Method Breakdown</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                  {paymentMethodData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
                <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Date Filter */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From:</span>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto h-9" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">To:</span>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto h-9" />
            </div>
            {(dateFrom || dateTo) && <Button variant="ghost" size="sm" onClick={() => { setDateFrom(''); setDateTo(''); }}>Clear</Button>}
          </div>

          {/* Sales Table */}
          <div className="modern-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
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
                    <TableCell className="font-mono text-primary text-sm font-medium">{order.id}</TableCell>
                    <TableCell className="text-sm">{order.customerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                    <TableCell><Badge variant="outline" className="rounded-full text-xs">{order.paymentMethod}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("rounded-full text-xs", order.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">₹{order.totalAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
