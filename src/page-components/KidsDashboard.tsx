import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Home, Star, Trophy, Book, ChefHat, Utensils, Award, Gift,
  Settings, LogOut, Bell, Sparkles, Heart, Flame, Clock,
  Menu, X, Play, Lock, CheckCircle2, Gamepad2, Crown, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  xp: number;
  image: string;
  unlocked: boolean;
  completed: boolean;
  ingredients: string[];
  category: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

interface ChefAvatar {
  id: string;
  name: string;
  image: string;
  unlocked: boolean;
  requiredLevel: number;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home', color: 'text-yellow-500' },
  { id: 'recipes', icon: Book, label: 'Recipes', color: 'text-green-500' },
  { id: 'achievements', icon: Trophy, label: 'Achievements', color: 'text-purple-500' },
  { id: 'avatar', icon: ChefHat, label: 'My Chef', color: 'text-pink-500' },
];

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

const difficultyStars = {
  easy: 1,
  medium: 2,
  hard: 3
};

export default function KidsDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(750);
  const [totalXp, setTotalXp] = useState(1000);
  const [coins, setCoins] = useState(320);
  const [streak, setStreak] = useState(7);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('chef-1');

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Rainbow Fruit Salad',
      difficulty: 'easy',
      time: '15 min',
      xp: 50,
      image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=300&fit=crop',
      unlocked: true,
      completed: true,
      ingredients: ['Strawberries', 'Oranges', 'Bananas', 'Kiwi', 'Blueberries'],
      category: 'Snacks'
    },
    {
      id: '2',
      name: 'Mini Pizza Faces',
      difficulty: 'easy',
      time: '25 min',
      xp: 75,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      unlocked: true,
      completed: true,
      ingredients: ['Mini Pita', 'Tomato Sauce', 'Cheese', 'Vegetables'],
      category: 'Main'
    },
    {
      id: '3',
      name: 'Chocolate Banana Pops',
      difficulty: 'easy',
      time: '20 min',
      xp: 60,
      image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
      unlocked: true,
      completed: false,
      ingredients: ['Bananas', 'Chocolate', 'Sprinkles', 'Sticks'],
      category: 'Dessert'
    },
    {
      id: '4',
      name: 'Veggie Sushi Rolls',
      difficulty: 'medium',
      time: '35 min',
      xp: 100,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      unlocked: true,
      completed: false,
      ingredients: ['Rice', 'Nori', 'Cucumber', 'Carrot', 'Avocado'],
      category: 'Main'
    },
    {
      id: '5',
      name: 'Magic Smoothie Bowl',
      difficulty: 'easy',
      time: '10 min',
      xp: 45,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
      unlocked: true,
      completed: false,
      ingredients: ['Frozen Berries', 'Banana', 'Yogurt', 'Granola', 'Honey'],
      category: 'Breakfast'
    },
    {
      id: '6',
      name: 'Dinosaur Chicken Nuggets',
      difficulty: 'medium',
      time: '40 min',
      xp: 120,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
      unlocked: false,
      completed: false,
      ingredients: ['Chicken', 'Breadcrumbs', 'Eggs', 'Flour'],
      category: 'Main'
    },
    {
      id: '7',
      name: 'Rainbow Pancakes',
      difficulty: 'medium',
      time: '30 min',
      xp: 110,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      unlocked: false,
      completed: false,
      ingredients: ['Flour', 'Milk', 'Eggs', 'Food Coloring', 'Maple Syrup'],
      category: 'Breakfast'
    },
    {
      id: '8',
      name: 'Galaxy Cake Pops',
      difficulty: 'hard',
      time: '60 min',
      xp: 200,
      image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=300&fit=crop',
      unlocked: false,
      completed: false,
      ingredients: ['Cake', 'Frosting', 'Candy Melts', 'Edible Glitter', 'Sticks'],
      category: 'Dessert'
    },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', name: 'First Recipe', description: 'Complete your first recipe', icon: '🍳', unlocked: true, progress: 1, target: 1 },
    { id: '2', name: 'Kitchen Helper', description: 'Complete 5 recipes', icon: '👨‍🍳', unlocked: true, progress: 5, target: 5 },
    { id: '3', name: 'Super Chef', description: 'Complete 10 recipes', icon: '⭐', unlocked: false, progress: 2, target: 10 },
    { id: '4', name: 'Week Warrior', description: '7-day cooking streak', icon: '🔥', unlocked: true, progress: 7, target: 7 },
    { id: '5', name: 'Fruit Master', description: 'Make 3 fruit dishes', icon: '🍓', unlocked: false, progress: 1, target: 3 },
    { id: '6', name: 'Veggie Hero', description: 'Make 5 veggie dishes', icon: '🥦', unlocked: false, progress: 2, target: 5 },
    { id: '7', name: 'Dessert King', description: 'Make 3 desserts', icon: '🍰', unlocked: false, progress: 0, target: 3 },
    { id: '8', name: 'Early Bird', description: 'Make 3 breakfast recipes', icon: '🌅', unlocked: false, progress: 0, target: 3 },
  ]);

  const [avatars, setAvatars] = useState<ChefAvatar[]>([
    { id: 'chef-1', name: 'Junior Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef1&backgroundColor=b6e3f4', unlocked: true, requiredLevel: 1 },
    { id: 'chef-2', name: 'Sous Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef2&backgroundColor=c0aede', unlocked: true, requiredLevel: 3 },
    { id: 'chef-3', name: 'Head Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef3&backgroundColor=d1d4f9', unlocked: true, requiredLevel: 5 },
    { id: 'chef-4', name: 'Master Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef4&backgroundColor=ffd5dc', unlocked: false, requiredLevel: 10 },
    { id: 'chef-5', name: 'Star Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef5&backgroundColor=ffdfbf', unlocked: false, requiredLevel: 15 },
    { id: 'chef-6', name: 'Legend Chef', image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef6&backgroundColor=c1f0c1', unlocked: false, requiredLevel: 20 },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const startRecipe = (recipe: Recipe) => {
    if (!recipe.unlocked) {
      toast({ title: 'Recipe locked!', description: `Reach level ${Math.ceil(recipes.indexOf(recipe) / 2) + 3} to unlock`, variant: 'destructive' });
      return;
    }
    setSelectedRecipe(recipe);
  };

  const completeRecipe = () => {
    if (!selectedRecipe) return;
    
    setXp(prev => prev + selectedRecipe.xp);
    setCoins(prev => prev + Math.floor(selectedRecipe.xp / 2));
    
    setRecipes(prev => prev.map(r => 
      r.id === selectedRecipe.id ? { ...r, completed: true } : r
    ));
    
    setSelectedRecipe(null);
    setShowCongrats(true);
    
    if (xp + selectedRecipe.xp >= totalXp) {
      setLevel(prev => prev + 1);
      setXp((xp + selectedRecipe.xp) - totalXp);
      setTotalXp(prev => prev + 250);
    }
  };

  const currentAvatar = avatars.find(a => a.id === selectedAvatar);
  const completedRecipes = recipes.filter(r => r.completed).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        <div className="animate-bounce">
          <ChefHat className="w-16 h-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-orange-400 via-pink-500 to-purple-600 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-3xl shadow-2xl`}>
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefMiiLogo size={40} />
            <span className="text-2xl font-bold">MiniChef</span>
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="bg-white/20 rounded-2xl p-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-yellow-300 shadow-lg">
                  <AvatarImage src={currentAvatar?.image} />
                  <AvatarFallback className="bg-orange-400 text-2xl">{profile?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full px-2 py-0.5 text-xs font-bold text-orange-800">
                  Lv.{level}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{profile?.full_name || 'Young Chef'}</p>
                <p className="text-xs text-white/80">{currentAvatar?.name}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP: {xp}/{totalXp}</span>
                  </div>
                  <Progress value={(xp / totalXp) * 100} className="h-2 bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-2 flex justify-center gap-4">
          <div className="bg-yellow-400 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <Star className="w-5 h-5 text-yellow-800 fill-yellow-800" />
            <span className="font-bold text-yellow-800">{coins}</span>
          </div>
          <div className="bg-orange-400 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
            <Flame className="w-5 h-5 text-white" />
            <span className="font-bold">{streak} days</span>
          </div>
        </div>

        <nav className="px-4 mt-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === item.id 
                  ? 'bg-white text-gray-800 shadow-lg transform scale-105' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <item.icon className={`w-6 h-6 ${activeNav === item.id ? item.color : ''}`} />
              <span className="font-semibold">{item.label}</span>
              {item.id === 'achievements' && (
                <Badge className="ml-auto bg-yellow-400 text-yellow-800 border-none">{unlockedAchievements}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Exit Kitchen
          </Button>
        </div>
      </aside>

      <main className="lg:ml-72 p-4 md:p-8">
        {activeNav === 'home' && (
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center lg:justify-start gap-3">
                Hey, {profile?.full_name?.split(' ')[0]}! 
                <span className="text-4xl animate-wave">👋</span>
              </h1>
              <p className="text-lg text-gray-600 mt-1">Ready to cook something yummy today?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white border-none shadow-lg">
                <CardContent className="p-4 text-center">
                  <Utensils className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{completedRecipes}</p>
                  <p className="text-sm text-green-100">Recipes Made</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-400 to-purple-500 text-white border-none shadow-lg">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{unlockedAchievements}</p>
                  <p className="text-sm text-purple-100">Achievements</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white border-none shadow-lg">
                <CardContent className="p-4 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{streak}</p>
                  <p className="text-sm text-orange-100">Day Streak</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-pink-400 to-pink-500 text-white border-none shadow-lg">
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{level}</p>
                  <p className="text-sm text-pink-100">Chef Level</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 border-none shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <Badge className="bg-yellow-500 text-yellow-900 mb-2">Today's Challenge</Badge>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">🌈 Rainbow Smoothie Bowl</h3>
                    <p className="text-gray-600 mb-4">Create a colorful smoothie bowl with fruits and toppings!</p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> 15 min</span>
                      <span className="flex items-center gap-1 text-sm"><Zap className="w-4 h-4 text-yellow-500" /> +100 XP</span>
                      <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 text-yellow-500" /> +50 coins</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg">
                      <Play className="w-4 h-4 mr-2" /> Start Challenge
                    </Button>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop" 
                    alt="Smoothie Bowl"
                    className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Book className="w-6 h-6 text-green-500" />
                Continue Cooking
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.filter(r => !r.completed && r.unlocked).slice(0, 3).map((recipe) => (
                  <Card 
                    key={recipe.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-primary"
                    onClick={() => startRecipe(recipe)}
                  >
                    <div className="relative">
                      <img src={recipe.image} alt={recipe.name} className="w-full h-36 object-cover" />
                      <Badge className={`absolute top-2 right-2 ${difficultyColors[recipe.difficulty]}`}>
                        {Array(difficultyStars[recipe.difficulty]).fill('⭐').join('')}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{recipe.name}</h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.time}</span>
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold"><Zap className="w-4 h-4" /> +{recipe.xp} XP</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                Recent Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                  <Card key={achievement.id} className="bg-gradient-to-br from-purple-100 to-pink-100 border-none text-center p-4">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <p className="font-bold text-sm">{achievement.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === 'recipes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Recipe Book 📖</h1>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {completedRecipes}/{recipes.length} Completed
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className={`overflow-hidden cursor-pointer transition-all ${
                    recipe.unlocked 
                      ? 'hover:shadow-xl hover:scale-105' 
                      : 'opacity-75 grayscale'
                  } ${recipe.completed ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => startRecipe(recipe)}
                >
                  <div className="relative">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-40 object-cover" />
                    {!recipe.unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {recipe.completed && (
                      <div className="absolute top-2 left-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <Badge className={`absolute top-2 right-2 ${difficultyColors[recipe.difficulty]}`}>
                      {recipe.difficulty}
                    </Badge>
                    <Badge className="absolute bottom-2 left-2 bg-white/90 text-gray-800">
                      {recipe.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{recipe.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.time}</span>
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold"><Zap className="w-4 h-4" /> +{recipe.xp} XP</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">My Achievements 🏆</h1>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {unlockedAchievements}/{achievements.length} Unlocked
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 border-2 border-yellow-400' 
                      : 'bg-gray-100 opacity-75'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`text-5xl ${!achievement.unlocked ? 'grayscale' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{achievement.name}</h3>
                          {achievement.unlocked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.target}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'avatar' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Chef Avatar 👨‍🍳</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 border-none">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-48 h-48 mx-auto border-8 border-white shadow-2xl mb-4">
                    <AvatarImage src={currentAvatar?.image} />
                    <AvatarFallback className="text-6xl bg-orange-400">{profile?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                  <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg px-4 py-1">
                    {currentAvatar?.name}
                  </Badge>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-800">{level}</p>
                      <p className="text-sm text-gray-600">Level</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600">{coins}</p>
                      <p className="text-sm text-gray-600">Coins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600">{streak}</p>
                      <p className="text-sm text-gray-600">Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Choose Your Avatar</CardTitle>
                  <CardDescription>Unlock more avatars by leveling up!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {avatars.map((avatar) => (
                      <div 
                        key={avatar.id}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAvatar === avatar.id 
                            ? 'border-primary bg-primary/10 shadow-lg' 
                            : avatar.unlocked 
                              ? 'border-gray-200 hover:border-primary/50' 
                              : 'border-gray-200 opacity-50'
                        }`}
                        onClick={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
                      >
                        <Avatar className="w-20 h-20 mx-auto mb-2">
                          <AvatarImage src={avatar.image} className={!avatar.unlocked ? 'grayscale' : ''} />
                          <AvatarFallback>👨‍🍳</AvatarFallback>
                        </Avatar>
                        <p className="text-center font-semibold text-sm">{avatar.name}</p>
                        {!avatar.unlocked && (
                          <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock className="w-6 h-6 mx-auto mb-1" />
                              <p className="text-xs">Level {avatar.requiredLevel}</p>
                            </div>
                          </div>
                        )}
                        {selectedAvatar === avatar.id && avatar.unlocked && (
                          <CheckCircle2 className="absolute top-2 right-2 w-6 h-6 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedRecipe?.name} 
              <Badge className={selectedRecipe ? difficultyColors[selectedRecipe.difficulty] : ''}>
                {selectedRecipe?.difficulty}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={selectedRecipe?.image} 
              alt={selectedRecipe?.name} 
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> {selectedRecipe?.time}</span>
              <span className="flex items-center gap-2 text-yellow-600 font-bold"><Zap className="w-5 h-5" /> +{selectedRecipe?.xp} XP</span>
            </div>
            <div>
              <h4 className="font-bold mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecipe?.ingredients.map((ing, i) => (
                  <Badge key={i} variant="outline">{ing}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedRecipe(null)}>Maybe Later</Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600"
              onClick={completeRecipe}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> I Made It!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="text-center">
          <div className="py-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Amazing Job!</h2>
            <p className="text-muted-foreground mb-4">You completed the recipe!</p>
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">+{selectedRecipe?.xp || 50}</p>
                <p className="text-sm text-muted-foreground">XP Earned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">+{Math.floor((selectedRecipe?.xp || 50) / 2)}</p>
                <p className="text-sm text-muted-foreground">Coins</p>
              </div>
            </div>
            <Button onClick={() => setShowCongrats(false)} className="bg-gradient-to-r from-orange-500 to-pink-500">
              Keep Cooking!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
