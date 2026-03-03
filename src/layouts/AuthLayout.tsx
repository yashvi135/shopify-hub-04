import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            {/* Left branding area */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-zinc-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mix-blend-overlay"></div>
                <div className="z-10 text-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
                        <span className="text-3xl font-bold">SG</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Surat Garment</h1>
                    <p className="text-lg text-zinc-300 max-w-md mx-auto">
                        Manage your store, track orders, and boost your sales with our comprehensive admin dashboard.
                    </p>
                </div>
            </div>

            {/* Right content area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
                <div className="absolute top-8 left-8 lg:hidden">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-primary-foreground">SG</span>
                    </div>
                </div>
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
