import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Scope from "./pages/Scope";
import Instructions from "./pages/Instructions";
import Test from "./pages/Test";
import Reviews from "./pages/Reviews";
import Results from "./pages/Results";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminCoupons from "./pages/AdminCoupons";
import Support from "./pages/Support";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import { SupportWidget } from "./components/SupportWidget";
import { AccessibilityMenu } from "./components/AccessibilityMenu";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SupportWidget />
        <AccessibilityMenu />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scope" element={<Scope />} />
          <Route path="/instrucoes" element={<Instructions />} />
          <Route path="/test" element={<Test />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/resultados-admin" element={<Results />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/admin-coupons" element={<AdminCoupons />} />
          <Route path="/suporte" element={<Support />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/conquistas" element={<Achievements />} />
          <Route path="/comparar" element={<Compare />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
