import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PipelineTryon from "./pages/PipelineTryon";
import PipelineHimyt from "./pages/PipelineHimyt";
import AddLead from "./pages/AddLead";
import LeadDetails from "./pages/LeadDetails";
import Activities from "./pages/Activities";
import Today from "./pages/Today";
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
          <Route path="/pipeline/tryon" element={<PipelineTryon />} />
          <Route path="/pipeline/himyt" element={<PipelineHimyt />} />
          <Route path="/add-lead" element={<AddLead />} />
          <Route path="/lead/:id" element={<LeadDetails />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/today" element={<Today />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
