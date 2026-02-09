import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Star, Heart, MapPin, Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import chefEmma from '@/assets/chef-emma.jpg';
import chefDavid from '@/assets/chef-david.jpg';
import chefMaria from '@/assets/chef-maria.jpg';
import chefJames from '@/assets/chef-james.jpg';
import chefSofia from '@/assets/chef-sofia.jpg';
import chefOliver from '@/assets/chef-oliver.jpg';

const chefs = [
  {
    id: 'emma-thompson',
    name: 'Chef Emma',
    cuisine: 'Italian',
    bio: 'Specializes in Italian cuisine with 10 years of experience creating authentic pasta and risotto dishes.',
    image: chefEmma,
    location: 'London',
    rating: 4.9,
  },
  {
    id: 'david-rodriguez',
    name: 'Chef David',
    cuisine: 'Asian Fusion',
    bio: 'Asian fusion expert with Michelin training. Passionate about blending Eastern and Western flavors.',
    image: chefDavid,
    location: 'Manchester',
    rating: 5.0,
  },
  {
    id: 'maria-santos',
    name: 'Chef Maria',
    cuisine: 'Mediterranean',
    bio: 'Mediterranean flavors specialist focused on healthy, vibrant cooking with fresh ingredients.',
    image: chefMaria,
    location: 'Birmingham',
    rating: 4.8,
  },
  {
    id: 'james-wilson',
    name: 'Chef James',
    cuisine: 'French',
    bio: 'French fine dining expert and pastry master. Creating elegant experiences for special occasions.',
    image: chefJames,
    location: 'Edinburgh',
    rating: 4.9,
  },
  {
    id: 'sofia-chen',
    name: 'Chef Sofia',
    cuisine: 'Pan-Asian',
    bio: 'Pan-Asian cuisine specialist and Dim Sum expert. Bringing authentic Asian street food to your home.',
    image: chefSofia,
    location: 'Bristol',
    rating: 4.7,
  },
  {
    id: 'oliver-martinez',
    name: 'Chef Oliver',
    cuisine: 'Modern British',
    bio: 'Modern British chef and farm-to-table advocate. Celebrating local, seasonal ingredients.',
    image: chefOliver,
    location: 'Leeds',
    rating: 4.9,
  },
];

const cuisineTypes = ['All', 'Italian', 'Asian Fusion', 'Mediterranean', 'French', 'Pan-Asian', 'Modern British'];
const locations = ['All', 'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds'];
const ratings = ['All', '5.0', '4.9+', '4.8+', '4.7+'];

export default function FindChefs() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likedChefs, setLikedChefs] = useState<string[]>([]);
  
  // Filter states
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Filtered chefs
  const filteredChefs = useMemo(() => {
    return chefs.filter(chef => {
      const matchesCuisine = cuisineFilter === 'All' || chef.cuisine === cuisineFilter;
      const matchesLocation = locationFilter === 'All' || chef.location === locationFilter;
      
      let matchesRating = true;
      if (ratingFilter !== 'All') {
        const minRating = parseFloat(ratingFilter.replace('+', ''));
        matchesRating = chef.rating >= minRating;
      }
      
      return matchesCuisine && matchesLocation && matchesRating;
    });
  }, [cuisineFilter, locationFilter, ratingFilter]);

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
    setLikedChefs((prev) => [...prev, filteredChefs[index].id]);
    navigate(`/chef/${filteredChefs[index].id}`);
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
                          src={nextNextChef.image}
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
                          src={nextChef.image}
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
                      <Card className="w-full h-full overflow-hidden rounded-2xl shadow-xl border-border cursor-grab active:cursor-grabbing">
                        <div className="relative h-[340px] overflow-hidden">
                          <img
                            src={currentChef.image}
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
                          <h2 className="text-xl font-bold text-foreground">{currentChef.name}</h2>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{currentChef.bio}</p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {currentChef.location}, UK
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
                              <Star className="h-6 w-6 text-blue-500" />
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
