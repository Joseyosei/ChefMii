import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const featuredPackages = [
    {
      title: "Daily Meal Prep",
      priceRange: "£30 – £150",
      period: "per day",
      description: "Perfect for busy professionals and health-conscious individuals",
      features: [
        "Fresh ingredients sourced daily",
        "Customized meal plans",
        "Dietary preferences accommodated",
        "Weekly meal rotation",
        "Nutrition consultation included",
        "Storage & reheating instructions"
      ],
      popular: false
    },
    {
      title: "Wedding Feast",
      priceRange: "£2,000 – £10,000",
      period: "per event",
      description: "Make your special day unforgettable with premium wedding catering",
      features: [
        "Bespoke menu creation",
        "Professional tasting session",
        "Unlimited guest capacity",
        "Full service team included",
        "Complete event coordination",
        "Backup chef guarantee",
        "Premium ingredient selection",
        "Custom presentation styling"
      ],
      popular: true
    },
    {
      title: "Michelin-at-Home Experience",
      priceRange: "£1,000 – £5,000",
      period: "per night",
      description: "Exclusive fine dining experience in the comfort of your home",
      features: [
        "Michelin-trained chef",
        "Multi-course tasting menu",
        "Premium ingredient sourcing",
        "Wine pairing recommendations",
        "Professional table service",
        "Personalized menu consultation",
        "Complete kitchen cleanup",
        "Photography-worthy plating"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cream via-background to-accent/20 py-24">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">World-Class Chef Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Premium Chef Experiences
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 animate-fade-in">
              From daily nutrition to once-in-a-lifetime celebrations
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Transparent pricing. Exceptional quality. Unforgettable experiences.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredPackages.map((pkg, idx) => (
                <Card 
                  key={idx}
                  className={`
                    relative p-8 lg:p-10 transition-all duration-500 hover:scale-105
                    ${pkg.popular 
                      ? 'border-2 border-primary shadow-2xl lg:-translate-y-4 bg-gradient-to-br from-background to-cream' 
                      : 'border border-border/50 hover:border-primary/30 hover:shadow-xl'
                    }
                  `}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-terracotta-dark rounded-full shadow-lg">
                      <span className="text-sm font-bold text-primary-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3">{pkg.title}</h3>
                    <p className="text-muted-foreground mb-6">{pkg.description}</p>
                    <div className="space-y-1">
                      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-terracotta-dark bg-clip-text text-transparent">
                        {pkg.priceRange}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {pkg.period}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                          ${pkg.popular ? 'bg-primary' : 'bg-primary/10'}
                        `}>
                          <Check className={`w-3 h-3 ${pkg.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/chefs" className="block">
                    <Button 
                      className={`
                        w-full py-6 text-base font-semibold rounded-xl
                        transition-all duration-300 shadow-lg
                        ${pkg.popular 
                          ? 'bg-gradient-to-r from-primary to-terracotta-dark hover:shadow-2xl hover:shadow-primary/30 hover:scale-105' 
                          : 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20'
                        }
                      `}
                    >
                      Book Now
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/5 via-accent/20 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Experience Culinary Excellence?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Browse our talented chefs and find the perfect match for your needs. 
              Every chef is verified, experienced, and passionate about creating memorable meals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chefs">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-terracotta-dark text-primary-foreground px-10 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                >
                  Browse Our Chefs
                </Button>
              </Link>
              <Link to="/packages">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-10 py-6 text-lg rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  View All Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
