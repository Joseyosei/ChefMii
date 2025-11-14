import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, ChefHat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import chef1 from "@/assets/chef-1.jpg";
import chef2 from "@/assets/chef-2.jpg";
import chef3 from "@/assets/chef-3.jpg";

const Chefs = () => {
  const chefs = [
    {
      name: "Emma Thompson",
      cuisine: "Italian Cuisine",
      location: "London, UK",
      rate: "£85",
      rating: 4.9,
      reviews: 127,
      img: chef1,
      specialties: ["Pasta Making", "Regional Italian", "Wine Pairing"]
    },
    {
      name: "David Rodriguez",
      cuisine: "Asian Fusion",
      location: "Manchester, UK",
      rate: "£95",
      rating: 5.0,
      reviews: 98,
      img: chef2,
      specialties: ["Sushi", "Thai", "Modern Asian"]
    },
    {
      name: "Maria Santos",
      cuisine: "Mediterranean",
      location: "Birmingham, UK",
      rate: "£100",
      rating: 4.8,
      reviews: 156,
      img: chef3,
      specialties: ["Greek", "Spanish Tapas", "Healthy Cooking"]
    },
    {
      name: "James Wilson",
      cuisine: "French Fine Dining",
      location: "Edinburgh, UK",
      rate: "£150",
      rating: 4.9,
      reviews: 89,
      img: chef1,
      specialties: ["Classic French", "Pastry", "Michelin Experience"]
    },
    {
      name: "Sofia Chen",
      cuisine: "Pan-Asian",
      location: "Bristol, UK",
      rate: "£90",
      rating: 4.7,
      reviews: 112,
      img: chef2,
      specialties: ["Chinese", "Korean BBQ", "Dim Sum"]
    },
    {
      name: "Oliver Martinez",
      cuisine: "Modern British",
      location: "Leeds, UK",
      rate: "£110",
      rating: 4.9,
      reviews: 94,
      img: chef3,
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
          <Card className="p-6 max-w-5xl mx-auto glass-card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Search by name or cuisine" className="md:col-span-2" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Cuisine Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Under £75</SelectItem>
                  <SelectItem value="mid">£75-£150</SelectItem>
                  <SelectItem value="premium">£150+</SelectItem>
                </SelectContent>
              </Select>
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
