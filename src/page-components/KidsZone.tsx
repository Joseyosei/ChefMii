import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Star, 
  Trophy, 
  Gift, 
  Download, 
  ChefHat, 
  Gamepad2, 
  Video, 
  Cake, 
  Volume2,
  ZoomIn,
  ChevronRight,
  Sparkles,
  Rocket,
  Heart,
  Zap,
  Package,
  Scan,
  TrendingUp,
  Award,
  Users,
  Eye,
  Camera,
  Shirt,
  Utensils,
  PawPrint,
  Smile,
  MessageCircle,
  Share2,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Plus,
  ArrowRight,
  ShoppingCart,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const KidsZone = () => {
  const { user } = useAuth();
  const [textSize, setTextSize] = useState(1);
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);

  // Avatar State
  const [avatar, setAvatar] = useState({
    hat: "🎓",
    coat: "🧥",
    tool: "🥄",
    name: "New Chef"
  });

  // Pet State
  const [pet, setPet] = useState({
    name: "MiiMii",
    level: 1,
    hunger: 80,
    happiness: 90
  });

  const hats = ["🎓", "👨‍🍳", "🎩", "👑", "🧢"];
  const coats = ["🧥", "🥋", "👕", "🥼", "👔"];
  const tools = ["🥄", "🥣", "🥢", "🍴", "🔪"];

  const socialPosts = [
    { id: 1, user: "Chef Leo", dish: "Rainbow Cupcakes", likes: 124, emoji: "🧁", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80" },
    { id: 2, user: "Chef Maya", dish: "Giant Pizza Wheel", likes: 89, emoji: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" },
    { id: 3, user: "Chef Sam", dish: "Berry Blast Smoothie", likes: 215, emoji: "🥤", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80" },
  ];

  const handleBoxCheckout = async (kitName: string) => {
    if (!user) {
      toast({ title: "Please login to subscribe", variant: "destructive" });
      return;
    }

    setSubmitting(kitName);
    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'subscription_box',
          items: [{
            name: `Mini Chef ${kitName} Box`,
            price: 24.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80"
          }],
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=box`,
          cancelUrl: `${window.location.origin}/kids-zone`,
        },
      });

      if (response.error) throw response.error;
      if (response.data?.url) window.location.href = response.data.url;
    } catch (error: any) {
      toast({ title: "Checkout Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(null);
    }
  };

  const cookingLessons = [
    { title: "Pizza Party Fun", level: "Beginner", badge: "🍕", progress: 75, color: "from-orange-400 to-red-400" },
    { title: "Rainbow Smoothies", level: "Beginner", badge: "🌈", progress: 100, color: "from-pink-400 to-purple-400" },
    { title: "Cookie Decorating", level: "Beginner", badge: "🍪", progress: 50, color: "from-yellow-400 to-orange-400" },
    { title: "Pasta Shapes Magic", level: "Intermediate", badge: "🍝", progress: 25, color: "from-green-400 to-teal-400" },
    { title: "Fruit Art Creations", level: "Beginner", badge: "🍓", progress: 0, color: "from-red-400 to-pink-400" },
    { title: "Mini Chef Burgers", level: "Intermediate", badge: "🍔", progress: 0, color: "from-amber-400 to-yellow-400" },
  ];

  const games = [
    { title: "Food Trivia Challenge", icon: "🧠", description: "Test your food knowledge!", type: "Quiz", color: "from-blue-500 to-indigo-500" },
    { title: "Drag & Drop Kitchen", icon: "🎮", description: "Build your dream kitchen!", type: "Game", color: "from-green-500 to-emerald-500" },
    { title: "Ingredient Match", icon: "🎯", description: "Match ingredients to recipes!", type: "Puzzle", color: "from-orange-500 to-amber-500" },
    { title: "Chef Memory Game", icon: "🃏", description: "Find the matching pairs!", type: "Memory", color: "from-purple-500 to-pink-500" },
  ];

  const subscriptionKits = [
    { name: "Baker Box", age: "5-8", color: "bg-pink-100", icon: "🍰" },
    { name: "Savory Skills", age: "9-12", color: "bg-blue-100", icon: "🍱" },
    { name: "Veggie Voyager", age: "6-10", color: "bg-green-100", icon: "🥗" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0]">
      <Navbar />
      
      {/* Accessibility & Quick Actions */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b py-3 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4">
           <div className="flex items-center gap-4">
            <button
              onClick={() => setTextSize(Math.min(textSize + 0.1, 1.3))}
              className="p-3 rounded-2xl bg-yellow-400 text-white shadow-lg hover:scale-110 transition-transform"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg hover:scale-110 transition-transform">
              <Volume2 className="h-5 w-5" />
            </button>
           </div>
           
           <div className="flex items-center gap-3">
             <Badge className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest cursor-pointer">
               Online Now: 1,240 Mini Chefs
             </Badge>
           </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden" style={{ fontSize: `${textSize}rem` }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
           {['🍕', '🍓', '🥕', '🍪', '🥨', '🍩'].map((emoji, i) => (
             <motion.div 
               key={i}
               animate={{ 
                 y: [0, -100, 0],
                 x: [0, Math.random() * 50 - 25, 0],
                 rotate: [0, 360]
               }}
               transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
               className="absolute text-6xl"
               style={{ left: `${i * 15}%`, top: `${(i % 3) * 30}%` }}
             >
               {emoji}
             </motion.div>
           ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-40 h-40 bg-white rounded-full mx-auto mb-8 shadow-2xl border-8 border-yellow-400 flex items-center justify-center text-8xl"
          >
            👨‍🍳
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6">
            <span className="text-orange-500">KID'S</span> <span className="text-blue-500">ZONE</span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-black text-gray-700 mb-10 max-w-2xl mx-auto leading-tight">
            Level up your cooking skills while playing awesome games! 🌟
          </p>
          
        <div className="flex flex-wrap justify-center gap-6">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-8 rounded-3xl text-2xl shadow-xl flex items-center gap-4 group transition-all hover:scale-105">
            <Play className="h-8 w-8 fill-current group-hover:rotate-12 transition-transform" /> LET'S COOK!
          </Button>
          <Button variant="outline" size="lg" className="bg-white border-4 border-blue-500 text-blue-500 font-black px-10 py-8 rounded-3xl text-2xl shadow-xl hover:bg-blue-50 transition-all hover:scale-105">
            <Gamepad2 className="h-8 w-8" /> PLAY GAMES
          </Button>
        </div>
      </div>
    </section>

    {/* Avatar & Pet Companion Section */}
    <section className="py-12 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Avatar Creator */}
          <Card className="p-8 rounded-[40px] border-4 border-orange-100 shadow-xl overflow-hidden relative group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-100 rounded-2xl">
                <Shirt className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic">AVATAR CREATOR</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dress for success!</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-48 h-48 bg-orange-50 rounded-full flex flex-col items-center justify-center text-7xl relative shadow-inner">
                  <span className="absolute top-4">{avatar.hat}</span>
                  <span className="mt-4">{avatar.coat}</span>
                  <span className="absolute bottom-4 right-4 text-4xl">{avatar.tool}</span>
                </div>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1">
                  LVL {pet.level}
                </Badge>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Chef Hat</p>
                  <div className="flex gap-2">
                    {hats.map(h => (
                      <button 
                        key={h} 
                        onClick={() => setAvatar({...avatar, hat: h})}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${avatar.hat === h ? 'bg-orange-500 scale-110 shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Chef Coat</p>
                  <div className="flex gap-2">
                    {coats.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setAvatar({...avatar, coat: c})}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${avatar.coat === c ? 'bg-orange-500 scale-110 shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-orange-500 font-black rounded-2xl h-12">SAVE STYLE ✨</Button>
              </div>
            </div>
          </Card>

          {/* ChefMii Pet */}
          <Card className="p-8 rounded-[40px] border-4 border-blue-100 shadow-xl overflow-hidden relative group">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <PawPrint className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic">KITCHEN PET: {pet.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Keep your companion happy!</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <motion.div 
                  animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-48 h-48 bg-blue-50 rounded-[60px] flex items-center justify-center text-8xl shadow-inner"
                >
                  🐱
                </motion.div>
                <div className="absolute -top-4 -right-4 bg-white shadow-xl p-3 rounded-2xl flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-black text-sm">HAPPY!</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Hunger</span>
                    <span>{pet.hunger}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${pet.hunger}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Happiness</span>
                    <span>{pet.happiness}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${pet.happiness}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="rounded-2xl h-12 border-2 border-orange-500 text-orange-500 font-black flex items-center gap-2">
                    <Utensils className="h-4 w-4" /> FEED
                  </Button>
                  <Button variant="outline" className="rounded-2xl h-12 border-2 border-blue-500 text-blue-500 font-black flex items-center gap-2">
                    <Smile className="h-4 w-4" /> PLAY
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    {/* Social Kitchen - Kid Safe Show & Tell */}
    <section className="py-24 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-xl rotate-6">
              <Camera className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter">SHOW & TELL</h2>
          </div>
          <Button className="bg-orange-500 font-black rounded-full h-12 px-8 shadow-lg">SHARE YOUR DISH!</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {socialPosts.map(post => (
            <Card key={post.id} className="bg-white rounded-[40px] border-none shadow-xl overflow-hidden group hover:scale-105 transition-all">
              <div className="aspect-square relative overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.dish} />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur text-black border-none font-black text-xs px-3 py-1 rounded-full shadow-lg">
                    {post.emoji} {post.dish}
                  </Badge>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-black">
                      {post.user[0]}
                    </div>
                    <div>
                      <p className="font-black italic leading-tight">{post.user}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mini Chef</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="flex items-center gap-2 font-black text-orange-500 hover:text-orange-600">
                    <Heart className="h-5 w-5 fill-current" /> {post.likes}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Mini Chef Subscription Box Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <Badge className="bg-pink-500 text-white mb-6 text-sm font-black uppercase tracking-widest px-4 py-1.5">Phygital Experience</Badge>
                <h2 className="text-5xl font-black italic tracking-tighter mb-8 leading-tight">Mini Chef Subscription Boxes</h2>
                <p className="text-xl text-gray-500 font-bold mb-10 leading-relaxed">Get a physical box delivered every month with tools, ingredients, and secret codes to unlock premium digital lessons!</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                   {subscriptionKits.map((kit, i) => (
                     <Card key={i} className={`${kit.color} border-none p-6 rounded-3xl text-center group cursor-pointer hover:scale-105 transition-transform shadow-lg`}>
                        <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{kit.icon}</div>
                        <h4 className="font-black text-lg mb-1">{kit.name}</h4>
                        <p className="text-xs font-black text-gray-500">AGES {kit.age}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-4 font-black text-[10px] text-pink-500 hover:text-pink-600"
                          onClick={() => handleBoxCheckout(kit.name)}
                          disabled={submitting === kit.name}
                        >
                          {submitting === kit.name ? <Loader2 className="h-3 w-3 animate-spin" /> : "ORDER NOW"}
                        </Button>
                     </Card>
                   ))}
                </div>
                
                <Button 
                  onClick={() => handleBoxCheckout("Full Set")}
                  disabled={submitting === "Full Set"}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-black px-10 py-8 text-xl rounded-3xl flex items-center gap-4 shadow-2xl group transition-all"
                >
                  {submitting === "Full Set" ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Package className="h-6 w-6 group-hover:rotate-12 transition-transform" /> SUBSCRIBE NOW</>}
                </Button>
              </div>
              
              <div className="flex-1 relative">
                 <div className="absolute -inset-4 bg-yellow-400/20 blur-3xl rounded-full" />
                 <Card className="bg-white border-8 border-yellow-400 p-2 rounded-[40px] shadow-2xl relative overflow-hidden aspect-square flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80" 
                      alt="Subscription Box"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                       <p className="text-white text-3xl font-black italic">Next Box: The Italian Adventure 🇮🇹</p>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      </section>

      {/* AR AR Healthy Food Hunt Section */}
      <section className="py-24 bg-blue-500 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-white">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative group">
                 <Card className="bg-black border-4 border-white rounded-[50px] aspect-[9/16] max-w-xs mx-auto overflow-hidden relative shadow-2xl">
                    {showARPreview ? (
                      <div className="h-full relative">
                        <img 
                          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" 
                          className="h-full w-full object-cover opacity-80"
                          alt="Kitchen Camera"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <motion.div 
                             animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="text-8xl filter drop-shadow-2xl"
                           >
                             🥦
                           </motion.div>
                        </div>
                        <div className="absolute top-10 left-10 right-10 flex justify-between">
                           <Badge className="bg-green-500 text-white px-3 py-1">+50 XP</Badge>
                           <Badge className="bg-orange-500 text-white px-3 py-1">FOUND: 4/10</Badge>
                        </div>
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-10">
                           <p className="font-black italic text-2xl mb-4 text-white drop-shadow-lg">GOT IT!</p>
                           <Button onClick={() => setShowARPreview(false)} className="bg-white text-blue-500 font-black rounded-full px-8">CLOSE CAMERA</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                         <Camera className="h-20 w-20 mb-8 opacity-40" />
                         <p className="font-black text-2xl mb-6">Scanning your kitchen for healthy ingredients...</p>
                         <Button 
                           onClick={() => setShowARPreview(true)}
                           className="bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-6 rounded-2xl shadow-xl flex items-center gap-3"
                         >
                            <Scan className="h-6 w-6" /> START AR HUNT
                         </Button>
                      </div>
                    )}
                 </Card>
                 <div className="absolute -bottom-10 -right-10 bg-yellow-400 text-black font-black p-8 rounded-3xl shadow-2xl rotate-12 group-hover:rotate-0 transition-transform">
                    <p className="text-3xl">WIN REAL <br/>PRIZES!</p>
                 </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <Scan className="h-4 w-4" /> Augmented Reality Game
                </div>
                <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-8 leading-tight">Healthy Food <br/>HUNT!</h2>
                <p className="text-xl text-blue-50 font-bold mb-10 leading-relaxed">Use your tablet or phone to "hunt" for healthy foods in your own kitchen. Learn nutritional values and earn digital badges that give you real marketplace discounts!</p>
                
                <div className="space-y-6">
                   {[
                     "Real-time object recognition AI",
                     "Learn nutrition while moving around",
                     "Complete daily quests for rewards",
                     "Safe, kid-friendly AR environment"
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                           <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">{item}</span>
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Parental ROI & Progress Section */}
      <section className="py-24 bg-white border-y">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                 <Badge className="bg-gray-100 text-gray-500 mb-6 font-black uppercase tracking-widest px-4 py-1.5">For Parents</Badge>
                 <h2 className="text-5xl font-black italic tracking-tighter mb-8">Parental ROI & Progress</h2>
                 <p className="text-xl text-gray-500 font-bold mb-10 leading-relaxed">See exactly what your child is learning. Track their culinary skills, safety knowledge, and nutritional awareness through our data-driven reporting.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                      { label: "Safety Awareness", value: 92, icon: <ShieldCheck className="h-8 w-8 text-green-500" /> },
                      { label: "Kitchen Math", value: 78, icon: <BarChart3 className="h-8 w-8 text-blue-500" /> },
                      { label: "Nutrition Knowledge", value: 85, icon: <Utensils className="h-8 w-8 text-orange-500" /> },
                      { label: "Confidence Level", value: 95, icon: <Zap className="h-8 w-8 text-yellow-500" /> },
                    ].map((metric, i) => (
                      <Card key={i} className="p-6 border-2 border-gray-100 rounded-3xl group hover:border-primary transition-colors">
                         <div className="flex items-center justify-between mb-4">
                            <div className="group-hover:scale-110 transition-transform">{metric.icon}</div>
                            <span className="font-black text-2xl text-primary">{metric.value}%</span>
                         </div>
                         <p className="font-black text-sm uppercase tracking-widest text-gray-400">{metric.label}</p>
                      </Card>
                    ))}
                 </div>
                 
                 <Button className="bg-[#1a1a1a] hover:bg-black text-white font-black px-10 py-8 text-xl rounded-3xl flex items-center gap-4 transition-all">
                    VIEW PARENT DASHBOARD <ChevronRight className="h-6 w-6" />
                 </Button>
              </div>
              
              <div className="flex-1">
                 <Card className="bg-gray-50 border-none p-12 rounded-[50px] shadow-inner relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
                    <div className="text-center mb-10">
                       <h3 className="text-3xl font-black italic mb-4">Mastery Badge Earned!</h3>
                       <div className="w-32 h-32 bg-yellow-400 rounded-full mx-auto flex items-center justify-center text-6xl shadow-xl animate-bounce">
                          🏅
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                          <div>
                            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Newest Skill</p>
                            <p className="font-black text-xl italic">Mastered: Measuring & Proportions</p>
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                          <Award className="h-8 w-8 text-orange-500" />
                          <div>
                            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Achievement</p>
                            <p className="font-black text-xl italic">Completed: 10 Healthy Recipes</p>
                          </div>
                       </div>
                       <Button variant="outline" className="w-full border-2 border-black font-black rounded-2xl h-12 flex items-center gap-2">
                          <Download className="h-4 w-4" /> DOWNLOAD CERTIFICATE
                       </Button>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      </section>

      {/* Existing Sections Enhanced */}
      <section className="py-24 bg-yellow-400 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="p-4 bg-white rounded-3xl shadow-xl rotate-12">
               <ChefHat className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-lg">COOKING LESSONS</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cookingLessons.map((lesson, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-8 rounded-[40px] border-none shadow-2xl hover:scale-105 transition-all cursor-pointer overflow-hidden relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${lesson.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-7xl group-hover:scale-110 transition-transform">{lesson.badge}</div>
                      <Badge className={`bg-gradient-to-r ${lesson.color} text-white border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]`}>
                        {lesson.level}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-black italic mb-4 leading-tight">{lesson.title}</h3>
                    
                    <div className="mt-8">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{lesson.progress}%</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lesson.progress}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full bg-gradient-to-r ${lesson.color} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    {lesson.progress === 100 && (
                      <div className="mt-4 flex items-center gap-2 text-green-500 font-black italic">
                        <Trophy className="h-5 w-5" /> EXCELLENT! 🎉
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Episodes with Motion */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-16">
            <div className="p-4 bg-pink-100 rounded-3xl shadow-xl -rotate-12">
               <Video className="h-10 w-10 text-pink-500" />
            </div>
            <h2 className="text-5xl font-black italic tracking-tighter">WATCH & LEARN</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Pancake Adventure", views: "12K", thumb: "🥞" },
              { title: "Magic Mixing Bowl", views: "8K", thumb: "🥣" },
              { title: "Veggie Heroes", views: "15K", thumb: "🥕" },
              { title: "Baking with Bella", views: "20K", thumb: "🐻" },
            ].map((video, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="aspect-video bg-gray-100 rounded-[40px] flex items-center justify-center text-7xl shadow-xl overflow-hidden group-hover:shadow-pink-100 group-hover:shadow-2xl transition-all">
                   {video.thumb}
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl">
                         <Play className="h-8 w-8 text-pink-500 fill-current ml-1" />
                      </div>
                   </div>
                </div>
                <div className="mt-6 px-2">
                  <h3 className="font-black italic text-xl mb-1">{video.title}</h3>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{video.views} MINI CHEFS WATCHED</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>;

export default KidsZone;
