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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/webinar/new" element={<WebinarEditor />} />
          <Route path="/webinar/:id/edit" element={<WebinarEditor />} />
          <Route path="/webinar/:id/code" element={<WebinarCode />} />
          <Route path="/webinar/:id/preview" element={<WebinarPreviewPage />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/chat-history/:webinarId/:sessionDate/:userEmail" element={<ChatDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
