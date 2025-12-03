import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  Zap
} from "lucide-react";
import { useState } from "react";

const KidsZone = () => {
  const [textSize, setTextSize] = useState(1);
  const [activeGame, setActiveGame] = useState<number | null>(null);

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

  const videoEpisodes = [
    { title: "Chef Coco's Pancake Adventure", duration: "8 min", thumbnail: "🥞", views: "12K" },
    { title: "The Magic Mixing Bowl", duration: "10 min", thumbnail: "🥣", views: "8K" },
    { title: "Veggie Superheroes", duration: "12 min", thumbnail: "🥕", views: "15K" },
    { title: "Baking with Bella Bear", duration: "9 min", thumbnail: "🐻", views: "20K" },
  ];

  const partyPackages = [
    { 
      title: "Virtual Cooking Party", 
      price: "£99", 
      features: ["Live video chef session", "Recipe kit delivered", "Up to 10 kids", "Certificate included"],
      color: "from-cyan-400 to-blue-500",
      icon: "💻"
    },
    { 
      title: "In-Home Party Experience", 
      price: "£249", 
      features: ["Professional chef visit", "All ingredients included", "Party decorations", "Party favors for all"],
      color: "from-orange-400 to-pink-500",
      icon: "🏠"
    },
    { 
      title: "Ultimate Chef Party", 
      price: "£399", 
      features: ["2 hour experience", "Choose your menu", "Chef outfit for birthday child", "Personalized certificate"],
      color: "from-purple-400 to-indigo-500",
      icon: "👑"
    },
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-background to-pink-50 dark:from-background dark:via-background dark:to-background">
      <Navbar />
      
      {/* Accessibility Controls */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setTextSize(Math.min(textSize + 0.1, 1.5))}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <ZoomIn className="h-5 w-5 text-primary" />
          </button>
          <button
            onClick={() => setTextSize(Math.max(textSize - 0.1, 0.8))}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors font-bold"
          >
            A-
          </button>
          <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <Volume2 className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ fontSize: `${textSize}rem` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 left-10 text-6xl">🍳</motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute top-20 right-20 text-5xl">🥄</motion.div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-20 left-1/4 text-4xl">🧁</motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 right-1/3 text-5xl">👨‍🍳</motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-lg font-bold mb-6"
            >
              <Sparkles className="h-5 w-5" />
              Welcome to the Fun Zone!
              <Sparkles className="h-5 w-5" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Mini Chefs Academy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Where little cooks become BIG chefs! 🌟
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg px-8 py-6 rounded-full shadow-lg">
                  <Rocket className="mr-2 h-5 w-5" /> Start Learning!
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2">
                  <Gamepad2 className="mr-2 h-5 w-5" /> Play Games
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mt-12"
            >
              <div className="text-9xl">👨‍🍳</div>
              <div className="bg-card rounded-2xl px-6 py-3 shadow-lg inline-block mt-4">
                <p className="text-lg font-bold">Hi! I'm Chef Coco!</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cooking Lessons */}
      <section className="py-16 bg-card/50" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Cooking Lessons</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cookingLessons.map((lesson, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-6 rounded-3xl border-2 hover:shadow-xl transition-all hover:scale-105 cursor-pointer overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${lesson.color} opacity-5`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-5xl">{lesson.badge}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${lesson.color}`}>
                        {lesson.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold">{lesson.progress}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lesson.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${lesson.color} rounded-full`}
                        />
                      </div>
                    </div>
                    
                    {lesson.progress === 100 && (
                      <div className="mt-3 flex items-center gap-2 text-yellow-600">
                        <Trophy className="h-5 w-5" />
                        <span className="font-bold text-sm">Completed! 🎉</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Games & Quizzes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGame(activeGame === i ? null : i)}
              >
                <Card className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${activeGame === i ? 'ring-4 ring-primary' : ''}`}>
                  <motion.div 
                    animate={activeGame === i ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {game.icon}
                  </motion.div>
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${game.color} text-white rounded-full text-xs font-bold mb-2`}>
                    {game.type}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                  <Button className={`w-full bg-gradient-to-r ${game.color} text-white rounded-full`}>
                    <Zap className="mr-2 h-4 w-4" /> Play Now!
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Episodes */}
      <section className="py-16 bg-card/50" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Video Episodes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoEpisodes.map((video, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden rounded-3xl border-2 cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center relative group">
                    <span className="text-7xl">{video.thumbnail}</span>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{video.title}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{video.duration}</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday Parties */}
      <section className="py-16" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl">
              <Cake className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Birthday Party Packages</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partyPackages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-8 rounded-3xl border-2 relative overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pkg.color}`} />
                  
                  <div className="text-5xl mb-4">{pkg.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className={`text-4xl font-extrabold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent mb-6`}>{pkg.price}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/contact">
                    <Button className={`w-full bg-gradient-to-r ${pkg.color} text-white rounded-full text-lg py-6`}>
                      <Gift className="mr-2 h-5 w-5" /> Book Now!
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 bg-card/50" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Free Downloads</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Pizza Recipe", icon: "📄" },
              { title: "Coloring Book", icon: "🎨" },
              { title: "Parent's Guide", icon: "📚" },
              { title: "Safety Tips", icon: "⚠️" },
              { title: "Certificate", icon: "🏆" },
              { title: "Recipe Cards", icon: "🗂️" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow rounded-2xl">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium">{item.title}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsZone;
