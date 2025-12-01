import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
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
  FileText,
  Volume2,
  ZoomIn,
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";

const KidsZone = () => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [textSize, setTextSize] = useState(1);

  const cookingLessons = [
    { title: "Pizza Party Fun", level: "Beginner", badge: "🍕", progress: 75, color: "bg-orange-400" },
    { title: "Rainbow Smoothies", level: "Beginner", badge: "🌈", progress: 100, color: "bg-pink-400" },
    { title: "Cookie Decorating", level: "Beginner", badge: "🍪", progress: 50, color: "bg-yellow-400" },
    { title: "Pasta Shapes Magic", level: "Intermediate", badge: "🍝", progress: 25, color: "bg-green-400" },
    { title: "Fruit Art Creations", level: "Beginner", badge: "🍓", progress: 0, color: "bg-red-400" },
    { title: "Mini Chef Burgers", level: "Intermediate", badge: "🍔", progress: 0, color: "bg-amber-400" },
  ];

  const games = [
    { title: "Food Trivia Challenge", icon: "🧠", description: "Test your food knowledge!", type: "Quiz" },
    { title: "Drag & Drop Kitchen", icon: "🎮", description: "Build your dream kitchen!", type: "Game" },
    { title: "Ingredient Match", icon: "🎯", description: "Match ingredients to recipes!", type: "Puzzle" },
    { title: "Chef Memory Game", icon: "🃏", description: "Find the matching pairs!", type: "Memory" },
  ];

  const videoEpisodes = [
    { title: "Chef Coco's Pancake Adventure", duration: "8 min", thumbnail: "🥞" },
    { title: "The Magic Mixing Bowl", duration: "10 min", thumbnail: "🥣" },
    { title: "Veggie Superheroes", duration: "12 min", thumbnail: "🥕" },
    { title: "Baking with Bella Bear", duration: "9 min", thumbnail: "🐻" },
  ];

  const partyPackages = [
    { 
      title: "Virtual Cooking Party", 
      price: "£99", 
      features: ["Live video chef session", "Recipe kit delivered", "Up to 10 kids", "Certificate included"],
      color: "from-mint-400 to-teal-400"
    },
    { 
      title: "In-Home Party Experience", 
      price: "£249", 
      features: ["Professional chef visit", "All ingredients included", "Party decorations", "Party favors for all"],
      color: "from-orange-400 to-amber-400"
    },
    { 
      title: "Ultimate Chef Party", 
      price: "£399", 
      features: ["2 hour experience", "Choose your menu", "Chef outfit for birthday child", "Personalized certificate"],
      color: "from-pink-400 to-rose-400"
    },
  ];

  const downloads = [
    { title: "Easy Pizza Recipe", type: "Recipe PDF", icon: "📄" },
    { title: "Kitchen Coloring Book", type: "Coloring Sheets", icon: "🎨" },
    { title: "Parent's Guide to Cooking with Kids", type: "Guide", icon: "📚" },
    { title: "Cooking Safety Tips", type: "Poster", icon: "⚠️" },
    { title: "Certificate Template", type: "Printable", icon: "🏆" },
    { title: "Recipe Cards Collection", type: "Cards", icon: "🗂️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 via-background to-orange-50 dark:from-background dark:via-background dark:to-background">
      <Navbar />
      
      {/* Accessibility Controls */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTextSize(Math.min(textSize + 0.1, 1.5))}
              className="p-2 rounded-full bg-mint-100 hover:bg-mint-200 dark:bg-mint-900 dark:hover:bg-mint-800 transition-colors"
              aria-label="Increase text size"
            >
              <ZoomIn className="h-5 w-5 text-mint-700 dark:text-mint-300" />
            </button>
            <button
              onClick={() => setTextSize(Math.max(textSize - 0.1, 0.8))}
              className="p-2 rounded-full bg-mint-100 hover:bg-mint-200 dark:bg-mint-900 dark:hover:bg-mint-800 transition-colors"
              aria-label="Decrease text size"
            >
              <span className="text-mint-700 dark:text-mint-300 font-bold text-sm">A-</span>
            </button>
            <button
              className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 transition-colors"
              aria-label="Audio narration"
            >
              <Volume2 className="h-5 w-5 text-orange-700 dark:text-orange-300" />
            </button>
          </div>
          <button
            onClick={() => setIsParentMode(!isParentMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isParentMode 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {isParentMode ? "👨‍👩‍👧 Parent Mode ON" : "🧒 Kid Mode"}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ fontSize: `${textSize}rem` }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{ animationDelay: "0s" }}>🍳</div>
          <div className="absolute top-20 right-20 text-5xl animate-bounce" style={{ animationDelay: "0.5s" }}>🥄</div>
          <div className="absolute bottom-20 left-1/4 text-4xl animate-bounce" style={{ animationDelay: "1s" }}>🧁</div>
          <div className="absolute bottom-10 right-1/3 text-5xl animate-bounce" style={{ animationDelay: "1.5s" }}>👨‍🍳</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-mint-400 to-orange-400 text-white px-6 py-2 rounded-full text-lg font-bold mb-6 animate-pulse">
              <Sparkles className="h-5 w-5" />
              Welcome to the Fun Zone!
              <Sparkles className="h-5 w-5" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-mint-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Mini Chefs Academy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Where little cooks become BIG chefs! 🌟 Join the fun with cooking lessons, 
              games, videos, and amazing birthday parties!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-mint-500 to-teal-500 hover:from-mint-600 hover:to-teal-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                <Play className="mr-2 h-5 w-5" /> Start Learning!
              </Button>
              <Button size="lg" variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 rounded-full">
                <Gamepad2 className="mr-2 h-5 w-5" /> Play Games
              </Button>
            </div>
            
            {/* Chef Mascot */}
            <div className="mt-12 flex justify-center">
              <div className="relative">
                <div className="text-9xl animate-float">👨‍🍳</div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-card rounded-2xl px-6 py-3 shadow-lg">
                  <p className="text-lg font-bold text-foreground">Hi! I'm Chef Coco!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cooking for Kids Section */}
      <section className="py-16 bg-mint-50/50 dark:bg-card/30" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-mint-400 rounded-2xl">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Cooking for Kids</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Interactive lessons that teach real cooking skills! Earn badges as you progress. 🏅
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cookingLessons.map((lesson, i) => (
              <Card 
                key={i} 
                className="p-6 rounded-3xl border-2 border-mint-200 dark:border-mint-800 hover:border-mint-400 dark:hover:border-mint-600 transition-all hover:scale-105 cursor-pointer bg-white dark:bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{lesson.badge}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${lesson.color}`}>
                    {lesson.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{lesson.title}</h3>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold text-mint-600">{lesson.progress}%</span>
                  </div>
                  <div className="h-3 bg-mint-100 dark:bg-mint-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${lesson.color} rounded-full transition-all duration-500`}
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
                
                {lesson.progress === 100 && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-600">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold text-sm">Completed! 🎉</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-mint-500 hover:bg-mint-600 text-white rounded-full px-8">
              View All Lessons <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Games & Quizzes Section */}
      <section className="py-16" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-400 rounded-2xl">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Games & Quizzes</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Learn while you play! Test your food knowledge and have fun! 🎮
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, i) => (
              <Card 
                key={i} 
                className="p-6 rounded-3xl border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all hover:scale-105 cursor-pointer bg-white dark:bg-card group"
              >
                <div className="text-6xl mb-4 group-hover:animate-bounce">{game.icon}</div>
                <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-bold mb-2">
                  {game.type}
                </span>
                <h3 className="text-xl font-bold mb-2 text-foreground">{game.title}</h3>
                <p className="text-muted-foreground text-sm">{game.description}</p>
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                  Play Now!
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Episodes Section */}
      <section className="py-16 bg-yellow-50/50 dark:bg-card/30" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-yellow-400 rounded-2xl">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Video Episodes</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Watch fun cartoon adventures with Chef Coco and friends! 📺
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoEpisodes.map((video, i) => (
              <Card 
                key={i} 
                className="overflow-hidden rounded-3xl border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all hover:scale-105 cursor-pointer bg-white dark:bg-card"
              >
                <div className="aspect-video bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center relative">
                  <span className="text-7xl">{video.thumbnail}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <Play className="h-8 w-8 text-yellow-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{video.title}</h3>
                  <p className="text-muted-foreground text-sm">{video.duration}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-8">
              Watch All Episodes <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Birthday Party Bookings Section */}
      <section className="py-16" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-pink-400 rounded-2xl">
              <Cake className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Birthday Party Bookings</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Make your child's birthday AMAZING with a cooking party! 🎂🎉
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partyPackages.map((pkg, i) => (
              <Card 
                key={i} 
                className="p-8 rounded-3xl border-2 border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600 transition-all hover:scale-105 bg-white dark:bg-card relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${pkg.color}`} />
                
                <div className="text-4xl mb-4">🎈</div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">{pkg.title}</h3>
                <p className="text-4xl font-extrabold text-primary mb-6">{pkg.price}</p>
                
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to="/contact">
                  <Button className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white rounded-full text-lg py-6`}>
                    Book Now!
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-16 bg-purple-50/50 dark:bg-card/30" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-400 rounded-2xl">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Free Downloads</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Printable recipes, coloring sheets, and guides for parents! 📚
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item, i) => (
              <Card 
                key={i} 
                className="p-6 rounded-3xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-105 cursor-pointer bg-white dark:bg-card flex items-center gap-4"
              >
                <span className="text-4xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.type}</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-purple-400 text-purple-600 hover:bg-purple-50">
                  <Download className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Mode Info Section */}
      {isParentMode && (
        <section className="py-16 bg-blue-50/50 dark:bg-card/30" style={{ fontSize: `${textSize}rem` }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-400 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Parent Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 rounded-3xl bg-white dark:bg-card">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Safety First</h3>
                <p className="text-muted-foreground mb-4">
                  All our content is designed with child safety in mind. Our lessons teach proper kitchen safety, 
                  and all recipes are age-appropriate. Parental supervision is recommended for all cooking activities.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Age-appropriate content for 4-12 years</li>
                  <li>✓ Safety instructions in every lesson</li>
                  <li>✓ No sharp objects in beginner lessons</li>
                  <li>✓ Adult supervision guidelines provided</li>
                </ul>
              </Card>
              
              <Card className="p-8 rounded-3xl bg-white dark:bg-card">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Educational Benefits</h3>
                <p className="text-muted-foreground mb-4">
                  Cooking teaches children essential life skills including math, reading comprehension, 
                  following instructions, and healthy eating habits.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Math skills through measuring</li>
                  <li>✓ Reading comprehension via recipes</li>
                  <li>✓ Science concepts in cooking</li>
                  <li>✓ Confidence and independence</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-mint-500 via-orange-500 to-yellow-500" style={{ fontSize: `${textSize}rem` }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Cooking? 👨‍🍳
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of mini chefs learning to cook delicious meals!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-lg">
                <Gift className="mr-2 h-5 w-5" /> Sign Up Free!
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full">
                <FileText className="mr-2 h-5 w-5" /> Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsZone;
