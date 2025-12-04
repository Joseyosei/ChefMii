import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import chefEmma from '@/assets/chef-emma.jpg';
import chefDavid from '@/assets/chef-david.jpg';
import chefMaria from '@/assets/chef-maria.jpg';
import chefJames from '@/assets/chef-james.jpg';
import chefSofia from '@/assets/chef-sofia.jpg';
import chefOliver from '@/assets/chef-oliver.jpg';

interface MediaPost {
  id: string;
  chefId: string;
  chefName: string;
  chefImage: string;
  location: string;
  description: string;
  videoUrl: string;
  posterImage: string;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

const mediaPosts: MediaPost[] = [
  {
    id: '1',
    chefId: 'emma-thompson',
    chefName: 'Chef Emma',
    chefImage: chefEmma,
    location: 'London, UK',
    description: 'Making fresh pasta from scratch! 🍝 The secret is in the dough... #ItalianCuisine #HomeMade',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefEmma,
    likes: 58400,
    comments: 751,
    saves: 2755,
    shares: 845,
  },
  {
    id: '2',
    chefId: 'david-rodriguez',
    chefName: 'Chef David',
    chefImage: chefDavid,
    location: 'Manchester, UK',
    description: 'Sushi rolling masterclass 🍣 Perfect for date night! #AsianFusion #SushiArt',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefDavid,
    likes: 42300,
    comments: 523,
    saves: 1890,
    shares: 612,
  },
  {
    id: '3',
    chefId: 'maria-santos',
    chefName: 'Chef Maria',
    chefImage: chefMaria,
    location: 'Birmingham, UK',
    description: 'Mediterranean mezze platter 🫒 Fresh, healthy, and delicious! #Mediterranean #HealthyEating',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefMaria,
    likes: 35600,
    comments: 412,
    saves: 1456,
    shares: 389,
  },
  {
    id: '4',
    chefId: 'james-wilson',
    chefName: 'Chef James',
    chefImage: chefJames,
    location: 'Edinburgh, UK',
    description: 'French soufflé perfection 🥮 It\'s all about timing! #FrenchCuisine #FineDining',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefJames,
    likes: 67200,
    comments: 892,
    saves: 3210,
    shares: 1045,
  },
  {
    id: '5',
    chefId: 'sofia-chen',
    chefName: 'Chef Sofia',
    chefImage: chefSofia,
    location: 'Bristol, UK',
    description: 'Dim sum making tutorial 🥟 Family recipe passed down generations! #DimSum #AsianFood',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefSofia,
    likes: 29800,
    comments: 345,
    saves: 1123,
    shares: 267,
  },
  {
    id: '6',
    chefId: 'oliver-martinez',
    chefName: 'Chef Oliver',
    chefImage: chefOliver,
    location: 'Leeds, UK',
    description: 'Farm-to-table British classics 🌿 Supporting local farmers! #ModernBritish #Sustainable',
    videoUrl: '/videos/hero-video.mp4',
    posterImage: chefOliver,
    likes: 44500,
    comments: 567,
    saves: 1678,
    shares: 423,
  },
];

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default function ChefMedia() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPost = mediaPosts[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, isPlaying]);

  const goToNext = () => {
    if (currentIndex < mediaPosts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleChefClick = (chefId: string) => {
    navigate(`/chef/${chefId}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex justify-center">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 p-6 text-white">
          <nav className="space-y-4">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 text-lg">
              <User className="mr-3 h-5 w-5" />
              For You
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-white/10 text-lg">
              <Heart className="mr-3 h-5 w-5" />
              Following
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:bg-white/10 text-lg">
              <Bookmark className="mr-3 h-5 w-5" />
              Saved
            </Button>
          </nav>
          
          <div className="mt-auto text-xs text-white/40 space-y-1">
            <p>© 2024 ChefMii</p>
            <p>Terms & Policies</p>
          </div>
        </aside>

        {/* Main Video Feed */}
        <main 
          ref={containerRef}
          className="relative w-full max-w-[500px] h-[calc(100vh-80px)] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPost.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              {/* Video Container */}
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={currentPost.videoUrl}
                  poster={currentPost.posterImage}
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  onClick={togglePlay}
                />
                
                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-20 w-20 text-white/80" />
                  </div>
                )}

                {/* Top Controls */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Right Side Actions */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
                  {/* Chef Avatar */}
                  <div className="relative">
                    <Avatar 
                      className="h-12 w-12 border-2 border-white cursor-pointer"
                      onClick={() => handleChefClick(currentPost.chefId)}
                    >
                      <AvatarImage src={currentPost.chefImage} alt={currentPost.chefName} />
                      <AvatarFallback>{currentPost.chefName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary rounded-full p-0.5">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Like Button */}
                  <button 
                    className="flex flex-col items-center gap-1"
                    onClick={() => toggleLike(currentPost.id)}
                  >
                    <div className={`p-2 rounded-full ${likedPosts.includes(currentPost.id) ? 'text-red-500' : 'text-white'}`}>
                      <Heart className={`h-8 w-8 ${likedPosts.includes(currentPost.id) ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-white text-xs font-semibold">
                      {formatNumber(currentPost.likes + (likedPosts.includes(currentPost.id) ? 1 : 0))}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full text-white">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(currentPost.comments)}</span>
                  </button>

                  {/* Save Button */}
                  <button 
                    className="flex flex-col items-center gap-1"
                    onClick={() => toggleSave(currentPost.id)}
                  >
                    <div className={`p-2 rounded-full ${savedPosts.includes(currentPost.id) ? 'text-yellow-500' : 'text-white'}`}>
                      <Bookmark className={`h-8 w-8 ${savedPosts.includes(currentPost.id) ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-white text-xs font-semibold">
                      {formatNumber(currentPost.saves + (savedPosts.includes(currentPost.id) ? 1 : 0))}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full text-white">
                      <Share2 className="h-8 w-8" />
                    </div>
                    <span className="text-white text-xs font-semibold">{formatNumber(currentPost.shares)}</span>
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-20 text-white">
                  <div 
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                    onClick={() => handleChefClick(currentPost.chefId)}
                  >
                    <span className="font-bold text-lg hover:underline">{currentPost.chefName}</span>
                    <span className="text-sm text-white/70">· {currentPost.location}</span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2">{currentPost.description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation Arrows - Desktop */}
        <div className="hidden lg:flex flex-col items-center justify-center w-20 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={goToNext}
            disabled={currentIndex === mediaPosts.length - 1}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-sm disabled:opacity-30"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/20 text-white backdrop-blur-sm disabled:opacity-30"
          onClick={goToNext}
          disabled={currentIndex === mediaPosts.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1">
        {mediaPosts.map((_, idx) => (
          <button
            key={idx}
            className={`w-1 h-8 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
