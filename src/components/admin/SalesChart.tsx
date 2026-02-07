import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { monthlyChartData } from '@/data/mockData';

export function SalesChart() {
  return (
    <div className="modern-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-1">Sales Overview</h3>
      <p className="text-sm text-muted-foreground mb-6">Monthly revenue performance</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyChartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 80%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(262, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 90%)" />
            <XAxis dataKey="name" stroke="hsl(240, 4%, 46%)" fontSize={12} />
            <YAxis stroke="hsl(240, 4%, 46%)" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              contentStyle={{ borderRadius: '12px', border: '1px solid hsl(240, 6%, 90%)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(262, 80%, 55%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
