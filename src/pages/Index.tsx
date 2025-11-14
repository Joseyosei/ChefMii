import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, Calendar, Users, ChefHat, Clock, Award, Shield, Star, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-chef.jpg";
import gourmetPlate from "@/assets/gourmet-plate.jpg";
import chef1 from "@/assets/chef-1.jpg";
import chef2 from "@/assets/chef-2.jpg";
import chef3 from "@/assets/chef-3.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(254, 245, 231, 0.95) 50%, rgba(254, 245, 231, 0.6) 100%), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-2xl fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Hire a Chef for Any Occasion
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              From home dinners to presidential banquets, ChefMe connects you with top chefs globally.
            </p>
            
            {/* Search Box */}
            <Card className="p-6 glass-card shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="City or postcode" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <Input type="number" placeholder="Number of guests" />
                </div>
              </div>
              <Button className="w-full mt-4" size="lg">
                <Search className="mr-2 h-4 w-4" /> Search Chefs
              </Button>
            </Card>

            {/* Service Categories */}
            <div className="mt-8">
              <p className="text-sm font-medium mb-4">Food Worth Hiring For</p>
              <div className="flex flex-wrap gap-2">
                {["Private Chef Services", "Event Catering", "Cooking Classes", "Corporate Events", "High-Profile Chefs"].map((category) => (
                  <Button key={category} variant="secondary" size="sm">
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen In */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider">As Seen In</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["Forbes", "BBC", "TechCrunch", "The New York Times", "FOOD & WINE"].map((pub) => (
              <div key={pub} className="text-2xl font-bold text-foreground/60">{pub}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to exceptional dining</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover-lift">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Browse Chefs</h3>
              <p className="text-muted-foreground">
                Explore our curated selection of professional chefs from around the world
              </p>
            </Card>

            <Card className="p-8 text-center hover-lift">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Book Your Experience</h3>
              <p className="text-muted-foreground">
                Choose your preferred chef, date, and menu to create your perfect dining experience
              </p>
            </Card>

            <Card className="p-8 text-center hover-lift">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Enjoy Your Meal</h3>
              <p className="text-muted-foreground">
                Sit back and savor an unforgettable culinary experience in the comfort of your venue
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Overview */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Chef Packages for Every Occasion</h2>
            <p className="text-xl text-muted-foreground">From casual dinners to luxury events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Student Survival Meals", price: "£50-£100", desc: "Affordable home-cooked meals for students" },
              { title: "Family Chef Plan", price: "£200-£400", desc: "Weekly meal prep for busy families" },
              { title: "Event Chef Services", price: "£500-£1,500", desc: "Professional catering for special events" },
              { title: "VIP Chef Experiences", price: "£2,000+", desc: "Luxury dining with celebrity chefs" },
            ].map((pkg, i) => (
              <Card key={i} className="p-6 hover-lift">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-2xl font-bold text-primary mb-3">{pkg.price}</p>
                <p className="text-muted-foreground text-sm mb-4">{pkg.desc}</p>
                <Link to="/packages">
                  <Button variant="outline" className="w-full">
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/packages">
              <Button size="lg">View All Packages</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Chefs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Chefs</h2>
            <p className="text-xl text-muted-foreground">Meet our top-rated culinary professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Emma Thompson", cuisine: "Italian Cuisine", rate: "£85", img: chef1 },
              { name: "David Rodriguez", cuisine: "Asian Fusion", rate: "£95", img: chef2 },
              { name: "Maria Santos", cuisine: "Mediterranean", rate: "£100", img: chef3 },
            ].map((chef, i) => (
              <Card key={i} className="overflow-hidden hover-lift">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img src={chef.img} alt={chef.name} className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-1">{chef.name}</h3>
                  <p className="text-muted-foreground mb-3">{chef.cuisine}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg font-semibold text-primary mb-4">Starting at {chef.rate}/event</p>
                  <Link to="/chefs">
                    <Button className="w-full">View Profile</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/chefs">
              <Button size="lg" variant="outline">Browse All Chefs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-background/80">Real experiences from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "This chef transformed my anniversary into an unforgettable experience. The attention to detail was impeccable.",
                author: "Sarah M.",
                role: "Private Client"
              },
              {
                quote: "We hired a chef for our corporate event and the feedback was incredible. Professional, delicious, and stress-free.",
                author: "James K.",
                role: "Corporate Event Manager"
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-background/10 backdrop-blur border-background/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg mb-6 text-background/90">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-background/70 text-sm">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              At ChefMe, our mission is to make exceptional dining experiences accessible to everyone. 
              We believe that whether you're a student looking for home-cooked meals or planning a presidential 
              banquet, everyone deserves access to world-class culinary talent. We've built a platform that 
              connects passionate chefs with people who appreciate great food for any occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Shield, title: "Trust & Safety", desc: "All chefs vetted and background checked" },
              { icon: Award, title: "Quality Assured", desc: "Only the best culinary professionals" },
              { icon: Clock, title: "Always Available", desc: "Book chefs for any date, any time" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How far in advance should I book a chef?
                </AccordionTrigger>
                <AccordionContent>
                  We recommend booking at least 2-3 weeks in advance for the best selection. However, 
                  last-minute bookings are often possible depending on chef availability.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Do chefs bring their own ingredients?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, most packages include ingredient sourcing. Your chef will purchase fresh, 
                  high-quality ingredients as part of their service. Costs are typically included in the quoted price.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Can I book a chef outside the UK?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! ChefMe operates globally. Simply enter your location when searching, 
                  and we'll show you available chefs in your area.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="text-center mt-8">
              <Link to="/faq">
                <Button variant="outline">View All FAQs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Chef?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have elevated their dining experiences with ChefMe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">Get Started Now</Button>
            </Link>
            <Link to="/chefs">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Chefs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
