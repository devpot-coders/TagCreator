
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import List from "./pages/List";
import StoreTags from "./pages/StoreTags";
import Login from "./components/Auth/Login";
import Print from "./pages/Print";
import EditorCanvas from "./pages/EditorCanvas";
import ProtectedRoute from "./utils/common/ProtectedRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route path="/editorCanvas" element={<ProtectedRoute><EditorCanvas /></ProtectedRoute>} />
            <Route index path="/" element={<ProtectedRoute><List /></ProtectedRoute>} />
            <Route path="/storetags" element={<ProtectedRoute><StoreTags /></ProtectedRoute>} />
            <Route path="/print" element={<ProtectedRoute><Print /></ProtectedRoute>} />

          </Route>
            <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
