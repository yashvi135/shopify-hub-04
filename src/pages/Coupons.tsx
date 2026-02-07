import { useState } from 'react';
import { coupons as initialCoupons, products } from '@/data/mockData';
import { Coupon } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Plus, Tag, Percent, DollarSign, Calendar, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Coupons() {
  const [couponList, setCouponList] = useState<Coupon[]>(initialCoupons);

  const toggleCoupon = (id: string) => {
    setCouponList(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const getProductNames = (ids: string[]) => {
    return ids.map(id => products.find(p => p.id === id)?.name || id).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground">Manage discount coupons</p>
        </div>
        <Button className="gap-2 rounded-2xl gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </div>

      <div className="modern-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Discount</TableHead>
              <TableHead className="font-semibold">Apply On</TableHead>
              <TableHead className="font-semibold">Expiry</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-mono font-bold text-primary">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {coupon.discountType === 'percentage' ? <Percent className="w-4 h-4 text-muted-foreground" /> : <DollarSign className="w-4 h-4 text-muted-foreground" />}
                    <span className="font-semibold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">{coupon.discountType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Badge variant="outline" className="rounded-full text-xs capitalize">{coupon.applyOn === 'store' ? 'Entire Store' : 'Specific Products'}</Badge>
                    {coupon.applyOn === 'product' && coupon.productIds.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{getProductNames(coupon.productIds)}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {coupon.expiryDate}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch checked={coupon.isActive} onCheckedChange={() => toggleCoupon(coupon.id)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
