import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Minus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const pricingPlans = [
  {
    name: "Free Plan",
    price: "£0",
    period: "/month",
    description: "Perfect for exploring our platform",
    features: [
      "Browse All Chefs",
      "Public Chef Profiles",
      "Basic Search Features",
      "Access to Help Center"
    ]
  },
    {
      name: "Starter Plan",
      price: "£29",
      period: "/month",
      description: "Essential tools for booking chefs",
      features: [
        "Everything in Free",
        "Priority Chef Matching",
        "Direct Messaging",
        "Calendar Sync",
        "Secure Payments"
      ]
    },
    {
      name: "Professional Plan",
      price: "£75",
      period: "/month",
      popular: true,
      description: "Advanced features for foodies",
      features: [
        "Everything in Starter",
        "2 Hours of Video Consultation",
        "Premium Menu Options",
        "Custom Menu Planning",
        "Priority Support"
      ]
    },
    {
      name: "Influencer Plan",
      price: "£109",
      period: "/month",
      description: "For culinary content creators",
      features: [
        "Everything in Professional",
        "Social Media Promotion",
        "Social Media Audit",
        "Personal Brand Consultation",
        "Verified Badge"
      ]
    },
    {
      name: "Business Plan",
      price: "£749",
      period: "/month",
      description: "Comprehensive culinary solutions for teams",
      features: [
        "Everything in Influencer",
        "Corporate Catering Access",
        "Multi-user Business Account",
        "Dedicated Account Manager",
        "Custom Billing & Invoicing"
      ]
    }
];

const comparisonData = [
  {
    feature: "Browse All Chefs",
    free: true,
    starter: true,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Search by Location/Cuisine",
    free: true,
    starter: true,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Direct Messaging",
    free: false,
    starter: true,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Priority Matching",
    free: false,
    starter: true,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Calendar Sync",
    free: false,
    starter: true,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Custom Menu Planning",
    free: false,
    starter: false,
    pro: true,
    influencer: true,
    business: true,
  },
  {
    feature: "Video Consultations",
    free: false,
    starter: false,
    pro: "2 hrs",
    influencer: "5 hrs",
    business: "Unlimited",
  },
  {
    feature: "Social Media Promotion",
    free: false,
    starter: false,
    pro: false,
    influencer: true,
    business: true,
  },
  {
    feature: "Verified Badge",
    free: false,
    starter: false,
    pro: false,
    influencer: true,
    business: true,
  },
  {
    feature: "Dedicated Account Manager",
    free: false,
    starter: false,
    pro: false,
    influencer: false,
    business: true,
  },
  {
    feature: "Multi-user Access",
    free: false,
    starter: false,
    pro: false,
    influencer: false,
    business: true,
  },
];

const Pricing = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    navigate(`/register?plan=${plan.toLowerCase().replace(' plan', '')}`);
  };

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pricing
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start for free or select from one of our plans below
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`hover-lift transition-all duration-300 relative flex flex-col ${
                plan.popular ? 'border-2 border-primary shadow-xl scale-105 z-10' : 'border border-gray-200'
              } ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full font-bold ${plan.popular ? 'bg-primary' : 'variant-outline'}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-24 max-w-6xl mx-auto overflow-hidden">
          <h2 className="text-3xl font-bold mb-12 text-center">Compare our plans</h2>
          <div className={`rounded-xl border ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50/30'}`}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] font-bold">General</TableHead>
                  <TableHead className="text-center font-bold">Free</TableHead>
                  <TableHead className="text-center font-bold">Starter</TableHead>
                  <TableHead className="text-center font-bold">Pro</TableHead>
                  <TableHead className="text-center font-bold">Influencer</TableHead>
                  <TableHead className="text-center font-bold">Business</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, i) => (
                  <TableRow key={i} className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">{renderValue(row.free)}</TableCell>
                    <TableCell className="text-center">{renderValue(row.starter)}</TableCell>
                    <TableCell className="text-center">{renderValue(row.pro)}</TableCell>
                    <TableCell className="text-center">{renderValue(row.influencer)}</TableCell>
                    <TableCell className="text-center">{renderValue(row.business)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-24 text-center">
          <p className="text-muted-foreground mb-4">Need help choosing?</p>
          <Button variant="link" className="text-primary font-bold text-lg" onClick={() => navigate('/contact')}>
            Talk to our team →
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
