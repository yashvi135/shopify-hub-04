import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="luxury-card p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold text-card-foreground mt-2">{value}</p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 mt-3 text-sm font-medium",
              trend === 'up' ? "text-success" : "text-destructive"
            )}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground font-normal">vs last period</span>
            </div>
          )}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gold-light flex items-center justify-center">
          <Icon className="w-7 h-7 text-gold" />
        </div>
      </div>
    </div>
  );
}
