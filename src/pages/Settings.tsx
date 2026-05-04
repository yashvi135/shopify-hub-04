import { useState, useEffect } from 'react';
import { storeSettings as initial } from '@/data/mockData';
import { API_BASE_URL } from '@/api';
import { StoreSettings } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Store, Truck, Receipt, Bell, Shield, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings & { storeLogo?: string }>(initial);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setSettings(prev => ({
          ...prev,
          storeName: user.storeName !== undefined ? user.storeName : prev.storeName,
          storeLogo: user.storeLogo !== undefined ? user.storeLogo : prev.logo,
          contactEmail: user.email !== undefined ? user.email : prev.contactEmail,
          gstNumber: user.gstNumber !== undefined ? user.gstNumber : prev.gstNumber,
          contactPhone: user.contactNumber !== undefined ? user.contactNumber : prev.contactPhone,
          shippingCharges: user.shippingCharges !== undefined ? user.shippingCharges : prev.shippingCharges,
          codEnabled: user.paymentMethod !== undefined ? user.paymentMethod === 'COD' : prev.codEnabled,
        }));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const update = (key: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const save = () => {
    toast({ title: 'Settings saved', description: 'Your store settings have been updated successfully.' });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('storeLogo', file);
    formData.append('email', settings.contactEmail);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/logo`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setSettings(prev => ({ ...prev, storeLogo: data.storeLogo }));
        // Update local storage so it persists
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.storeLogo = data.storeLogo;
          localStorage.setItem('user', JSON.stringify(user));
        }
        toast({ title: 'Logo uploaded', description: 'Your store logo has been updated successfully.' });
      } else {
        toast({ title: 'Upload failed', description: data.message || 'Could not upload logo', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to connect to server', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store" className="gap-1.5"><Store className="w-4 h-4" /> Store Details</TabsTrigger>
          <TabsTrigger value="shipping" className="gap-1.5"><Truck className="w-4 h-4" /> Shipping</TabsTrigger>
          <TabsTrigger value="tax" className="gap-1.5"><Receipt className="w-4 h-4" /> GST & Tax</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
        </TabsList>

        {/* Store Details */}
        <TabsContent value="store">
          <div className="modern-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-1">Store Information</h3>
              <p className="text-sm text-muted-foreground">Basic details about your store</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Store Name <span className="text-destructive">*</span></Label>
                <Input value={settings.storeName} onChange={e => update('storeName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>GST Number</Label>
                <Input value={settings.gstNumber} onChange={e => update('gstNumber', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Email <span className="text-destructive">*</span></Label>
                <Input type="email" value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Phone <span className="text-destructive">*</span></Label>
                <Input value={settings.contactPhone} onChange={e => update('contactPhone', e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border">
                    {settings.storeLogo && settings.storeLogo.startsWith('http') ? (
                      <img src={settings.storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{settings.logo || '🏪'}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      id="logo-upload"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Upload Logo'}
                      </div>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">200×200px recommended</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button className="gradient-primary text-primary-foreground" onClick={save}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping">
          <div className="modern-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-1">Shipping & Delivery</h3>
              <p className="text-sm text-muted-foreground">Configure delivery options and charges</p>
            </div>

            {/* Standard Delivery */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-xs text-muted-foreground">5-7 business days</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Shipping Charges (₹)</Label>
                  <Input type="number" value={settings.shippingCharges} onChange={e => update('shippingCharges', Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Free Shipping Above (₹)</Label>
                  <Input type="number" value={settings.freeShippingAbove} onChange={e => update('freeShippingAbove', Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* COD */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-xs text-muted-foreground">Allow customers to pay on delivery</p>
                </div>
                <Switch checked={settings.codEnabled} onCheckedChange={v => update('codEnabled', v)} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button className="gradient-primary text-primary-foreground" onClick={save}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Tax */}
        <TabsContent value="tax">
          <div className="modern-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-1">GST & Tax Configuration</h3>
              <p className="text-sm text-muted-foreground">Manage tax settings for your products</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>GST Number</Label>
                <Input value={settings.gstNumber} onChange={e => update('gstNumber', e.target.value)} placeholder="e.g. 24AABCS1234F1Z5" />
              </div>
              <div className="space-y-1.5">
                <Label>Default GST Rate</Label>
                <Select value={String(settings.gstPercent)} onValueChange={v => update('gstPercent', Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Apply GST on Products</p>
                  <p className="text-xs text-muted-foreground">Enable GST calculation at checkout</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Prices Include GST</p>
                  <p className="text-xs text-muted-foreground">Display "Price inclusive of all taxes"</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Invoice Prefix</Label>
                <Input defaultValue="SG-INV-" placeholder="e.g. SG-INV-" />
              </div>
              <div className="space-y-1.5">
                <Label>Starting Invoice Number</Label>
                <Input type="number" defaultValue={1001} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button className="gradient-primary text-primary-foreground" onClick={save}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="modern-card p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-1">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">Configure email and SMS alerts</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Email Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: 'New Order Placed', desc: 'Notify admin on new orders', default: true },
                  { label: 'Order Confirmed', desc: 'Send confirmation to customer', default: true },
                  { label: 'Order Shipped', desc: 'Send shipping update to customer', default: true },
                  { label: 'Order Delivered', desc: 'Send delivery confirmation', default: true },
                  { label: 'Low Stock Alert', desc: 'Notify admin when stock is low', default: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">SMS Notifications</h4>
              <div className="space-y-3">
                {[
                  { label: 'Order Confirmation SMS', desc: 'Send to customer on order', default: true },
                  { label: 'Shipping Update SMS', desc: 'Send tracking info', default: false },
                  { label: 'Delivery SMS', desc: 'Confirm delivery via SMS', default: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button className="gradient-primary text-primary-foreground" onClick={save}>Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
