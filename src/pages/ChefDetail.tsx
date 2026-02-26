import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MapPin, ChefHat, Calendar as CalendarIcon, Award, Users, Clock, Shield, ArrowLeft, Share2, Heart, Navigation, MessageCircle, Send } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import ChefMediaGrid from "@/components/ChefMediaGrid";
import { getChefById, Chef } from "@/data/globalChefs";

const ChefMap = lazy(() => import("@/components/ChefMap"));

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const ChefDetail = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFollowing, setIsFollowing] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [message, setMessage] = useState("");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const [chef, setChef] = useState<Chef | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const staticChef = getChefById(chefId || "");
        if (staticChef) {
          setChef(staticChef);
          setLoading(false);
          return;
        }

        // Fetch from Supabase if not found in static data
        const { data: chefProfile, error: profileError } = await supabase
          .from("chef_profiles")
          .select("*, profiles(full_name)")
          .eq("user_id", chefId)
          .single();

        if (profileError || !chefProfile) {
          console.error("Error fetching chef profile:", profileError);
          setChef(null);
        } else {
          // Map database data to Chef type
          const mappedChef: Chef = {
            id: chefProfile.user_id,
            name: chefProfile.profiles?.full_name || "Chef",
            cuisine: chefProfile.cuisine_types?.[0] || "International",
            location: chefProfile.location || "Global",
            rating: Number(chefProfile.rating) || 5.0,
            reviews: chefProfile.total_reviews || 0,
            rate: `£${chefProfile.hourly_rate}`,
            img: chefProfile.avatar_url || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",
            bio: chefProfile.bio || "No bio available.",
            experience: `${chefProfile.years_experience || 5}+ years`,
            specialties: chefProfile.specialties || [],
            languages: ["English"],
            badges: chefProfile.verification_badges || ["Verified"],
            certifications: chefProfile.certifications || [],
            lat: Number(chefProfile.latitude) || 51.5074,
            lng: Number(chefProfile.longitude) || -0.1278,
          };
          setChef(mappedChef);
        }
      } catch (err) {
        console.error("Chef fetch error:", err);
        setChef(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChef();
  }, [chefId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 51.5074, lng: -0.1278 });
        }
      );
    }
  }, []);

  useEffect(() => {
    async function checkFollow() {
      if (!user || !chefId) return;
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('chef_id', chefId)
        .single();
      setIsFollowing(!!data);
    }
    checkFollow();
  }, [user, chefId]);

  if (!chef) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Chef Not Found</h1>
            <p className="text-muted-foreground mb-6">The chef you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/chefs')}>Browse All Chefs</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getDistanceFromUser = () => {
    if (!userLocation || !chef.lat || !chef.lng) return null;
    return calculateDistance(userLocation.lat, userLocation.lng, chef.lat, chef.lng);
  };

  const distance = getDistanceFromUser();

  const toggleFollow = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to follow chefs" });
      return;
    }
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('chef_id', chefId);
      setIsFollowing(false);
      toast({ title: "Unfollowed", description: `You unfollowed ${chef.name}` });
    } else {
      await supabase.from('follows').insert([{ follower_id: user.id, chef_id: chefId }]);
      setIsFollowing(true);
      toast({ title: "Following", description: `You are now following ${chef.name}` });
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link Copied", description: "Chef profile link copied to clipboard" });
  };

  const handleRequestToBook = () => {
    if (!user) {
      navigate("/register");
      return;
    }
    if (!selectedDate) {
      toast({ title: "Select Date", description: "Please select a date for your booking", variant: "destructive" });
      return;
    }
    navigate(`/booking?chef=${chef.id}&name=${encodeURIComponent(chef.name)}&date=${selectedDate.toISOString()}`);
  };

  const handleSendMessage = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!message.trim()) {
      toast({ title: "Empty Message", description: "Please enter a message", variant: "destructive" });
      return;
    }
    
    toast({ title: "Message Sent", description: `Your message has been sent to ${chef.name}` });
    setMessage("");
    setIsMessageDialogOpen(false);
  };

  const handleMessageClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsMessageDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chefs
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-8">
                    <div className="relative group">
                      <img 
                        src={chef.img} 
                        alt={chef.name} 
                        className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover shadow-xl border-4 border-background bg-muted"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-primary text-white p-2 rounded-xl shadow-lg">
                        <Award className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-4xl font-bold tracking-tight">{chef.name}</h1>
                          <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                            <ChefHat className="h-5 w-5 text-primary" />
                            {chef.cuisine}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full shadow-sm">
                            <Share2 className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant={isFollowing ? "default" : "outline"} 
                            onClick={toggleFollow}
                            className="rounded-full shadow-sm gap-2"
                          >
                            <Heart className={`h-5 w-5 ${isFollowing ? "fill-current" : ""}`} />
                            {isFollowing ? "Following" : "Follow"}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full shadow-sm border">
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          <span className="font-bold">{chef.rating}</span>
                          <span className="text-muted-foreground text-sm">({chef.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full shadow-sm border text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4" />
                          {chef.location}
                        </div>
                        {distance !== null && (
                          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full shadow-sm border border-primary/20 text-primary text-sm font-medium">
                            <Navigation className="h-4 w-4" />
                            {distance.toFixed(1)} mi away
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {chef.badges?.map((badge: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-none">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-14 bg-transparent p-0 gap-8">
                  <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 h-full font-semibold">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 h-full font-semibold">
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 h-full font-semibold">
                    Reviews
                  </TabsTrigger>
                    <TabsTrigger value="menus" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 h-full font-semibold">
                      Menus
                    </TabsTrigger>
                    <TabsTrigger value="trust" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 h-full font-semibold">
                      Trust & Safety
                    </TabsTrigger>
                  </TabsList>

                <TabsContent value="about" className="pt-6 space-y-8">
                  <div className="prose prose-stone max-w-none">
                    <h3 className="text-2xl font-bold mb-4">Chef Bio</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {chef.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-none bg-accent/30 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-background rounded-2xl shadow-sm text-primary">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Experience</p>
                          <p className="text-xl font-bold">{chef.experience}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6 border-none bg-accent/30 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-background rounded-2xl shadow-sm text-primary">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Languages</p>
                          <p className="text-xl font-bold">{chef.languages?.join(", ")}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {chef.specialties.map((specialty, i) => (
                        <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-primary" />
                      Chef Location
                    </h3>
                    <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
                      <Suspense fallback={<div className="h-[300px] bg-muted animate-pulse rounded-2xl" />}>
                        <ChefMap 
                          chefs={[{
                            id: chef.id,
                            name: chef.name,
                            cuisine: chef.cuisine,
                            location: chef.location,
                            lat: chef.lat,
                            lng: chef.lng,
                            rating: chef.rating,
                            rate: chef.rate,
                            img: chef.img
                          }]}
                          center={[chef.lat, chef.lng]}
                          zoom={13}
                        />
                      </Suspense>
                    </Card>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      * Exact location will be shared after booking confirmation
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6">Food Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {chef.foodImages?.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md group">
                          <img 
                            src={img} 
                            alt={`Food ${i + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="pt-6">
                  <h3 className="text-2xl font-bold mb-6">Uploaded Videos</h3>
                  <ChefMediaGrid chefId={chef.id} />
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  <h3 className="text-2xl font-bold mb-6">What people are saying</h3>
                  <div className="space-y-6">
                    {chef.customerReviews?.map((review, i: number) => (
                      <Card key={i} className="p-6 border-none bg-accent/20 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                              {review.name[0]}
                            </div>
                            <div>
                              <p className="font-bold">{review.name}</p>
                              <div className="flex">
                                {[...Array(review.rating)].map((_, j) => (
                                  <Star key={j} className="h-3 w-3 fill-primary text-primary" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                  <TabsContent value="menus" className="pt-6">
                    <h3 className="text-2xl font-bold mb-6">Signature Menus</h3>
                    <div className="grid gap-6">
                      {chef.menus?.map((menu, i: number) => (
                        <Card key={i} className="group hover:border-primary transition-colors border-2 shadow-sm overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto">
                              <img 
                                src={menu.image} 
                                alt={menu.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <CardContent className="p-6 flex-1">
                              <div className="flex flex-col h-full justify-between">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{menu.name}</h4>
                                    <div className="text-2xl font-black text-primary bg-primary/5 px-4 py-1 rounded-xl">
                                      {menu.price}
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground">{menu.description}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>Serves: {menu.serves}</span>
                                  </div>
                                  {menu.dishes && menu.dishes.length > 0 && (
                                    <div className="pt-3 border-t">
                                      <p className="text-sm font-semibold mb-2">Menu Includes:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {menu.dishes.map((dish, j) => (
                                          <Badge key={j} variant="secondary" className="text-xs">
                                            {dish}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="trust" className="pt-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="prose prose-stone max-w-none">
                          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-500" />
                            Verification Status
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            At ChefMii, your safety is our top priority. All chefs undergo a rigorous vetting process before being allowed to list their services.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold">Identity Verified</p>
                              <p className="text-sm text-muted-foreground">Passport and proof of address verified</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                              <Star className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold">Enhanced DBS Checked</p>
                              <p className="text-sm text-muted-foreground">Clear criminal record background check</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                          <Award className="h-6 w-6 text-yellow-500" />
                          Certifications
                        </h3>
                        <div className="grid gap-3">
                          {chef.certifications?.length ? chef.certifications.map((cert, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary transition-colors">
                              <Award className="h-4 w-4 text-primary shrink-0" />
                              <span className="text-sm font-medium">{cert}</span>
                            </div>
                          )) : (
                            <>
                              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                                <Award className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">Level 2 Food Safety & Hygiene</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                                <Shield className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">Public Liability Insurance (£5M)</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Card className="p-8 border-none bg-accent/30 shadow-sm rounded-3xl">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Shield className="h-10 w-10" />
                        </div>
                        <div className="text-center md:text-left">
                          <h4 className="text-xl font-bold mb-2">Our Trust Guarantee</h4>
                          <p className="text-muted-foreground">
                            Every booking is protected by our ChefMii Shield. We handle all payments securely and offer comprehensive insurance coverage for your peace of mind.
                          </p>
                        </div>
                        <Button className="md:ml-auto rounded-2xl px-8 h-12">Learn More</Button>
                      </div>
                    </Card>
                  </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-none shadow-2xl sticky top-24 overflow-hidden">
                <div className="bg-primary p-6 text-white">
                  <p className="text-sm opacity-90 uppercase tracking-widest font-bold">Starting from</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-5xl font-black">{chef.rate}</span>
                    <span className="text-lg opacity-80">/ person</span>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Fast Responder</p>
                        <p className="text-sm text-muted-foreground">Usually replies in 2 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Flexible Cancellation</p>
                        <p className="text-sm text-muted-foreground">Full refund up to 7 days before</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-base font-bold mb-4 flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Select your event date
                    </div>
                    <div className="border rounded-2xl p-4 bg-accent/5 shadow-inner">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full text-lg h-14 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                      onClick={handleRequestToBook}
                    >
                      Request to Book
                    </Button>
                    
                    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="w-full h-14 rounded-2xl"
                          onClick={handleMessageClick}
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message {chef.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Textarea
                            placeholder={`Hi ${chef.name}, I'm interested in booking you for an event...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                          />
                          <Button className="w-full" onClick={handleSendMessage}>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="text-xs text-muted-foreground text-center font-medium">
                    You won't be charged yet. Payment only after chef confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChefDetail;
