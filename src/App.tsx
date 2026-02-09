import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatBot from "@/components/ChatBot";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./views/Index";
import About from "./views/About";
import Packages from "./views/Packages";
import Chefs from "./views/Chefs";
import FAQ from "./views/FAQ";
import Pricing from "./views/Pricing";
import Login from "./views/Login";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import Contact from "./views/Contact";
import NotFound from "./views/NotFound";
import TermsOfService from "./views/TermsOfService";
import PrivacyPolicy from "./views/PrivacyPolicy";
import ChefDetail from "./views/ChefDetail";
import UserDashboard from "./views/UserDashboard";
import ChefDashboard from "./views/ChefDashboard";
import Messages from "./views/Messages";
import Academy from "./views/Academy";
import Marketplace from "./views/Marketplace";
import Shop from "./views/Shop";
import KidsZone from "./views/KidsZone";
import FindChefs from "./views/FindChefs";
import ChefMedia from "./views/ChefMedia";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import Team from "./views/Team";
import Careers from "./views/Careers";
import BookingFlow from "./views/BookingFlow";
import MiniChefDashboard from "./views/MiniChefDashboard";

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
