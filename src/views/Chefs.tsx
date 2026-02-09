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
import { cuisineTypes, priceRanges } from "@/data/cuisines";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
const chefEmma = "/placeholder.svg?height=600&width=600";
const chefDavid = "/placeholder.svg?height=600&width=600";
const chefMaria = "/placeholder.svg?height=600&width=600";
const chefJames = "/placeholder.svg?height=600&width=600";
const chefSofia = "/placeholder.svg?height=600&width=600";
const chefOliver = "/placeholder.svg?height=600&width=600";

const Chefs = () => {
  const [date, setDate] = useState<Date>();
  
  const chefs = [
    {
      id: "emma-thompson",
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
      id: "david-rodriguez",
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
      id: "maria-santos",
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
      id: "james-wilson",
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
      id: "sofia-chen",
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
      id: "oliver-martinez",
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
            <p className="text-xl text-muted-foreground mb-6">
              Browse our curated selection of professional chefs from around the world
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-terracotta to-terracotta-dark hover:opacity-90 text-white shadow-2xl animate-pulse hover:animate-none text-lg px-8 py-6 h-auto"
              >
                🔥 Book Your Dream Chef Today - Limited Spots Available!
              </Button>
            </Link>
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
                  <SelectContent className="bg-background max-h-[300px] overflow-y-auto">
                    {cuisineTypes.map((cuisine) => (
                      <SelectItem key={cuisine.toLowerCase().replace(/\s+/g, '-')} value={cuisine.toLowerCase()}>
                        {cuisine}
                      </SelectItem>
                    ))}
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
                  <SelectContent className="bg-background max-h-[300px] overflow-y-auto">
                    {priceRanges.map((range) => (
                      <SelectItem key={range.toLowerCase().replace(/[^a-z0-9]+/g, '-')} value={range.toLowerCase()}>
                        {range}
                      </SelectItem>
                    ))}
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
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
              <Link to={`/chef/${chef.id}`} key={i}>
                <Card className="overflow-hidden hover-lift cursor-pointer">
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
                  <Button>View Profile</Button>
                </div>
              </div>
            </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Are You a Professional Chef?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join ChefMii Global and connect with clients looking for your culinary expertise
          </p>
          <Button size="lg" variant="secondary">Apply to Become a Chef</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chefs;
