import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Clock, Award, Shield, Star, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-chef.jpg";
import gourmetPlate from "@/assets/gourmet-plate.jpg";
import chefHome1 from "@/assets/chef-home-1.jpg";
import chefHome2 from "@/assets/chef-home-2.jpg";
import chefHome3 from "@/assets/chef-home-3.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
      if (!searchQuery.trim()) return;
      // Search across chefs, cuisines, and locations
      navigate(`/chefs?q=${encodeURIComponent(searchQuery)}&searchType=all`);
    };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Hire a Chef for Any Occasion
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              From home dinners to presidential banquets, ChefMii connects you with top chefs globally.
            </p>
            
        {/* Simplified Search Box */}
        <div className="max-w-3xl mx-auto text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Find a Chef</h2>
          <Card className="overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <label className="absolute left-3 top-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                  Location, Chef or Cuisine
                </label>
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g. London, Italian, or Gordon"
                  className="h-14 pt-6 pb-2 px-3 text-base border-muted-foreground/20 focus-visible:ring-primary text-black"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-14 px-10 text-lg font-bold shadow-lg bg-[#EA580C] hover:bg-[#C2410C]" 
                size="lg"
              >
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
          </Card>
          
          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            {['Italian', 'French', 'Japanese', 'Vegan', 'Pastry', 'BBQ'].map((cat) => (
              <Button 
                key={cat} 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white hover:text-black transition-colors"
                onClick={() => {
                  setSearchQuery(cat);
                  navigate(`/chefs?q=${cat}`);
                }}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
          </div>
        </div>
      </section>

      {/* Feature Sections - Deliveroo Style */}
      <section className="py-16 md:py-24 bg-[#EA580C]/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop" 
                  alt="Book a private chef" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3">Book a Private Chef</h3>
                <p className="text-muted-foreground mb-8 flex-grow">
                  Experience fine dining in the comfort of your home. Professional chefs for any cuisine, curated for your specific taste.
                </p>
                <Link to="/chefs">
                  <Button className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold h-12 text-lg">
                    Browse Chefs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800&auto=format&fit=crop" 
                  alt="Become a ChefMii chef" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3">Become a ChefMii Chef</h3>
                <p className="text-muted-foreground mb-8 flex-grow">
                  Join our elite culinary network. Grow your brand, manage bookings, and share your passion with a global audience.
                </p>
                <Link to="/register?role=chef">
                  <Button className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold h-12 text-lg">
                    Join as Chef
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop" 
                  alt="Host a corporate event" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3">Corporate Catering</h3>
                <p className="text-muted-foreground mb-8 flex-grow">
                  Elevate your office culture. From daily team lunches to high-stakes executive events and team building.
                </p>
                <Link to="/packages">
                  <Button className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold h-12 text-lg">
                    Corporate Solutions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Ticker */}
      <section className="py-8 bg-white border-y overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Trusted by culinary leaders worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {['Michelin', 'James Beard', 'Forbes Travel', 'Relais & Châteaux', 'Leading Hotels'].map((brand) => (
              <span key={brand} className="text-xl font-black italic">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Chefs of the Week */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Highlighted Chefs of the Week</h2>
            <p className="text-xl text-muted-foreground">Meet our top-rated culinary professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              id: "1",
              name: "Gordon Harrison",
              cuisine: "Contemporary European",
              rate: "£200",
              img: chefHome1
            }, {
              id: "2",
              name: "Sophie Laurent",
              cuisine: "French Pastry & Desserts",
              rate: "£150",
              img: chefHome2
            }, {
              id: "3",
              name: "Marco Ricci",
              cuisine: "Modern Italian",
              rate: "£180",
              img: chefHome3
            }].map((chef, i) => (
              <Card key={i} className="overflow-hidden hover-lift">
                <Link to={`/chef/${chef.id}`}>
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img src={chef.img} alt={chef.name} className="object-cover w-full h-full" />
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-1">{chef.name}</h3>
                  <p className="text-muted-foreground mb-3">{chef.cuisine}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-lg font-semibold text-primary mb-4">Starting at {chef.rate}/event</p>
                  <Link to={`/chef/${chef.id}`}>
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
      <section className="py-20 bg-foreground text-background border-mint-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-background/80">Real experiences from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[{
              quote: "This chef transformed my anniversary into an unforgettable experience. The attention to detail was impeccable.",
              author: "Sarah M.",
              role: "Private Client"
            }, {
              quote: "We hired a chef for our corporate event and the feedback was incredible. Professional, delicious, and stress-free.",
              author: "James K.",
              role: "Corporate Event Manager"
            }].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-background/10 backdrop-blur border-background/20 rounded-none shadow opacity-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
                </div>
                <p className="text-lg mb-6 text-background/90">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-primary-foreground">{testimonial.author}</p>
                  <p className="text-background/70 text-sm">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
            <div className="text-xl text-muted-foreground leading-relaxed space-y-6 text-center max-w-3xl mx-auto">
              <p>
                At ChefMii, our mission is to make exceptional dining experiences accessible to everyone. 
                We believe that whether you're a student looking for home-cooked meals or planning a presidential 
                banquet, everyone deserves access to world-class culinary talent.
              </p>
              <p>
                We've built a platform that connects passionate chefs with people who appreciate great food for any occasion, 
                fostering a community where culinary art meets convenience and excellence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[{
              icon: Shield,
              title: "Trust & Safety",
              desc: "All chefs vetted and background checked"
            }, {
              icon: Award,
              title: "Quality Assured",
              desc: "Only the best culinary professionals"
            }, {
              icon: Clock,
              title: "Always Available",
              desc: "Book chefs for any date, any time"
            }].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-xl font-semibold mb-2">{item.title}</div>
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
                  Absolutely! ChefMii operates globally. Simply enter your location when searching, 
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
            Join thousands of satisfied clients who have elevated their dining experiences with ChefMii
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">Get Started Now</Button>
            </Link>
            <Link to="/chefs">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
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
