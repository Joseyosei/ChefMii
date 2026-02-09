import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Packages = () => {
  const pricingCategories = [
    {
      icon: "🍽️",
      title: "Lifestyle & Daily",
      packages: [
        { name: "Daily Meal Prep Chefs", range: "£30 – £150 per day", slug: "daily-meal-prep" },
        { name: "Family Chef Plan", range: "£400 – £1,200 per week", slug: "family-chef" },
        { name: "Meal Plans for Seniors", range: "£150 – £600 per week", slug: "seniors-meal" },
        { name: "Student Survival Meals", range: "£15 – £50 per meal", slug: "student-meals" },
        { name: "Couple's Culinary Nights", range: "£120 – £500 per evening", slug: "couples-nights" },
      ],
    },
    {
      icon: "🎉",
      title: "Events & Celebrations",
      packages: [
        { name: "Birthday Bash Packages", range: "£300 – £1,500 per event", slug: "birthday-bash" },
        { name: "Wedding Feast Packages", range: "£2,000 – £10,000 per event", slug: "wedding-feast" },
        { name: "Bridal Shower / Bachelor Party Chefs", range: "£500 – £2,000 per event", slug: "bridal-bachelor" },
        { name: "Funeral/Remembrance Catering", range: "£800 – £3,000 per event", slug: "remembrance" },
        { name: "Baby Shower Brunch Packages", range: "£400 – £1,200 per event", slug: "baby-shower" },
      ],
    },
    {
      icon: "🏢",
      title: "Business & Institutions",
      packages: [
        { name: "Office Lunch Subscriptions", range: "£800 – £3,500 per month", slug: "office-lunch" },
        { name: "Conference Chef Services", range: "£1,500 – £8,000 per conference", slug: "conference-chef" },
        { name: "School Meal Chefs", range: "£500 – £2,000 per week", slug: "school-meals" },
        { name: "Military Mess Hall Chefs", range: "£3,000 – £12,000 per month", slug: "military-mess" },
        { name: "Flight Chef Experiences", range: "£1,500 – £5,000 per flight", slug: "flight-chef" },
      ],
    },
    {
      icon: "👑",
      title: "Luxury, Custom & VIP",
      packages: [
        { name: "Royalty-In-Residence Service", range: "£10,000 – £40,000 per month", slug: "royalty-residence" },
        { name: "Global Travel Chef Companion", range: "£2,000 – £10,000 per trip", slug: "travel-chef" },
        { name: "Michelin-at-Home Experience", range: "£1,000 – £5,000 per night", slug: "michelin-home" },
        { name: "Celebrity Wellness Meal Plans", range: "£2,000 – £8,000 per month", slug: "celebrity-wellness" },
        { name: "Presidential Chef Detail", range: "£15,000 – £50,000 per month", slug: "presidential-chef" },
      ],
    },
    {
      icon: "🎥",
      title: "Unique & Entertainment",
      packages: [
        { name: "On-Set Chef Services", range: "£500 – £3,000 per day", slug: "on-set-chef" },
        { name: "Podcast or Live Show Chefs", range: "£250 – £1,000 per session", slug: "podcast-chef" },
        { name: "Festival/Event Booth Chefs", range: "£1,000 – £6,000 per event", slug: "festival-booth" },
        { name: "ChefMii Kids Club", range: "£300 – £800 per session", slug: "kids-club" },
        { name: "Holiday Feast Packages", range: "£500 – £2,500 per event", slug: "holiday-feast" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Chef Packages & Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Transparent pricing for every occasion. From daily meals to luxury events.
            </p>
          </div>
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
                      className="hover:shadow-lg transition-all duration-300 hover-lift border-border/40"
                    >
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                          {pkg.name}
                        </h3>
                        <p className="text-muted-foreground font-medium mb-4">
                          {pkg.range}
                        </p>
                        <Link to={`/contact?package=${pkg.slug}`}>
                          <Button variant="default" className="w-full">
                            Book Now
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
