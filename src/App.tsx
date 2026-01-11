import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin pages
import Login from "./pages/admin/Login";
import AuthCallback from "./pages/admin/AuthCallback";
import ResetPassword from "./pages/admin/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsPage from "./pages/admin/ProjectsPage";
import BlogsPage from "./pages/admin/BlogsPage";
import ResumePage from "./pages/admin/ResumePage";
import ServicesPage from "./pages/admin/ServicesPage";
import CertificatesPage from "./pages/admin/CertificatesPage";
import TechStackPage from "./pages/admin/TechStackPage";
import MessagesPage from "./pages/admin/MessagesPage";
import SettingsPage from "./pages/admin/SettingsPage";

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
            <Route path="/" element={<Index />} />

            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/callback" element={<AuthCallback />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/admin/blogs" element={<ProtectedRoute><BlogsPage /></ProtectedRoute>} />
            <Route path="/admin/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/admin/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
            <Route path="/admin/tech-stack" element={<ProtectedRoute><TechStackPage /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
