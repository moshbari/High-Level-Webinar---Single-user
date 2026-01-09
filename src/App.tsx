import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WebinarEditor from "./pages/WebinarEditor";
import WebinarCode from "./pages/WebinarCode";
import WebinarPreviewPage from "./pages/WebinarPreviewPage";
import ChatHistory from "./pages/ChatHistory";
import ChatDetail from "./pages/ChatDetail";
import ReportingDashboard from "./pages/ReportingDashboard";
import Live from "./pages/Live";
import ClipLibrary from "./pages/ClipLibrary";
import LiveChat from "./pages/LiveChat";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Laboratory from "./pages/Laboratory";
import Upgrade from "./pages/Upgrade";
import UpdatePassword from "./pages/UpdatePassword";
import AppSettings from "./pages/AppSettings";
import Branding from "./pages/Branding";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected user routes */}
          <Route path="/laboratory" element={<ProtectedRoute><Laboratory /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          
          {/* Admin-only routes */}
          <Route path="/app-settings" element={<ProtectedRoute requireAdmin><AppSettings /></ProtectedRoute>} />
          <Route path="/branding" element={<ProtectedRoute requireAdmin><Branding /></ProtectedRoute>} />
          
          {/* Existing app routes */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<ReportingDashboard />} />
          <Route path="/webinar/new" element={<WebinarEditor />} />
          <Route path="/webinar/:id/edit" element={<WebinarEditor />} />
          <Route path="/webinar/:id/code" element={<WebinarCode />} />
          <Route path="/webinar/:id/preview" element={<WebinarPreviewPage />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/chat-history/:webinarId/:sessionDate/:userEmail" element={<ChatDetail />} />
          <Route path="/live" element={<Live />} />
          <Route path="/live-chat" element={<LiveChat />} />
          <Route path="/clips" element={<ClipLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
