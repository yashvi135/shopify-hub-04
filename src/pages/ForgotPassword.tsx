import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'OTP Sent!',
                    description: 'Please check your email for the 6-digit code.',
                    duration: 5000,
                });
                setStep(2);
            } else {
                toast({ title: 'Error', description: data.message || 'Email not found.', variant: 'destructive' });
            }
        } catch (err) {
            console.error("Forgot password error", err);
            toast({
                title: 'Backend Unreachable',
                description: 'For development simulation, OTP bypassed. Proceed to Step 2.',
            });
            setStep(2); // Simulated bypass
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast({ title: 'Passwords do not match', variant: 'destructive' });
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/resetpassword', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Success!',
                    description: 'Your password has been reset successfully. Please login.',
                });
                navigate('/login');
            } else {
                toast({ title: 'Error', description: data.message || 'Invalid or expired OTP', variant: 'destructive' });
            }
        } catch (err) {
            console.error("Reset password error", err);
            toast({
                title: 'Simulated Setup',
                description: 'Password reset skipped for local simulation mode.',
            });
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
            <div className="modern-card p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl gradient-primary mx-auto flex items-center justify-center mb-4">
                        <KeyRound className="text-primary-foreground w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {step === 1 ? "Enter your email to receive an OTP code" : "Enter the OTP and your new password"}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4 shadow-sm pb-1">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@suratgarment.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground mt-2"
                            disabled={loading || !email}
                        >
                            {loading ? 'Sending Request...' : 'Send OTP'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4 shadow-sm pb-1">
                        <div className="space-y-2">
                            <Label htmlFor="otp">6-Digit OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="text-center tracking-widest text-lg font-bold"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-9"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-9"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground mt-2"
                            disabled={loading || !otp || !newPassword || !confirmPassword}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Securely'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="w-full mt-2 text-muted-foreground hover:text-foreground"
                            disabled={loading}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Email
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Remember your password? </span>
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Log In Here
                    </Link>
                </div>
            </div>
        </div>
    );
}
