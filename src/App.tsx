import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatBot from "@/components/ChatBot";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./pages/Index";
import About from "./pages/About";
import Packages from "./pages/Packages";
import Chefs from "./pages/Chefs";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ChefDetail from "./pages/ChefDetail";
import UserDashboard from "./pages/UserDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import Messages from "./pages/Messages";
import Academy from "./pages/Academy";
import Marketplace from "./pages/Marketplace";
import Shop from "./pages/Shop";
import KidsZone from "./pages/KidsZone";
import FindChefs from "./pages/FindChefs";
import ChefMedia from "./pages/ChefMedia";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import BookingFlow from "./pages/BookingFlow";
import MiniChefDashboard from "./pages/MiniChefDashboard";

const queryClient = new QueryClient();

    const App = () => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
              <Toaster />
              <Sonner />
              <ChatBot />
              <BrowserRouter>
                <CookieBanner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/chefs" element={<Chefs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/chef/:chefId" element={<ChefDetail />} />
                  <Route path="/user-dashboard" element={<UserDashboard />} />
                  <Route path="/chef-dashboard" element={<ChefDashboard />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/academy" element={<Academy />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/kids-zone" element={<KidsZone />} />
                  <Route path="/find-chefs" element={<FindChefs />} />
                  <Route path="/chef-media" element={<ChefMedia />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/booking" element={<BookingFlow />} />
                  <Route path="/minichef-dashboard" element={<MiniChefDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );

export default App;
