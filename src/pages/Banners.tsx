import { useState } from 'react';
import { banners as initialBanners } from '@/data/mockData';
import { Banner } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Plus, GripVertical, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function Banners() {
  const [bannerList, setBannerList] = useState<Banner[]>([...initialBanners].sort((a, b) => a.order - b.order));

  const toggleBanner = (id: string) => {
    setBannerList(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const moveBanner = (id: string, direction: 'up' | 'down') => {
    setBannerList(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(b => b.id === id);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sorted.length - 1)) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      const temp = sorted[idx].order;
      sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
      sorted[swapIdx] = { ...sorted[swapIdx], order: temp };
      return sorted.sort((a, b) => a.order - b.order);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Banners</h1>
          <p className="text-muted-foreground">Manage homepage banners for your mobile app</p>
        </div>
        <Button className="gap-2 rounded-2xl gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
      </div>

      <div className="space-y-4">
        {bannerList.map((banner, index) => (
          <div key={banner.id} className={cn("modern-card p-5 flex items-center gap-5 animate-fade-in", !banner.isActive && "opacity-60")}>
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => moveBanner(banner.id, 'up')} disabled={index === 0}>
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => moveBanner(banner.id, 'down')} disabled={index === bannerList.length - 1}>
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shrink-0">
              {banner.image}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{banner.title}</h3>
              <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="rounded-full text-xs capitalize">→ {banner.redirectTo}</Badge>
                <Badge variant="secondary" className="rounded-full text-xs">Order #{banner.order}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={banner.isActive} onCheckedChange={() => toggleBanner(banner.id)} />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
