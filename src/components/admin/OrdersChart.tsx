import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dailyChartData, weeklyChartData, monthlyChartData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function OrdersChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const getChartData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyChartData;
      case 'weekly':
        return weeklyChartData;
      case 'monthly':
        return monthlyChartData;
    }
  };

  return (
    <Card className="modern-card animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-semibold">Order Analytics</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Track your orders and revenue</p>
          </div>
          <div className="flex gap-1 bg-secondary rounded-2xl p-1">
            {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                  timeRange === range 
                    ? "bg-card text-card-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-card-foreground"
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-card)'
                }}
                labelStyle={{ color: 'hsl(var(--card-foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fill="url(#ordersGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Orders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
