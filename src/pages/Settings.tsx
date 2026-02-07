import { useState } from 'react';
import { storeSettings as initial } from '@/data/mockData';
import { StoreSettings } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Store, Truck, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings>(initial);
  const { toast } = useToast();

  const update = (key: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const save = () => {
    toast({ title: 'Settings saved', description: 'Your store settings have been updated.' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      {/* Store Details */}
      <div className="modern-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Store Details</h3>
            <p className="text-sm text-muted-foreground">Basic store information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input value={settings.storeName} onChange={e => update('storeName', e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>GST Number</Label>
            <Input value={settings.gstNumber} onChange={e => update('gstNumber', e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input value={settings.contactPhone} onChange={e => update('contactPhone', e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">{settings.logo}</div>
              <Button variant="outline" className="rounded-xl">Upload Logo</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="modern-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Shipping Settings</h3>
            <p className="text-sm text-muted-foreground">Configure delivery options</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Shipping Charges (₹)</Label>
            <Input type="number" value={settings.shippingCharges} onChange={e => update('shippingCharges', Number(e.target.value))} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Free Shipping Above (₹)</Label>
            <Input type="number" value={settings.freeShippingAbove} onChange={e => update('freeShippingAbove', Number(e.target.value))} className="rounded-xl" />
          </div>
          <div className="flex items-center justify-between md:col-span-2 py-2">
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground">Allow COD payment method</p>
            </div>
            <Switch checked={settings.codEnabled} onCheckedChange={v => update('codEnabled', v)} />
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="modern-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Tax Settings</h3>
            <p className="text-sm text-muted-foreground">GST configuration</p>
          </div>
        </div>
        <div className="max-w-xs space-y-2">
          <Label>GST Percentage (%)</Label>
          <Input type="number" value={settings.gstPercent} onChange={e => update('gstPercent', Number(e.target.value))} className="rounded-xl" />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="rounded-xl">Cancel</Button>
        <Button className="rounded-xl gradient-primary text-primary-foreground" onClick={save}>Save Settings</Button>
      </div>
    </div>
  );
}
