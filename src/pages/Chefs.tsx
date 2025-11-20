import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, MapPin, ChefHat, Search, Calendar as CalendarIcon, DollarSign, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import chefEmma from "@/assets/chef-emma.jpg";
import chefDavid from "@/assets/chef-david.jpg";
import chefMaria from "@/assets/chef-maria.jpg";
import chefJames from "@/assets/chef-james.jpg";
import chefSofia from "@/assets/chef-sofia.jpg";
import chefOliver from "@/assets/chef-oliver.jpg";

const Chefs = () => {
  const [date, setDate] = useState<Date>();
  
  const chefs = [
    {
      name: "Emma Thompson",
      cuisine: "Italian Cuisine",
      location: "London, UK",
      rate: "£85",
      rating: 4.9,
      reviews: 127,
      img: chefEmma,
      specialties: ["Pasta Making", "Regional Italian", "Wine Pairing"]
    },
    {
      name: "David Rodriguez",
      cuisine: "Asian Fusion",
      location: "Manchester, UK",
      rate: "£95",
      rating: 5.0,
      reviews: 98,
      img: chefDavid,
      specialties: ["Sushi", "Thai", "Modern Asian"]
    },
    {
      name: "Maria Santos",
      cuisine: "Mediterranean",
      location: "Birmingham, UK",
      rate: "£100",
      rating: 4.8,
      reviews: 156,
      img: chefMaria,
      specialties: ["Greek", "Spanish Tapas", "Healthy Cooking"]
    },
    {
      name: "James Wilson",
      cuisine: "French Fine Dining",
      location: "Edinburgh, UK",
      rate: "£150",
      rating: 4.9,
      reviews: 89,
      img: chefJames,
      specialties: ["Classic French", "Pastry", "Michelin Experience"]
    },
    {
      name: "Sofia Chen",
      cuisine: "Pan-Asian",
      location: "Bristol, UK",
      rate: "£90",
      rating: 4.7,
      reviews: 112,
      img: chefSofia,
      specialties: ["Chinese", "Korean BBQ", "Dim Sum"]
    },
    {
      name: "Oliver Martinez",
      cuisine: "Modern British",
      location: "Leeds, UK",
      rate: "£110",
      rating: 4.9,
      reviews: 94,
      img: chefOliver,
      specialties: ["Farm-to-Table", "Seasonal Menus", "Gastropub"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Find Your Perfect Chef</h1>
            <p className="text-xl text-muted-foreground">
              Browse our curated selection of professional chefs from around the world
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-8 max-w-6xl mx-auto glass-card shadow-xl rounded-3xl border-accent/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search Input */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search by name or cuisine
                </Label>
                <Input 
                  id="search"
                  placeholder="e.g. Chef Antonio, Sushi, BBQ" 
                  className="rounded-xl border-accent/30 bg-background/50 focus:bg-background transition-colors"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City or Country
                </Label>
                <Input 
                  id="location"
                  placeholder="Enter city or country" 
                  className="rounded-xl border-accent/30 bg-background/50 focus:bg-background transition-colors"
                />
              </div>

              {/* Cuisine Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Cuisine Type
                </Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-accent/30 bg-background/50">
                    <SelectValue placeholder="All Cuisines" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="thai">Thai</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="african">African</SelectItem>
                    <SelectItem value="caribbean">Caribbean</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="kosher">Kosher</SelectItem>
                    <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                    <SelectItem value="fine-dining">Fine Dining</SelectItem>
                    <SelectItem value="street-food">Street Food</SelectItem>
                    <SelectItem value="fusion">Fusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-accent/30 bg-background/50">
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="under-50">Under £50</SelectItem>
                    <SelectItem value="50-150">£50–£150</SelectItem>
                    <SelectItem value="150-500">£150–£500</SelectItem>
                    <SelectItem value="500-plus">£500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Available On
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-accent/30 bg-background/50",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("pointer-events-auto rounded-xl")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Chef Tier */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Experience Level
                </Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-accent/30 bg-background/50">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="home-cook">Home Cook</SelectItem>
                    <SelectItem value="restaurant-chef">Restaurant Chef</SelectItem>
                    <SelectItem value="michelin-trained">Michelin-Trained</SelectItem>
                    <SelectItem value="vip-only">VIP-Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-3 pt-2">
                <Button 
                  size="lg" 
                  className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Chefs
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef, i) => (
              <Card key={i} className="overflow-hidden hover-lift">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img src={chef.img} alt={chef.name} className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-semibold mb-1">{chef.name}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <ChefHat className="h-4 w-4" />
                        {chef.cuisine}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {chef.location}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{chef.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({chef.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {chef.specialties.map((specialty, j) => (
                      <span key={j} className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="text-2xl font-bold text-primary">{chef.rate}</p>
                    </div>
                    <Button>Book Chef</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Are You a Professional Chef?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join ChefMe and connect with clients looking for your culinary expertise
          </p>
          <Button size="lg" variant="secondary">Apply to Become a Chef</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chefs;
