import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChefMiiAssistant from "@/components/ChefMiiAssistant";
import CookieBanner from "@/components/CookieBanner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SecurityProvider } from "@/components/SecurityProvider";
import ScrollToTop from "./components/ScrollToTop";
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
import AcademyPricing from "./pages/AcademyPricing";
import AcademyOrgDashboard from "./pages/AcademyOrgDashboard";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import CertificateDetail from "./pages/CertificateDetail";
import Marketplace from "./pages/Marketplace";
import Shop from "./pages/Shop";
import KidsZone from "./pages/KidsZone";
import FindChefs from "./pages/FindChefs";
import ChefMedia from "./pages/ChefMedia";
import ChefMediaDetail from "./pages/ChefMediaDetail";
import ChefMediaProfile from "./pages/ChefMediaProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import BookingFlow from "./pages/BookingFlow";
import MiniChefDashboard from "./pages/MiniChefDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Employee from "./pages/Employee";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeRegister from "./pages/EmployeeRegister";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import KidsDashboard from "./pages/KidsDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import VendorDashboard from "./pages/VendorDashboard";
import SupplyMarketplace from "./pages/SupplyMarketplace";
import RestaurantDetail from "./pages/RestaurantDetail";
import GlobalLiveMapPage from "./pages/GlobalLiveMapPage";
import BusinessDashboard from "./pages/BusinessDashboard";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import TrustAndSafety from "./pages/TrustAndSafety";
import HelpCenter from "./pages/HelpCenter";
import Partnerships from "./pages/Partnerships";

import ComprehensivePricing from "./pages/ComprehensivePricing";
import ChefFoodManagement from "./pages/ChefFoodManagement";
import ChefMiiEats from "./pages/ChefMiiEats";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <ChefMiiAssistant />
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
            <Route path="/academy-pricing" element={<AcademyPricing />} />
            <Route path="/academy/org-dashboard" element={<AcademyOrgDashboard />} />
            <Route path="/academy/course/:id" element={<CourseDetail />} />
            <Route path="/academy/player/:id" element={<LessonPlayer />} />
            <Route path="/academy/certificate/:id" element={<CertificateDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/kids-zone" element={<KidsZone />} />
            <Route path="/find-chefs" element={<FindChefs />} />
            <Route path="/chef-media" element={<ChefMedia />} />
            <Route path="/chef-media/:id" element={<ChefMediaDetail />} />
            <Route path="/chef-media/chef/:chefId" element={<ChefMediaProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/team" element={<Team />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<JobDetail />} />
            <Route path="/booking" element={<BookingFlow />} />
            <Route path="/minichef-dashboard" element={<MiniChefDashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee/register" element={<EmployeeRegister />} />
            <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
            <Route path="/kids-dashboard" element={<KidsDashboard />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/supply-market" element={<SupplyMarketplace />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/live-tracking" element={<GlobalLiveMapPage />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/institution-dashboard" element={<InstitutionDashboard />} />
            <Route path="/trust-and-safety" element={<TrustAndSafety />} />
            <Route path="/safety" element={<TrustAndSafety />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/partnerships" element={<Partnerships />} />
                        <Route path="/comprehensive-pricing" element={<ComprehensivePricing />} />
            <Route path="/chef-kitchen" element={<ChefFoodManagement />} />
            <Route path="/eats" element={<ChefMiiEats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;