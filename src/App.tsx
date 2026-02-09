import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import SignupPlan from "./pages/SignupPlan";
import NotFound from "./pages/NotFound";
import SignupRegister from "./pages/SignupRegister";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Companies from "./pages/admin/Companies";
import Audit from "./pages/admin/Audit";
import Employees from "./pages/admin/Employees";
import Payments from "./pages/admin/Payments";
import DRE from "./pages/admin/DRE";
import AdminSettings from "./pages/admin/Settings";

// Tenant Pages
import TenantLayout from "./layouts/TenantLayout";
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantClients from "./pages/tenant/Clients";
import ComingSoon from "./components/shared/ComingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/plan" element={<SignupPlan />} />
            <Route path="/signup/register" element={<SignupRegister />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="companies" element={<Companies />} />
              <Route path="audit" element={<Audit />} />
              <Route path="employees" element={<Employees />} />
              <Route path="payments" element={<Payments />} />
              <Route path="dre" element={<DRE />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Tenant CRM Routes */}
            <Route path="/crm" element={<TenantLayout />}>
              <Route index element={<TenantDashboard />} />
              <Route path="clients" element={<TenantClients />} />
              <Route path="companies" element={<ComingSoon title="Empresas" />} />
              <Route path="tasks" element={<ComingSoon title="Tarefas" />} />
              <Route path="messages" element={<ComingSoon title="Mensagens" />} />
              <Route path="settings" element={<ComingSoon title="Configurações" />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
