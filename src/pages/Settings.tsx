import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Globe, Lock, Palette, User } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="admin@storehub.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input defaultValue="Super Admin" disabled />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'New Order Alerts', description: 'Get notified when a new order is placed' },
            { label: 'Low Stock Warnings', description: 'Alert when products are running low' },
            { label: 'Daily Summary', description: 'Receive a daily report of store activity' },
            { label: 'Marketing Updates', description: 'Get updates about new features' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-card-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={index < 2} />
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Manage your password and security</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div></div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button>Update Password</Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
