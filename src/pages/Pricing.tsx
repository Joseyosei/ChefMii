import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const Pricing = () => {
  const pricingCategories = [
    {
      icon: "🍽️",
      title: "Lifestyle & Daily",
      packages: [
        { name: "Daily Meal Prep Chefs", range: "£30 – £150 per day" },
        { name: "Family Chef Plan", range: "£400 – £1,200 per week" },
        { name: "Meal Plans for Seniors", range: "£150 – £600 per week" },
        { name: "Student Survival Meals", range: "£15 – £50 per meal" },
        { name: "Couple's Culinary Nights", range: "£120 – £500 per evening" },
      ],
    },
    {
      icon: "🎉",
      title: "Events & Celebrations",
      packages: [
        { name: "Birthday Bash Packages", range: "£300 – £1,500 per event" },
        { name: "Wedding Feast Packages", range: "£2,000 – £10,000 per event" },
        { name: "Bridal Shower / Bachelor Party Chefs", range: "£500 – £2,000 per event" },
        { name: "Funeral/Remembrance Catering", range: "£800 – £3,000 per event" },
        { name: "Baby Shower Brunch Packages", range: "£400 – £1,200 per event" },
      ],
    },
    {
      icon: "🏢",
      title: "Business & Institutions",
      packages: [
        { name: "Office Lunch Subscriptions", range: "£800 – £3,500 per month" },
        { name: "Conference Chef Services", range: "£1,500 – £8,000 per conference" },
        { name: "School Meal Chefs", range: "£500 – £2,000 per week (per school/contract)" },
        { name: "Military Mess Hall Chefs", range: "£3,000 – £12,000 per month" },
        { name: "Flight Chef Experiences", range: "£1,500 – £5,000 per flight" },
      ],
    },
    {
      icon: "👑",
      title: "Luxury, Custom & VIP",
      packages: [
        { name: "Royalty-In-Residence Service", range: "£10,000 – £40,000 per month" },
        { name: "Global Travel Chef Companion", range: "£2,000 – £10,000 per trip" },
        { name: "Michelin-at-Home Experience", range: "£1,000 – £5,000 per night" },
        { name: "Celebrity Wellness Meal Plans", range: "£2,000 – £8,000 per month" },
        { name: "Presidential Chef Detail", range: "£15,000 – £50,000 per month" },
      ],
    },
    {
      icon: "🎥",
      title: "Unique & Entertainment",
      packages: [
        { name: "On-Set Chef Services", range: "£500 – £3,000 per day" },
        { name: "Podcast or Live Show Chefs", range: "£250 – £1,000 per session" },
        { name: "Festival/Event Booth Chefs", range: "£1,000 – £6,000 per event" },
        { name: "ChefMe Kids Club", range: "£300 – £800 per session" },
        { name: "Holiday Feast Packages", range: "£500 – £2,500 per event" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-cream/30 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transparent Pricing for Every Occasion
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From daily meal prep to luxury events, find the perfect chef package for your needs. 
              All prices are estimates and can be customized based on your requirements.
            </p>
          </div>
        </section>

        {/* Pricing Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {pricingCategories.map((category, idx) => (
                <div key={idx} className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-4xl">{category.icon}</span>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.packages.map((pkg, pkgIdx) => (
                      <Card 
                        key={pkgIdx} 
                        className="p-6 hover:shadow-lg transition-all duration-300 hover-scale border-border/40"
                      >
                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                          {pkg.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <p className="text-muted-foreground font-medium">
                            {pkg.range}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-background to-cream/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Book Your Chef?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse our talented chefs and find the perfect match for your culinary needs.
            </p>
            <a href="/chefs">
              <button className="bg-foreground text-background px-8 py-4 rounded-xl font-semibold hover:bg-foreground/90 transition-all duration-300 shadow-lg hover-scale">
                Find Your Chef
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
