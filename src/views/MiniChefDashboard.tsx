import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle, Share2, UserPlus, UserMinus, Play, Search, ChefHat, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

// Import chef images
const chefEmma = "/placeholder.svg?height=600&width=600";
const chefDavid = "/placeholder.svg?height=600&width=600";
const chefMaria = "/placeholder.svg?height=600&width=600";
const chefJames = "/placeholder.svg?height=600&width=600";
const chefSofia = "/placeholder.svg?height=600&width=600";
const chefOliver = "/placeholder.svg?height=600&width=600";

interface ChefProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  badges: string[];
  followers: number;
  specialty: string;
  rating: number;
}

interface ChefVideo {
  id: string;
  title: string;
  url: string;
  category: string;
  thumbnail: string;
  likes: number;
  comments: number;
}

// Mock data for demo
const mockChefs: ChefProfile[] = [
  {
    id: "1",
    name: "Chef Emma Wilson",
    avatar: chefEmma,
    location: "London, UK",
    badges: ["Italian Cuisine", "Pasta Master", "Top Rated"],
    followers: 12500,
    specialty: "Italian",
    rating: 4.9
  },
  {
    id: "2",
    name: "Chef David Chen",
    avatar: chefDavid,
    location: "Manchester, UK",
    badges: ["Asian Fusion", "Sushi Expert"],
    followers: 9800,
    specialty: "Asian",
    rating: 4.8
  },
  {
    id: "3",
    name: "Chef Maria Santos",
    avatar: chefMaria,
    location: "Birmingham, UK",
    badges: ["Mediterranean", "Healthy Cooking"],
    followers: 8200,
    specialty: "Mediterranean",
    rating: 4.7
  },
  {
    id: "4",
    name: "Chef James Brown",
    avatar: chefJames,
    location: "Edinburgh, UK",
    badges: ["French Cuisine", "Fine Dining"],
    followers: 15600,
    specialty: "French",
    rating: 4.9
  },
  {
    id: "5",
    name: "Chef Sofia Lee",
    avatar: chefSofia,
    location: "Bristol, UK",
    badges: ["Dim Sum", "Chinese"],
    followers: 7400,
    specialty: "Chinese",
    rating: 4.6
  },
  {
    id: "6",
    name: "Chef Oliver Green",
    avatar: chefOliver,
    location: "Leeds, UK",
    badges: ["Modern British", "Farm-to-Table"],
    followers: 11200,
    specialty: "British",
    rating: 4.8
  }
];

const mockVideos: Record<string, ChefVideo[]> = {
  "1": [
    { id: "v1", title: "Homemade Pasta Masterclass", url: "/videos/chefs-journey.mp4", category: "Italian", thumbnail: chefEmma, likes: 2340, comments: 156 },
    { id: "v2", title: "Perfect Risotto", url: "/videos/global-flavors.mp4", category: "Italian", thumbnail: chefEmma, likes: 1890, comments: 98 }
  ],
  "2": [
    { id: "v3", title: "Sushi Rolling Tutorial", url: "/videos/global-flavors.mp4", category: "Japanese", thumbnail: chefDavid, likes: 3120, comments: 234 },
    { id: "v4", title: "Thai Green Curry", url: "/videos/kids-cooking.mp4", category: "Thai", thumbnail: chefDavid, likes: 1560, comments: 87 }
  ],
  "3": [
    { id: "v5", title: "Mediterranean Mezze", url: "/videos/chefs-journey.mp4", category: "Mediterranean", thumbnail: chefMaria, likes: 1780, comments: 112 }
  ],
  "4": [
    { id: "v6", title: "French Soufflé Secrets", url: "/videos/global-flavors.mp4", category: "French", thumbnail: chefJames, likes: 4560, comments: 345 }
  ],
  "5": [
    { id: "v7", title: "Dim Sum Workshop", url: "/videos/kids-cooking.mp4", category: "Chinese", thumbnail: chefSofia, likes: 2100, comments: 167 }
  ],
  "6": [
    { id: "v8", title: "British Classics Reimagined", url: "/videos/chefs-journey.mp4", category: "British", thumbnail: chefOliver, likes: 1980, comments: 134 }
  ]
};

export default function MiniChefDashboard() {
  const { user } = useAuth();
  const [selectedChef, setSelectedChef] = useState<ChefProfile | null>(null);
  const [videos, setVideos] = useState<ChefVideo[]>([]);
  const [followingChefs, setFollowingChefs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedChef) {
      setVideos(mockVideos[selectedChef.id] || []);
    }
  }, [selectedChef]);

  useEffect(() => {
    // Fetch followed chefs from Supabase
    const fetchFollowing = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("follows")
        .select("chef_id")
        .eq("follower_id", user.id);
      
      if (data && !error) {
        setFollowingChefs(new Set(data.map(f => f.chef_id)));
      }
    };
    
    fetchFollowing();
  }, [user]);

  const toggleFollow = async (chefId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to follow chefs",
        variant: "destructive"
      });
      return;
    }

    const isFollowing = followingChefs.has(chefId);
    
    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("chef_id", chefId);
      
      setFollowingChefs(prev => {
        const newSet = new Set(prev);
        newSet.delete(chefId);
        return newSet;
      });
      toast({ title: "Unfollowed", description: "You unfollowed this chef" });
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, chef_id: chefId });
      
      setFollowingChefs(prev => new Set(prev).add(chefId));
      toast({ title: "Following!", description: "You are now following this chef" });
    }
  };

  const handleShare = async (videoId: string) => {
    const shareUrl = `${window.location.origin}/chef-media/${videoId}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link Copied!", description: "Video link copied to clipboard" });
  };

  const filteredVideos = filter
    ? videos.filter((v) => v.category.toLowerCase().includes(filter.toLowerCase()))
    : videos;

  const filteredChefs = searchQuery
    ? mockChefs.filter(chef => 
        chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockChefs;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <ChefHat className="inline-block w-12 h-12 mr-3 text-primary" />
              MiniChef Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover talented chefs, watch their cooking videos, and follow your favorites!
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search chefs by name, specialty, or location..."
                className="pl-12 h-12 text-lg rounded-full border-2 border-primary/20 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chef List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Featured Chefs</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredChefs.map((chef) => (
                  <motion.div
                    key={chef.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedChef?.id === chef.id 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : "hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedChef(chef)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={chef.avatar}
                            alt={chef.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{chef.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{chef.location}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>{chef.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {chef.followers.toLocaleString()} followers
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={followingChefs.has(chef.id) ? "outline" : "default"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollow(chef.id);
                            }}
                          >
                            {followingChefs.has(chef.id) ? (
                              <UserMinus className="w-4 h-4" />
                            ) : (
                              <UserPlus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chef Profile & Videos */}
            <div className="lg:col-span-2">
              {selectedChef ? (
                <motion.div
                  key={selectedChef.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Header */}
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <img
                          src={selectedChef.avatar}
                          alt={selectedChef.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
                        />
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-foreground">{selectedChef.name}</h2>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedChef.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedChef.badges.map((badge, i) => (
                              <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold">{selectedChef.rating}</span>
                              <span className="text-muted-foreground">rating</span>
                            </div>
                            <div>
                              <span className="font-semibold">{selectedChef.followers.toLocaleString()}</span>
                              <span className="text-muted-foreground"> followers</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          variant={followingChefs.has(selectedChef.id) ? "outline" : "default"}
                          onClick={() => toggleFollow(selectedChef.id)}
                          className="min-w-[120px]"
                        >
                          {followingChefs.has(selectedChef.id) ? (
                            <>
                              <UserMinus className="w-4 h-4 mr-2" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Videos Section */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Videos</h3>
                    <Input
                      type="text"
                      placeholder="Filter by category..."
                      className="w-48"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </div>

                  {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredVideos.map((video) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="overflow-hidden">
                            <div className="relative">
                              <video 
                                src={video.url} 
                                controls 
                                className="w-full aspect-video object-cover"
                                poster={video.thumbnail}
                              />
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-background/80 text-foreground">
                                  {video.category}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium text-foreground mb-2">{video.title}</h4>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span>{video.likes.toLocaleString()}</span>
                                  </button>
                                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{video.comments}</span>
                                  </button>
                                </div>
                                <button 
                                  className="flex items-center gap-1 hover:text-primary transition-colors"
                                  onClick={() => handleShare(video.id)}
                                >
                                  <Share2 className="w-4 h-4" />
                                  <span>Share</span>
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No videos found for this category</p>
                    </Card>
                  )}
                </motion.div>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center p-8">
                    <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Select a Chef</h3>
                    <p className="text-muted-foreground">
                      Click on a chef from the list to view their profile and videos
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
