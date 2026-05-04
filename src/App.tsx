import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// ─── Lazy-load every page — each becomes its own JS chunk ───────
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Products      = lazy(() => import('./pages/Products'));
const Orders        = lazy(() => import('./pages/Orders'));
const Coupons       = lazy(() => import('./pages/Coupons'));
const Banners       = lazy(() => import('./pages/Banners'));
const Payments      = lazy(() => import('./pages/Payments'));
const Settings      = lazy(() => import('./pages/Settings'));
const NotFound      = lazy(() => import('./pages/NotFound'));
const Login         = lazy(() => import('./pages/Login'));
const Signup        = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const HomeBuilder   = lazy(() => import('./pages/HomeBuilder'));

// Simple full-screen loader shown while a chunk is being fetched
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/home-builder" element={<HomeBuilder />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
