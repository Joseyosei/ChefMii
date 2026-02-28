import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Star, Heart, MapPin, Filter, RotateCcw, ChevronLeft, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { globalChefs, cuisineTypes as globalCuisineTypes } from '@/data/globalChefs';

const cuisineTypes = ['All', ...globalCuisineTypes];
const locations = ['All', 'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds', 'New York', 'Paris', 'Tokyo'];
const ratings = ['All', '5.0', '4.9+', '4.8+', '4.7+'];

export default function FindChefs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likedChefs, setLikedChefs] = useState<string[]>([]);
  
  // Filter states
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Filtered chefs
  const filteredChefs = useMemo(() => {
    const serviceQuery = (serviceSlug || "").toLowerCase();
    
    return globalChefs.filter(chef => {
      const matchesService = !serviceQuery ||
        chef.services.includes(serviceQuery) ||
        chef.specialties.some(s => s.toLowerCase().includes(serviceQuery.replace(/-/g, ' '))) ||
        chef.bio.toLowerCase().includes(serviceQuery.replace(/-/g, ' '));
      
      const matchesCuisine = cuisineFilter === 'All' || chef.cuisineType === cuisineFilter;
      const matchesLocation = locationFilter === 'All' || chef.location.includes(locationFilter);
      
      let matchesRating = true;
      if (ratingFilter !== 'All') {
        const minRating = parseFloat(ratingFilter.replace('+', ''));
        matchesRating = chef.rating >= minRating;
      }
      
      return matchesService && matchesCuisine && matchesLocation && matchesRating;
    });
  }, [cuisineFilter, locationFilter, ratingFilter, serviceSlug]);

  const resetFilters = () => {
    setCuisineFilter('All');
    setLocationFilter('All');
    setRatingFilter('All');
    setIndex(0);
  };

  const handleNext = (liked: boolean = false) => {
    if (filteredChefs.length === 0) return;
    
    if (liked) {
      setLikedChefs((prev) => [...prev, filteredChefs[index].id]);
      navigate(`/chef/${filteredChefs[index].id}`);
      return;
    }
    setDirection(1);
    setIndex((prev) => (prev + 1) % filteredChefs.length);
  };

  const handlePrevious = () => {
    if (filteredChefs.length === 0 || index === 0) return;
    setDirection(-1);
    setIndex((prev) => prev - 1);
  };

    const handleSuperLike = () => {
      if (filteredChefs.length === 0) return;
      const chef = filteredChefs[index];
      navigate(`/booking?chef=${chef.id}&name=${encodeURIComponent(chef.name)}${serviceSlug ? `&service=${serviceSlug}` : ''}`);
    };

  // Reset index when filters change
  useMemo(() => {
    setIndex(0);
  }, [cuisineFilter, locationFilter, ratingFilter]);

  const currentChef = filteredChefs[index];
  const nextChef = filteredChefs[(index + 1) % filteredChefs.length];
  const nextNextChef = filteredChefs[(index + 2) % filteredChefs.length];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : direction < 0 ? -300 : 0,
      opacity: 0,
      scale: 0.9,
      rotateZ: direction > 0 ? 10 : direction < 0 ? -10 : 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : direction > 0 ? -300 : 0,
      opacity: 0,
      scale: 0.9,
      rotateZ: direction < 0 ? 10 : direction > 0 ? -10 : 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Find Your Chef</h1>
          <p className="text-muted-foreground">Swipe to discover amazing chefs near you</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 max-w-xl">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          
          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map(rating => (
                <SelectItem key={rating} value={rating}>{rating === 'All' ? 'All' : `★ ${rating}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} found
        </p>

        {filteredChefs.length === 0 ? (
          <Card className="w-[400px] md:w-[450px] p-8 text-center">
            <p className="text-muted-foreground mb-4">No chefs match your filters</p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2 hover:bg-muted transition-all hover:scale-110 disabled:opacity-30"
                onClick={handlePrevious}
                disabled={index === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Card Stack Container */}
              <div className="relative w-[400px] md:w-[450px] h-[580px]">
                  {/* Background Cards (Next chefs preview) */}
                  {filteredChefs.length > 2 && nextNextChef && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ zIndex: 1 }}
                      animate={{ scale: 0.85, y: 40, opacity: 0.5 }}
                    >
                      <Card className="w-full h-full overflow-hidden rounded-2xl shadow-lg border-border">
                        <div className="relative h-[280px] overflow-hidden">
                          <img
                            src={nextNextChef.img}
                            alt={nextNextChef.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4 text-center bg-card">
                          <h2 className="text-lg font-bold text-foreground">{nextNextChef.name}</h2>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {filteredChefs.length > 1 && nextChef && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ zIndex: 2 }}
                      animate={{ scale: 0.92, y: 20, opacity: 0.7 }}
                    >
                      <Card className="w-full h-full overflow-hidden rounded-2xl shadow-lg border-border">
                        <div className="relative h-[280px] overflow-hidden">
                          <img
                            src={nextChef.img}
                            alt={nextChef.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4 text-center bg-card">
                          <h2 className="text-lg font-bold text-foreground">{nextChef.name}</h2>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Main Card (Current chef) */}
                  {currentChef && (
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentChef.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{ zIndex: 3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.7}
                        onDragEnd={(e, { offset, velocity }) => {
                          const swipe = offset.x * velocity.x;
                          if (swipe < -10000) {
                            setDirection(-1);
                            setIndex((prev) => (prev + 1) % filteredChefs.length);
                          } else if (swipe > 10000) {
                            handleNext(true);
                          }
                        }}
                      >
                          <Card 
                            className="w-full h-full overflow-hidden rounded-2xl shadow-xl border-border cursor-grab active:cursor-grabbing"
                            onClick={() => navigate(`/chef/${currentChef.id}`)}
                          >
                          <div className="relative h-[340px] overflow-hidden">
                            <img
                              src={currentChef.img}
                              alt={currentChef.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-white font-semibold text-sm">{currentChef.rating}</span>
                            </div>
                            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-white font-medium text-sm">{currentChef.cuisine}</span>
                            </div>
                          </div>
                            <CardContent className="p-4 text-center bg-card">
                              <div className="flex items-center justify-center gap-2">
                                <h2 className="text-xl font-bold text-foreground">{currentChef.name}</h2>
                                {currentChef.badges.includes('Verified Chef') && (
                                  <div className="group relative">
                                    <ShieldCheck className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                      Legally Verified
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{currentChef.bio}</p>
                            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {currentChef.location}
                            </p>
                            
                            <div className="flex justify-center gap-4 mt-4">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-14 w-14 rounded-full border-2 border-destructive hover:bg-destructive/10 transition-all hover:scale-110"
                                onClick={() => handleNext(false)}
                              >
                                <X className="h-6 w-6 text-destructive" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-14 w-14 rounded-full border-2 border-blue-500 hover:bg-blue-500/10 transition-all hover:scale-110"
                                onClick={handleSuperLike}
                              >
                                <Zap className="h-6 w-6 text-blue-500 fill-current" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-14 w-14 rounded-full border-2 border-green-500 hover:bg-green-500/10 transition-all hover:scale-110"
                                onClick={() => handleNext(true)}
                              >
                                <Heart className="h-6 w-6 text-green-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  )}

              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2 hover:bg-muted transition-all hover:scale-110"
                onClick={() => handleNext(false)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1 mt-6">
              {filteredChefs.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === index ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {likedChefs.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  You've liked {likedChefs.length} chef{likedChefs.length > 1 ? 's' : ''}!
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
