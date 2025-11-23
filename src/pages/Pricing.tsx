import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Moon, Sun } from "lucide-react";
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    name: "Starter Plan",
    price: "£29",
    period: "/month",
    features: [
      "Priority Chef Matching",
      "Direct Messaging",
      "Calendar Sync",
      "Basic Support"
    ]
  },
  {
    name: "Professional Plan",
    price: "£59",
    period: "/month",
    popular: true,
    features: [
      "Everything in Starter",
      "2 hours of Chef Video Call",
      "Premium Menu Options",
      "Priority Support"
    ]
  },
  {
    name: "Elite Plan",
    price: "£99",
    period: "/month",
    elite: true,
    features: [
      "Everything in Professional",
      "Global Travel Chef",
      "Custom Menu",
      "Dedicated Account Manager"
    ]
  }
];

const Pricing = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-gradient-to-b from-cream via-ivory to-cream'}`}>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Theme Toggle */}
        <div className="flex justify-end items-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isDarkMode ? 'text-gray-900' : 'text-gray-400'}`}>Light</span>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-7' : ''} flex items-center justify-center`}>
              {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </div>
          </button>
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-400'}`}>Dark</span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Pricing
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Dark mode. Light mode. Adaptive display.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`glass-card hover-lift transition-all duration-300 relative ${
                plan.popular ? 'border-2 border-green-500' : plan.elite ? 'border-2 border-purple-500 bg-gray-900 text-white' : ''
              } ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/80'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    New Upgrade
                  </span>
                </div>
              )}
              {plan.elite && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full italic">
                    Meist Popular
                  </span>
                </div>
              )}
              
              <CardContent className="p-8">
                <h3 className={`text-2xl font-bold mb-6 ${plan.elite ? 'text-white' : isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-8">
                  <span className={`text-5xl font-bold ${plan.elite ? 'text-primary' : isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.elite ? 'text-gray-300' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                </div>

                {plan.name === "Professional Plan" && (
                  <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Perfect for immersive and adaptive experiences.
                  </p>
                )}
                {plan.name === "Elite Plan" && (
                  <p className="mb-6 text-sm text-gray-300">
                    For maximum customization and support.
                  </p>
                )}

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.elite ? 'text-green-400' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.elite ? 'text-gray-300' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/register">
                  <Button 
                    className={`w-full ${plan.elite ? 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10' : plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-primary hover:bg-primary/90'}`}
                  >
                    {plan.name === "Starter Plan" ? "Current Plan" : "Get Started"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
