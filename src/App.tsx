
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/SellerDashboard";
import BuilderDashboard from "./pages/BuilderDashboard";
import BuilderTools from "./pages/builder/BuilderTools";
import BuilderAnalytics from "./pages/builder/BuilderAnalytics";
import BuilderClients from "./pages/builder/BuilderClients";
import BuilderSettings from "./pages/builder/BuilderSettings";
import Builds from "./pages/Builds";
import Guides from "./pages/Guides";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect } from "react";
import { initializeMobileApp, optimizeForMobile } from "./utils/mobileUtils";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/" />;

  return <>{children}</>;
};

const AppContent = () => {
  useEffect(() => {
    document.title = "Revamp AI PC Builder";
    
    // Initialize mobile app features
    const initApp = async () => {
      optimizeForMobile();
      await initializeMobileApp();
    };
    
    initApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<Index />} />
            <Route path="/builds" element={<Builds />} />
            <Route path="/guides" element={<Guides />} />
            
            <Route path="/seller" element={
              <ProtectedRoute allowedRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/builder" element={
              <ProtectedRoute allowedRole="builder">
                <BuilderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/builder/tools" element={
              <ProtectedRoute allowedRole="builder">
                <BuilderTools />
              </ProtectedRoute>
            } />
            <Route path="/builder/analytics" element={
              <ProtectedRoute allowedRole="builder">
                <BuilderAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/builder/clients" element={
              <ProtectedRoute allowedRole="builder">
                <BuilderClients />
              </ProtectedRoute>
            } />
            <Route path="/builder/settings" element={
              <ProtectedRoute allowedRole="builder">
                <BuilderSettings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
