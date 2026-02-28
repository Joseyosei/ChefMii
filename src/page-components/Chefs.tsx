import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ChefHat, Search, Navigation, Heart, Filter, X, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { globalChefs, cuisineTypes, dietaryOptions as DIETARY_OPTIONS } from "@/data/globalChefs";

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

  const Chefs = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

  const serviceSlug = searchParams.get('service');
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState(24);
    
    useEffect(() => {
      const query = searchParams.get('q');
      if (query) {
        setSearchQuery(query);
      }
    }, [searchParams]);
    
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
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('chef_id')
      .eq('user_id', user.id);
    if (data) {
      setFavorites(data.map(f => f.chef_id));
    }
  };

  const toggleFavorite = async (e: React.MouseEvent, chefId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({ title: 'Please login to save favorites', variant: 'destructive' });
      return;
    }

    const isFavorite = favorites.includes(chefId);
    
    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('chef_id', chefId);
      
      if (!error) {
        setFavorites(prev => prev.filter(id => id !== chefId));
        toast({ title: 'Removed from favorites' });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, chef_id: chefId });
      
      if (!error) {
        setFavorites(prev => [...prev, chefId]);
        toast({ title: 'Added to favorites' });
      }
    }
  };

  const getDistanceFromUser = (chefLat: number, chefLng: number) => {
    if (!userLocation) return null;
    return calculateDistance(userLocation.lat, userLocation.lng, chefLat, chefLng);
  };

  const toggleDietary = (dietaryId: string) => {
    setSelectedDietary(prev => 
      prev.includes(dietaryId) 
        ? prev.filter(d => d !== dietaryId)
        : [...prev, dietaryId]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisine(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const clearFilters = () => {
    setSelectedDietary([]);
    setSelectedCuisine([]);
    setSearchQuery("");
  };

  const filteredChefs = useMemo(() => {
    return globalChefs.filter(chef => {
      const query = (searchQuery || "").toLowerCase();
      const serviceQuery = (serviceSlug || "").toLowerCase();
      
      const matchesQuery = !query || 
        chef.name.toLowerCase().includes(query) ||
        chef.cuisine.toLowerCase().includes(query) ||
        chef.location.toLowerCase().includes(query) ||
        chef.specialties.some(s => s.toLowerCase().includes(query)) ||
        chef.bio.toLowerCase().includes(query);

      const matchesService = !serviceQuery ||
        chef.services.includes(serviceQuery) ||
        chef.specialties.some(s => s.toLowerCase().includes(serviceQuery.replace(/-/g, ' '))) ||
        chef.bio.toLowerCase().includes(serviceQuery.replace(/-/g, ' '));
      
      const matchesDietary = selectedDietary.length === 0 || 
        selectedDietary.every(d => chef.dietaryOptions.includes(d));
      
      const matchesCuisine = selectedCuisine.length === 0 ||
        selectedCuisine.some(c => chef.cuisineType.toLowerCase().includes(c.toLowerCase()));
      
      return matchesQuery && matchesService && matchesDietary && matchesCuisine;
    });
  }, [searchQuery, serviceSlug, selectedDietary, selectedCuisine]);

  const sortedChefs = useMemo(() => {
    if (!userLocation) return filteredChefs;
    return [...filteredChefs].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [filteredChefs, userLocation]);

  const visibleChefs = sortedChefs.slice(0, visibleCount);
  const activeFiltersCount = selectedDietary.length + selectedCuisine.length;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-6 md:py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Food, chefs, cuisine" 
                  className="h-12 pl-12 pr-4 rounded-full border-2 border-muted bg-background shadow-sm focus-visible:ring-0 focus-visible:border-foreground text-base w-full"
                />
              </div>
              <Button 
                variant={showFilters ? "default" : "outline"} 
                size="lg"
                className="rounded-full h-12 px-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                )}
              </Button>
            </div>

            {showFilters && (
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Dietary Requirements</p>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map(option => (
                      <Badge 
                        key={option.id}
                        variant={selectedDietary.includes(option.id) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => toggleDietary(option.id)}
                      >
                        {option.label}
                        {selectedDietary.includes(option.id) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Cuisine Type</p>
                  <div className="flex flex-wrap gap-2">
                    {cuisineTypes.map(cuisine => (
                      <Badge 
                        key={cuisine}
                        variant={selectedCuisine.includes(cuisine) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90 transition-colors"
                        onClick={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                        {selectedCuisine.includes(cuisine) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDietary.map(d => (
                  <Badge key={d} variant="secondary" className="gap-1">
                    {DIETARY_OPTIONS.find(o => o.id === d)?.label}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleDietary(d)} />
                  </Badge>
                ))}
                {selectedCuisine.map(c => (
                  <Badge key={c} variant="secondary" className="gap-1">
                    {c}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCuisine(c)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {filteredChefs.length} chefs {filteredChefs.length !== globalChefs.length ? 'matching your criteria' : 'available worldwide'}
            </h1>
            <p className="text-muted-foreground mt-1">
              From {cuisineTypes.length} different cuisines across 40+ cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {visibleChefs.map((chef) => {
              const distance = getDistanceFromUser(chef.lat, chef.lng);
              const isFavorite = favorites.includes(chef.id);
              return (
            <Link 
                key={chef.id}
                to={`/chef/${chef.id}`}
                className="block group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-none shadow-sm group">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img src={chef.img} alt={chef.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  {distance !== null && (
                    <div className="absolute bottom-3 left-3 bg-white text-black px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 shadow">
                      <Navigation className="h-3 w-3" />
                      {distance.toFixed(0)} mi
                    </div>
                  )}
                  <button 
                    onClick={(e) => toggleFavorite(e, chef.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-base">{chef.name}</h3>
                    <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                      <Star className="h-3 w-3 fill-foreground" />
                      <span className="text-sm font-medium">{chef.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {chef.cuisine}
                  </p>
                  
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {chef.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {chef.dietaryOptions.slice(0, 2).map(d => (
                      <Badge key={d} variant="outline" className="text-xs py-0">
                        {DIETARY_OPTIONS.find(o => o.id === d)?.label || d}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-muted">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="font-bold text-primary">{chef.rate}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/booking?chef=${chef.id}&name=${encodeURIComponent(chef.name)}${serviceSlug ? `&service=${serviceSlug}` : ''}`);
                      }}
                    >
                      <Zap className="h-4 w-4 fill-current" />
                      Instant Book
                    </Button>
                  </div>
                  </div>
                </Card>
              </Link>
                );
              })}
            </div>

          {visibleCount < filteredChefs.length && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setVisibleCount(prev => prev + 24)}
              >
                Load More Chefs ({filteredChefs.length - visibleCount} remaining)
              </Button>
            </div>
          )}

          {filteredChefs.length === 0 && (
            <div className="text-center py-16">
              <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No chefs found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are You a Professional Chef?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">
            Join ChefMii and connect with clients looking for your culinary expertise
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">Apply to Become a Chef</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chefs;
