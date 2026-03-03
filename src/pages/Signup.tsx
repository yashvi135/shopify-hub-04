import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function Signup() {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        storeName: '',
        gstNumber: '',
        contactNumber: '',
        shippingCharges: '',
        shippingDays: '',
        paymentMethod: 'COD'
    });

    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    useEffect(() => {
        if (location.state) {
            setFormData(prev => ({
                ...prev,
                email: location.state.email || '',
                password: location.state.password || ''
            }));
        }
    }, [location.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });
            if (logoFile) {
                submitData.append('storeLogo', logoFile);
            }

            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: submitData
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Signup failed');
            } else {
                toast.success("Account created successfully!");
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/'); // Go to dashboard
            }
        } catch (err) {
            console.warn("Backend not active, simulating for dev purposes.");
            const simulatedUser = { email: formData.email, storeName: formData.storeName, gstNumber: formData.gstNumber, contactNumber: formData.contactNumber, shippingCharges: formData.shippingCharges, paymentMethod: formData.paymentMethod };
            localStorage.setItem('token', 'simulated-token-123');
            localStorage.setItem('user', JSON.stringify(simulatedUser));
            toast.success('Simulated store creation successful.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                <p className="text-muted-foreground mt-2">Finish setting up your Surat Garment store profile.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email" name="email" type="email"
                            value={formData.email} onChange={handleChange} required
                            readOnly={!!location.state?.email}
                            className={location.state?.email ? "bg-muted" : ""}
                        />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password" name="password" type="password"
                            value={formData.password} onChange={handleChange} required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                        id="storeName" name="storeName"
                        value={formData.storeName} onChange={handleChange} required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                            id="contactNumber" name="contactNumber"
                            value={formData.contactNumber} onChange={handleChange} required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                        <Input
                            id="gstNumber" name="gstNumber"
                            value={formData.gstNumber} onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="shippingCharges">Shipping Charges (₹)</Label>
                        <Input
                            id="shippingCharges" name="shippingCharges" type="number"
                            value={formData.shippingCharges} onChange={handleChange} required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shippingDays">Shipping Days</Label>
                        <Input
                            id="shippingDays" name="shippingDays" type="number"
                            value={formData.shippingDays} onChange={handleChange} required
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="flex items-center space-x-2 border rounded-md p-3 w-full cursor-pointer hover:bg-muted focus-within:ring-2 ring-primary">
                            <RadioGroupItem value="COD" id="cod" />
                            <Label htmlFor="cod" className="cursor-pointer flex-1 mb-0 py-1">Cash on Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3 w-full cursor-pointer hover:bg-muted focus-within:ring-2 ring-primary">
                            <RadioGroupItem value="Gateway" id="gateway" />
                            <Label htmlFor="gateway" className="cursor-pointer flex-1 mb-0 py-1">Online Gateway</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="storeLogo">Store Logo (Optional)</Label>
                    <Input id="storeLogo" name="storeLogo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="cursor-pointer file:cursor-pointer" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">Max size: 2MB.</p>
                </div>

                <div className="pt-4 pb-2">
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Creating store...' : 'Complete Setup'}
                    </Button>
                </div>
            </form>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground)/0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground)/0.5);
        }
      `}</style>
        </div>
    );
}
