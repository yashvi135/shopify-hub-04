import { useState } from 'react';
import { banners as initialBanners } from '@/data/mockData';
import { Banner } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Plus, ArrowUp, ArrowDown, Edit, Trash2, Image, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Banners() {
  const [bannerList, setBannerList] = useState<Banner[]>([...initialBanners].sort((a, b) => a.order - b.order));
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({ title: '', subtitle: '', redirectTo: 'category' as 'product' | 'category', redirectId: '' });

  const toggleBanner = (id: string) => {
    setBannerList(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const deleteBanner = (id: string) => {
    setBannerList(prev => prev.filter(b => b.id !== id));
    toast({ title: 'Banner deleted' });
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

  const handleAdd = () => {
    const newBanner: Banner = {
      id: Date.now().toString(),
      image: '🖼️',
      title: form.title,
      subtitle: form.subtitle,
      redirectTo: form.redirectTo,
      redirectId: form.redirectId,
      isActive: true,
      order: bannerList.length + 1,
    };
    setBannerList(prev => [...prev, newBanner].sort((a, b) => a.order - b.order));
    setAddOpen(false);
    setForm({ title: '', subtitle: '', redirectTo: 'category', redirectId: '' });
    toast({ title: 'Banner added' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banner Management</h1>
          <p className="text-sm text-muted-foreground">Manage homepage banners for your mobile app</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Add Banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Banner</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Banner Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Image className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drop image here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1920×600px, Max 5MB</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Banner Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Summer Sale" />
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="e.g. Up to 50% off" />
              </div>
              <div className="space-y-1.5">
                <Label>Redirect To</Label>
                <Select value={form.redirectTo} onValueChange={(v: any) => setForm({...form, redirectTo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category Page</SelectItem>
                    <SelectItem value="product">Product Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={handleAdd} disabled={!form.title}>Upload & Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {bannerList.map((banner, index) => (
          <div key={banner.id} className={cn("modern-card p-4 flex items-center gap-4 animate-fade-in", !banner.isActive && "opacity-50")}>
            <div className="flex flex-col gap-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveBanner(banner.id, 'up')} disabled={index === 0}>
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveBanner(banner.id, 'down')} disabled={index === bannerList.length - 1}>
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-32 h-20 rounded-lg bg-secondary flex items-center justify-center text-4xl shrink-0">
              {banner.image}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{banner.title}</h3>
              <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-xs capitalize">→ {banner.redirectTo}</Badge>
                <Badge variant="secondary" className="text-xs">Position #{banner.order}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={banner.isActive} onCheckedChange={() => toggleBanner(banner.id)} />
              <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteBanner(banner.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
