import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Packages = () => {
  const packages = [
    {
      title: "Student Survival Meals",
      price: "£50-£100",
      period: "/week",
      description: "Affordable, nutritious home-cooked meals for busy students",
      features: [
        "3-5 meals per week",
        "Budget-friendly ingredients",
        "Meal prep instructions",
        "Dietary accommodations",
        "Easy reheating guidance"
      ]
    },
    {
      title: "Family Chef Plan",
      price: "£200-£400",
      period: "/week",
      description: "Weekly meal preparation for busy families",
      features: [
        "Full week meal prep",
        "Customized family menu",
        "Fresh, local ingredients",
        "Kid-friendly options",
        "Storage instructions",
        "Nutrition consultation"
      ],
      popular: true
    },
    {
      title: "Senior Care Dining",
      price: "£150-£300",
      period: "/week",
      description: "Nutritious meals tailored for seniors' dietary needs",
      features: [
        "Specialized dietary planning",
        "Easy-to-digest meals",
        "Health-conscious menus",
        "Portion control",
        "Medical diet compliance"
      ]
    },
    {
      title: "Romantic Dinner",
      price: "£250-£500",
      period: "/event",
      description: "Intimate dining experience for special occasions",
      features: [
        "Custom 3-5 course menu",
        "Table setting assistance",
        "Wine pairing suggestions",
        "Professional service",
        "Cleanup included"
      ]
    },
    {
      title: "Event Catering",
      price: "£500-£1,500",
      period: "/event",
      description: "Professional catering for parties and gatherings",
      features: [
        "Menu for 10-50 guests",
        "Buffet or plated service",
        "Professional staff",
        "Equipment rental",
        "Full setup & cleanup",
        "Dietary accommodations"
      ]
    },
    {
      title: "Wedding Services",
      price: "£2,000-£8,000",
      period: "/event",
      description: "Make your special day unforgettable with premium catering",
      features: [
        "Unlimited guests",
        "Bespoke menu creation",
        "Tasting session",
        "Professional service team",
        "Complete event coordination",
        "Backup chef guarantee"
      ]
    },
    {
      title: "Corporate Events",
      price: "£1,000-£5,000",
      period: "/event",
      description: "Impress clients and employees with professional catering",
      features: [
        "Business lunch/dinner service",
        "Conference catering",
        "Team building cooking classes",
        "Branded presentation",
        "Dietary accommodations",
        "Invoice & documentation"
      ]
    },
    {
      title: "VIP Chef Experience",
      price: "£3,000+",
      period: "/event",
      description: "Luxury dining with celebrity and Michelin-starred chefs",
      features: [
        "Celebrity chef selection",
        "Fully customized experience",
        "Premium ingredients",
        "Sommelier service available",
        "Photography options",
        "Personalized menus",
        "24/7 concierge support"
      ]
    },
    {
      title: "Holiday Feast",
      price: "£500-£1,200",
      period: "/event",
      description: "Stress-free holiday celebrations with traditional or modern menus",
      features: [
        "Traditional holiday meals",
        "Family-style service",
        "All dietary needs met",
        "Leftover packaging",
        "Kitchen cleanup"
      ]
    },
    {
      title: "Cooking Classes",
      price: "£80-£200",
      period: "/session",
      description: "Learn from professional chefs in hands-on cooking sessions",
      features: [
        "2-3 hour sessions",
        "All ingredients included",
        "Take-home recipes",
        "Small group or private",
        "Certificate of completion"
      ]
    },
    {
      title: "Meal Prep Coaching",
      price: "£150-£350",
      period: "/month",
      description: "Learn to meal prep like a pro with personalized coaching",
      features: [
        "Weekly meal plans",
        "Shopping lists",
        "Prep techniques training",
        "Recipe customization",
        "Ongoing support"
      ]
    },
    {
      title: "Global Travel Chef",
      price: "£500+",
      period: "/day",
      description: "Personal chef companion for international travel and yachts",
      features: [
        "Travel accommodation",
        "Local ingredient sourcing",
        "Multi-cuisine expertise",
        "Flexible scheduling",
        "Health & safety certified"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Chef Packages</h1>
            <p className="text-xl text-muted-foreground">
              Find the perfect chef service for any occasion, from student meals to luxury events
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <Card 
                key={i} 
                className={`p-8 hover-lift relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground">{pkg.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/chefs">
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Book Now
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Don't See What You Need?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We can create custom packages for any occasion. Get in touch to discuss your specific requirements.
          </p>
          <Link to="/contact">
            <Button size="lg">Contact Us for Custom Packages</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
