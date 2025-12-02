import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Star, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    bio: 'Specializes in Italian cuisine | 10 years of experience',
    image: chefEmma,
    location: 'London, UK',
    rating: 4.9,
  },
  {
    id: 'david-rodriguez',
    name: 'Chef David',
    bio: 'Asian fusion expert | Michelin-trained',
    image: chefDavid,
    location: 'Manchester, UK',
    rating: 5.0,
  },
  {
    id: 'maria-santos',
    name: 'Chef Maria',
    bio: 'Mediterranean flavors | Healthy cooking specialist',
    image: chefMaria,
    location: 'Birmingham, UK',
    rating: 4.8,
  },
  {
    id: 'james-wilson',
    name: 'Chef James',
    bio: 'French fine dining | Pastry master',
    image: chefJames,
    location: 'Edinburgh, UK',
    rating: 4.9,
  },
  {
    id: 'sofia-chen',
    name: 'Chef Sofia',
    bio: 'Pan-Asian cuisine | Dim Sum expert',
    image: chefSofia,
    location: 'Bristol, UK',
    rating: 4.7,
  },
  {
    id: 'oliver-martinez',
    name: 'Chef Oliver',
    bio: 'Modern British | Farm-to-table advocate',
    image: chefOliver,
    location: 'Leeds, UK',
    rating: 4.9,
  },
];

export default function FindChefs() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likedChefs, setLikedChefs] = useState<string[]>([]);

  const handleNext = (liked: boolean = false) => {
    if (liked) {
      setLikedChefs((prev) => [...prev, chefs[index].id]);
    }
    setDirection(liked ? 1 : -1);
    setIndex((prev) => (prev + 1) % chefs.length);
  };

  const handleSuperLike = () => {
    setLikedChefs((prev) => [...prev, chefs[index].id]);
    setDirection(0);
    setIndex((prev) => (prev + 1) % chefs.length);
  };

  const currentChef = chefs[index];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : direction < 0 ? -300 : 0,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : direction > 0 ? -300 : 0,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Chef</h1>
          <p className="text-muted-foreground">Swipe to discover amazing chefs near you</p>
        </div>

        <div className="relative w-full max-w-[340px] h-[520px]">
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
            >
              <Card className="w-full h-full overflow-hidden rounded-2xl shadow-xl border-border">
                <div className="relative h-[320px] overflow-hidden">
                  <img
                    src={currentChef.image}
                    alt={currentChef.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-1 text-white">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{currentChef.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 text-center bg-card">
                  <h2 className="text-xl font-bold text-foreground">{currentChef.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentChef.bio}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentChef.location}
                  </p>
                  
                  <div className="flex justify-center gap-4 mt-5">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-14 w-14 rounded-full border-2 border-destructive hover:bg-destructive/10"
                      onClick={() => handleNext(false)}
                    >
                      <X className="h-6 w-6 text-destructive" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-14 w-14 rounded-full border-2 border-secondary hover:bg-secondary/10"
                      onClick={handleSuperLike}
                    >
                      <Star className="h-6 w-6 text-secondary" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-14 w-14 rounded-full border-2 border-green-500 hover:bg-green-500/10"
                      onClick={() => handleNext(true)}
                    >
                      <Heart className="h-6 w-6 text-green-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {likedChefs.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              You've liked {likedChefs.length} chef{likedChefs.length > 1 ? 's' : ''}!
            </p>
            <Link to="/chefs">
              <Button variant="default">View All Chefs</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
