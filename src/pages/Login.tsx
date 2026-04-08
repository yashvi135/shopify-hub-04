import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.message === 'Email does not exist') {
                    toast.info("Account not found. Let's create one!");
                    navigate('/signup', { state: { email, password } });
                } else {
                    toast.error(data.message || 'Login failed');
                }
            } else {
                toast.success("Welcome back!");
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('storeId', data.user.storeId);
                navigate('/'); // Go to dashboard
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error('Unable to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-muted-foreground mt-2">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@suratgarment.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>
        </div>
    );
}
