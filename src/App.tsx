import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ServiceSync Components
import { ServiceSyncProvider } from "@/contexts/ServiceSyncContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ServiceSyncApp } from "@/components/ServiceSyncApp";

// Original Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// ServiceSync Pages
import { HostessLogin } from "./pages/HostessLogin";
import { KitchenScan } from "./pages/KitchenScan";
import { WardArrival } from "./pages/WardArrival";
import { DietSheet } from "./pages/DietSheet";
import { ServiceComplete } from "./pages/ServiceComplete";
import { Dashboard } from "./pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ServiceSyncProvider>
            <Routes>
              {/* Original Routes */}
              <Route path="/" element={<Index />} />
              
              {/* ServiceSync Application Routes */}
              <Route path="/servicesync" element={<ServiceSyncApp />} />
              <Route path="/servicesync/login" element={<HostessLogin />} />
              <Route path="/servicesync/kitchen-scan" element={<KitchenScan />} />
              <Route path="/servicesync/ward-arrival" element={<WardArrival />} />
              <Route path="/servicesync/diet-sheet" element={<DietSheet />} />
              <Route path="/servicesync/completion" element={<ServiceComplete />} />
              <Route path="/servicesync/dashboard" element={<Dashboard />} />
              
              {/* Catch-all route - KEEP THIS LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ServiceSyncProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;