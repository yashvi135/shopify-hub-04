import { useState } from 'react';
import { coupons as initialCoupons, products, categories } from '@/data/mockData';
import { Coupon } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Plus, Tag, Percent, IndianRupee, Calendar, Trash2, Edit, Copy, Ticket } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Coupons() {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    code: '', discountType: 'percentage' as 'flat' | 'percentage', discountValue: 0,
    applyOn: 'store' as 'store' | 'product', expiryDate: '', minOrder: 0, maxDiscount: 0,
    usageLimit: 0,
  });

  const toggleCoupon = (id: string) => {
    setCouponList(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (id: string) => {
    setCouponList(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Coupon deleted' });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: `${code} copied to clipboard.` });
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setForm(prev => ({ ...prev, code }));
  };

  const handleCreate = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: form.discountValue,
      applyOn: form.applyOn,
      productIds: [],
      expiryDate: form.expiryDate,
      isActive: true,
    };
    setCouponList(prev => [newCoupon, ...prev]);
    setCreateOpen(false);
    setForm({ code: '', discountType: 'percentage', discountValue: 0, applyOn: 'store', expiryDate: '', minOrder: 0, maxDiscount: 0, usageLimit: 0 });
    toast({ title: 'Coupon created', description: `${newCoupon.code} is now active.` });
  };

  const filtered = couponList.filter(c => {
    if (filter === 'active') return c.isActive;
    if (filter === 'inactive') return !c.isActive;
    return true;
  });

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupons & Discounts</h1>
          <p className="text-sm text-muted-foreground">Manage promotional coupons</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Create Coupon</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Coupon</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Coupon Code <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                  <Input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. WELCOME50" className="font-mono uppercase" />
                  <Button variant="outline" size="sm" onClick={generateCode}>Generate</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Discount Type</Label>
                  <Select value={form.discountType} onValueChange={(v: any) => setForm({...form, discountType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Discount Value <span className="text-destructive">*</span></Label>
                  <Input type="number" value={form.discountValue || ''} onChange={e => setForm({...form, discountValue: Number(e.target.value)})} placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Apply On</Label>
                <Select value={form.applyOn} onValueChange={(v: any) => setForm({...form, applyOn: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store">Entire Store</SelectItem>
                    <SelectItem value="product">Specific Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={handleCreate} disabled={!form.code || !form.discountValue || !form.expiryDate}>Save Coupon</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {(['all', 'active', 'inactive'] as const).map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(coupon => {
          const expired = isExpired(coupon.expiryDate);
          return (
            <div key={coupon.id} className={cn("modern-card p-5 border-2 border-dashed animate-fade-in relative", expired && "opacity-50", !coupon.isActive && "opacity-60")}>
              {expired && <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full text-xs">EXPIRED</Badge>}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-lg text-primary">{coupon.code}</p>
                    <Badge variant="secondary" className="text-xs rounded-full capitalize">{coupon.applyOn === 'store' ? 'Entire Store' : 'Specific Products'}</Badge>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <span className={cn("text-2xl font-bold", coupon.discountType === 'percentage' ? 'text-success' : 'text-info')}>
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <Calendar className="w-3.5 h-3.5" />
                Valid until {coupon.expiryDate}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={coupon.isActive} onCheckedChange={() => toggleCoupon(coupon.id)} />
                  <span className="text-xs text-muted-foreground">{coupon.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyCode(coupon.code)}><Copy className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCoupon(coupon.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
