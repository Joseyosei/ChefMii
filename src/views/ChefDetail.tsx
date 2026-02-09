import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, ChefHat, Calendar as CalendarIcon, Award, Users, Clock, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import chefEmma from "@/assets/chef-emma.jpg";
import chefDavid from "@/assets/chef-david.jpg";
import chefMaria from "@/assets/chef-maria.jpg";
import chefJames from "@/assets/chef-james.jpg";
import chefSofia from "@/assets/chef-sofia.jpg";
import chefOliver from "@/assets/chef-oliver.jpg";
import italianPasta from "@/assets/food-italian-pasta.jpg";
import italianRisotto from "@/assets/food-italian-risotto.jpg";
import asianSushi from "@/assets/food-asian-sushi.jpg";
import asianThai from "@/assets/food-asian-thai.jpg";
import medMezze from "@/assets/food-mediterranean-mezze.jpg";
import medTapas from "@/assets/food-mediterranean-tapas.jpg";

const ChefDetail = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock chef data - in a real app, this would come from an API
  const chefData: Record<string, any> = {
    "emma-thompson": {
      name: "Emma Thompson",
      cuisine: "Italian Cuisine",
      location: "London, UK",
      rate: "£85",
      rating: 4.9,
      reviews: 127,
      img: chefEmma,
      specialties: ["Pasta Making", "Regional Italian", "Wine Pairing"],
      bio: "With over 15 years of experience in authentic Italian cuisine, I bring the flavors of Italy to your table. Trained in Tuscany and Rome, I specialize in traditional pasta-making techniques and regional dishes that tell the story of Italy's rich culinary heritage.",
      experience: "15+ years",
      languages: ["English", "Italian"],
      badges: ["Top Rated", "Verified Chef", "Quick Responder"],
      menus: [
        { name: "Classic Italian Dinner", price: "£400", description: "3-course traditional Italian meal", serves: "4-6 people" },
        { name: "Pasta Experience", price: "£350", description: "Fresh handmade pasta with choice of sauces", serves: "4-6 people" },
        { name: "Tuscan Feast", price: "£500", description: "5-course Tuscan-inspired dinner", serves: "6-8 people" },
      ],
      foodImages: [italianPasta, italianRisotto, italianPasta, italianRisotto],
      availability: ["2025-01-15", "2025-01-16", "2025-01-20", "2025-01-22"],
      customerReviews: [
        { name: "Sarah M.", rating: 5, comment: "Emma created an unforgettable dining experience! The pasta was exceptional.", date: "Nov 2024" },
        { name: "James P.", rating: 5, comment: "Professional, friendly, and the food was outstanding. Highly recommend!", date: "Oct 2024" },
        { name: "Lisa K.", rating: 4, comment: "Great food and wonderful service. Would book again!", date: "Sep 2024" },
      ],
      cancellationPolicy: "Full refund up to 7 days before your event",
    },
    "david-rodriguez": {
      name: "David Rodriguez",
      cuisine: "Asian Fusion",
      location: "Manchester, UK",
      rate: "£95",
      rating: 5.0,
      reviews: 98,
      img: chefDavid,
      specialties: ["Sushi", "Thai", "Modern Asian"],
      bio: "I blend traditional Asian cooking techniques with modern innovation. My journey through Japan, Thailand, and Vietnam has given me a deep appreciation for authentic flavors, which I love to share through unique fusion creations.",
      experience: "12+ years",
      languages: ["English", "Spanish", "Japanese"],
      badges: ["Top Rated", "Michelin Trained"],
      menus: [
        { name: "Sushi Omakase", price: "£450", description: "Chef's selection of premium sushi", serves: "4 people" },
        { name: "Thai Fusion Dinner", price: "£380", description: "Modern Thai-inspired 4-course meal", serves: "4-6 people" },
        { name: "Pan-Asian Tasting", price: "£520", description: "6-course journey across Asia", serves: "6-8 people" },
      ],
      foodImages: [asianSushi, asianThai, asianSushi, asianThai],
      availability: ["2025-01-17", "2025-01-19", "2025-01-24", "2025-01-26"],
      customerReviews: [
        { name: "Tom R.", rating: 5, comment: "David's sushi skills are incredible. Best private dining experience!", date: "Dec 2024" },
        { name: "Anna L.", rating: 5, comment: "The fusion menu was creative and delicious. Highly professional!", date: "Nov 2024" },
      ],
      cancellationPolicy: "Full refund up to 5 days before your event",
    },
    "maria-santos": {
      name: "Maria Santos",
      cuisine: "Mediterranean",
      location: "Birmingham, UK",
      rate: "£100",
      rating: 4.8,
      reviews: 156,
      img: chefMaria,
      specialties: ["Greek", "Spanish Tapas", "Healthy Cooking"],
      bio: "Passionate about Mediterranean cuisine and healthy eating, I create vibrant dishes using fresh, seasonal ingredients. My cooking celebrates the sun-soaked flavors of Greece and Spain.",
      experience: "10+ years",
      languages: ["English", "Spanish", "Greek"],
      badges: ["Top Rated", "Healthy Options"],
      menus: [
        { name: "Greek Mezze Feast", price: "£420", description: "Traditional Greek sharing plates", serves: "6-8 people" },
        { name: "Spanish Tapas Night", price: "£380", description: "Authentic Spanish tapas experience", serves: "4-6 people" },
        { name: "Mediterranean Wellness", price: "£450", description: "Healthy Mediterranean 4-course dinner", serves: "4-6 people" },
      ],
      foodImages: [medMezze, medTapas, medMezze, medTapas],
      availability: ["2025-01-18", "2025-01-21", "2025-01-25", "2025-01-28"],
      customerReviews: [
        { name: "David W.", rating: 5, comment: "Maria's Greek food is authentic and delicious!", date: "Dec 2024" },
        { name: "Sophie B.", rating: 5, comment: "Perfect for our party. Everyone loved the tapas!", date: "Nov 2024" },
      ],
      cancellationPolicy: "Full refund up to 6 days before your event",
    },
  };

  const chef = chefData[chefId || ""] || chefData["emma-thompson"];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chefs
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chef Header */}
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img src={chef.img} alt={chef.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{chef.name}</h1>
                      <p className="text-xl text-muted-foreground flex items-center gap-2">
                        <ChefHat className="h-5 w-5" />
                        {chef.cuisine}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4" />
                        {chef.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-2xl font-bold">{chef.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({chef.reviews} reviews)</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {chef.badges.map((badge: string, i: number) => (
                        <Badge key={i} variant="secondary">{badge}</Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {chef.specialties.map((specialty: string, i: number) => (
                        <Badge key={i} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* About */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About {chef.name.split(' ')[0]}</h2>
                <p className="text-muted-foreground">{chef.bio}</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-semibold">{chef.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Languages</p>
                      <p className="font-semibold">{chef.languages.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Food Gallery */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Food Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {chef.foodImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Food ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Menus */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Available Menus</h2>
                <div className="space-y-4">
                  {chef.menus.map((menu: any, i: number) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{menu.name}</h3>
                          <p className="text-muted-foreground">{menu.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">Serves: {menu.serves}</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">{menu.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reviews */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
                <div className="space-y-6">
                  {chef.customerReviews.map((review: any, i: number) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-semibold">{review.name}</span>
                        <span className="text-sm text-muted-foreground">• {review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {i < chef.customerReviews.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-4xl font-bold text-primary">{chef.rate}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Response Time</p>
                      <p className="text-sm text-muted-foreground">Usually within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Cancellation Policy</p>
                      <p className="text-sm text-muted-foreground">{chef.cancellationPolicy}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Select a Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                <Button size="lg" className="w-full mb-3">
                  Request to Book
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  You won't be charged yet. Review details before confirming.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default ChefDetail;
