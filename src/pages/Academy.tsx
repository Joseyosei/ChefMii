import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
Play, Clock, Users, Award, Star, ChefHat, BookOpen, Loader2, 
Search, ChevronRight, ChevronLeft, ShoppingCart, Percent, Timer,
ChevronDown, MoreHorizontal, Bell, Briefcase, GraduationCap, CheckCircle2,
Lock, ArrowRight, Sparkles, Map as MapIcon, PlaySquare, Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  students_count: number | null;
  rating: number | null;
  price: number;
  original_price?: number;
  image_url: string | null;
  category: string | null;
  description: string | null;
  is_best_seller?: boolean;
}

  interface Skill {
    id: string;
    name: string;
    level: number;
    xp: number;
    icon: string;
    category: string;
  }

  const Academy = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState("01:26:31");

    useEffect(() => {
      fetchCourses();
      if (user) {
        fetchSkills();
      } else {
        setSkills([]);
      }
      
      // Improved timer logic
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const parts = prev.split(':').map(Number);
          let s = parts[2] - 1;
          let m = parts[1];
          let h = parts[0];
          if (s < 0) { s = 59; m--; }
          if (m < 0) { m = 59; h--; }
          if (h < 0) { h = 23; }
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }, [user]);

    const fetchSkills = async () => {
      try {
        // Fetch all base skills
        const { data: baseSkills, error: skillsError } = await supabase
          .from("academy_skills")
          .select("*");
        
        if (skillsError) throw skillsError;

        // Fetch user progress for these skills
        const { data: userSkills, error: userSkillsError } = await supabase
          .from("academy_user_skills")
          .select("*")
          .eq("user_id", user?.id);
        
        if (userSkillsError) throw userSkillsError;

        const mergedSkills = baseSkills.map(skill => {
          const userProgress = userSkills?.find(us => us.skill_id === skill.id);
          return {
            ...skill,
            level: userProgress?.level || 1,
            xp: userProgress?.xp || 0
          };
        });

        setSkills(mergedSkills);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("academy_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        setCourses(defaultCourses);
      } else {
        setCourses(data && data.length > 0 ? data : defaultCourses);
      }
    } catch (err) {
      console.error("Fetch catch error:", err);
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

    const handleEnroll = (course: Course) => {
      navigate(`/academy/course/${course.id}`);
    };

  const handlePayment = async () => {
    if (!user || !selectedCourse) return;

    setEnrolling(selectedCourse.id);

    try {
      const response = await supabase.functions.invoke("create-checkout", {
        body: {
          type: "course",
          items: [{
            name: selectedCourse.title,
            price: selectedCourse.price,
            quantity: 1,
            image: selectedCourse.image_url || undefined,
          }],
          metadata: {
            course_id: selectedCourse.id,
            course_title: selectedCourse.title,
            instructor: selectedCourse.instructor_name,
          },
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=course`,
          cancelUrl: `${window.location.origin}/academy`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create checkout session");
      }

      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setEnrolling(null);
      setShowEnrollDialog(false);
    }
  };

  const defaultCourses: Course[] = [
    {
      id: "1",
      title: "Food Safety Mastery",
      instructor_name: "Chef Marco Ricci",
      level: "Intermediate",
      duration: "8 weeks",
      students_count: 1240,
      rating: 4.9,
      price: 9.99,
      original_price: 299,
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      category: "Safety",
      description: "Comprehensive guide to food safety and handling in professional kitchens.",
      is_best_seller: true,
      products_used: ["Professional Chef Knife Set"]
    },
    {
      id: "2",
      title: "Professional Kitchen Hygiene",
      instructor_name: "Chef Yuki Tanaka",
      level: "Beginner",
      duration: "6 weeks",
      students_count: 890,
      rating: 5.0,
      price: 9.99,
      original_price: 349,
      image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      category: "Hygiene",
      description: "Learn essential hygiene practices for maintaining a clean and safe workspace.",
      is_best_seller: true,
      products_used: ["Professional Chef Knife Set"]
    },
    {
      id: "3",
      title: "Advanced Culinary Techniques",
      instructor_name: "Chef Sophie Laurent",
      level: "Advanced",
      duration: "12 weeks",
      students_count: 650,
      rating: 4.8,
      price: 9.99,
      original_price: 499,
      image_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      category: "Food",
      description: "Master advanced cooking techniques used by world-class chefs.",
      is_best_seller: true,
      products_used: ["Premium Truffle Oil", "Professional Chef Knife Set"]
    },
    {
      id: "4",
      title: "Mediterranean Cuisine",
      instructor_name: "Chef Maria Santos",
      level: "Beginner",
      duration: "6 weeks",
      students_count: 1050,
      rating: 4.9,
      price: 9.99,
      original_price: 279,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      category: "Food",
      description: "Healthy and delicious Mediterranean recipes for every day.",
      is_best_seller: false,
      products_used: ["Chef Emma's Signature Pasta Sauce", "Tokyo Spice Blend Collection"]
    }
  ];

  const categories = [
    { name: "Food", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80" },
    { name: "Safety", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80" },
    { name: "Hygiene", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80" },
    { name: "Culinary Arts", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80" },
    { name: "Pastry & Baking", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
    { name: "Fine Dining", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
  ];

  const displayCourses = courses.length > 0 ? courses : defaultCourses;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Sale Banner */}
      <div className="bg-[#FF4B2B] text-white py-2 px-4 sticky top-0 z-[60]">
        <div className="container mx-auto flex justify-between items-center text-xs md:text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="bg-white text-[#FF4B2B] px-2 py-0.5 rounded italic">SALE</span>
            <span>All courses at £9.99 each</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <span>{timeLeft.split(':')[0]}</span>
                <span className="text-[10px] opacity-80">hours</span>
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <span>{timeLeft.split(':')[1]}</span>
                <span className="text-[10px] opacity-80">mins</span>
              </div>
              <span>:</span>
              <div className="flex flex-col items-center">
                <span>{timeLeft.split(':')[2]}</span>
                <span className="text-[10px] opacity-80">secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />

      {/* Academy Sub-nav */}
      <div className="bg-[#1a1a1a] text-white border-t border-white/10">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/academy" className="text-xl font-black italic tracking-tighter">CHEFMII ACADEMY</Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/70">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-primary transition-colors flex items-center gap-1 outline-none">
                    Courses <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-xl z-[70]">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.name} className="cursor-pointer hover:bg-gray-100 font-semibold py-2 text-black">
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 font-bold text-primary py-2" onClick={() => navigate('/academy-pricing')}>
                    Academy Pricing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                <a href="#skill-tree" className="hover:text-primary transition-colors">Skill Tree</a>
                <Link to="/academy-pricing" className="hover:text-primary transition-colors text-[#FF4B2B]">Pricing</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search for courses" 
                className="w-full bg-white/10 border-none rounded py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button className="hover:text-primary transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-[#FF4B2B] text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </div>

      <main>
        {/* Recommended Courses Grid - NOW FIRST */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tight mb-2">Recommended for you</h2>
                <div className="w-20 h-1.5 bg-primary" />
              </div>
              <Button variant="ghost" className="font-black hover:text-primary group">
                VIEW ALL COURSES <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayCourses.map((course) => (
                <div key={course.id} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-[30px] overflow-hidden mb-6 shadow-xl bg-muted">
                    <img 
                      src={course.image_url || ""} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {course.is_best_seller && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-[#FFD700] text-black border-none rounded-full uppercase text-[10px] px-3 py-1 font-black shadow-lg">BEST SELLER</Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0">
                        <Play className="h-6 w-6 fill-primary text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 px-2">
                     <Badge variant="outline" className="border-primary/20 text-primary/70 rounded-full uppercase text-[9px] font-black">{course.category}</Badge>
                     <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-black">{course.rating}</span>
                     </div>
                  </div>
                    <h3 className="font-black text-xl leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors px-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest px-2">By {course.instructor_name}</p>
                    
                    {course.products_used && course.products_used.length > 0 && (
                      <div className="px-2 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="h-3 w-3 text-orange-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Shop Tools & Ingredients</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {course.products_used.map((product: string, idx: number) => (
                            <Link 
                              key={idx} 
                              to={`/marketplace?search=${encodeURIComponent(product)}`}
                              className="text-[8px] font-bold bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-colors px-2 py-0.5 rounded border border-gray-100"
                            >
                              {product}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
                    <span className="text-2xl font-black italic">£{course.price}</span>
                    <Button 
                      onClick={() => handleEnroll(course)}
                      className="bg-[#1a1a1a] hover:bg-black text-white font-black h-10 px-6 rounded-full flex items-center gap-2 shadow-lg"
                    >
                      ENROLL <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-12 bg-[#f5f5f5]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 px-3 py-1">
                  <GraduationCap className="h-4 w-4" />
                  ACCREDITED PATHWAY
                </Badge>
                <h2 className="text-3xl font-black italic">Start Your Professional Journey</h2>
              </div>
            </div>

            <Card className="p-0 border-none shadow-2xl overflow-hidden group bg-white rounded-[40px]">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[50%] relative overflow-hidden">
                  <img 
                    src={displayCourses[0].image_url || ""} 
                    alt={displayCourses[0].title} 
                    className="w-full h-full object-cover aspect-video md:aspect-auto group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12">
                     <div className="text-white">
                        <Badge className="bg-[#FF4B2B] mb-4">LEVEL 1: FOUNDATIONS</Badge>
                        <h3 className="text-4xl font-black mb-4 leading-tight">Professional Kitchen <br/>Command & Safety</h3>
                        <p className="text-white/80 max-w-md mb-6 font-semibold">Master the core disciplines required for Michelin-star kitchen operations. Accredited by the Global Culinary Board.</p>
                        <Button className="bg-white text-black hover:bg-gray-100 font-bold px-8 h-12 rounded-full">
                          WATCH TRAILER <Play className="ml-2 h-4 w-4 fill-current" />
                        </Button>
                     </div>
                  </div>
                </div>
                  <div className="flex-1 p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                      {user ? (
                        <>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Current Progress</h4>
                            <Progress value={45} className="h-3 bg-gray-100" />
                            <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                              <span>4/9 MODULES COMPLETED</span>
                              <span>45%</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { title: "Chemical Handling & Safety", status: "completed" },
                              { title: "Cross-Contamination Prevention", status: "in_progress" },
                              { title: "HACCP Compliance Mastery", status: "locked" },
                            ].map((module, i) => (
                              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${module.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                  {module.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : module.status === 'in_progress' ? <Play className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-gray-300" />}
                                  <span className={`font-bold ${module.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>{module.title}</span>
                                </div>
                                {module.status === 'in_progress' && <Badge className="bg-primary text-white">CONTINUE</Badge>}
                              </div>
                            ))}
                          </div>
                          
                          <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white font-black py-7 text-lg rounded-xl flex items-center justify-center gap-3">
                            RESUME LEARNING <ArrowRight className="h-5 w-5" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center space-y-6 py-8">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Lock className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black italic mb-2">Track Your Progress</h4>
                            <p className="text-gray-500 font-semibold">Sign up to unlock your personal learning dashboard and track your culinary journey.</p>
                          </div>
                          <Button 
                            onClick={() => navigate('/register?redirect=/academy')}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-7 text-lg rounded-xl"
                          >
                            GET STARTED FOR FREE
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
          </Card>
        </div>
      </section>

      {/* Skill Tree & Path Section */}
        <section id="skill-tree" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Sparkles className="h-3 w-3" /> Gamified Learning
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Culinary Skill Tree</h2>
              <p className="text-xl text-gray-500 font-semibold leading-relaxed">Unlock new levels, earn verified badges, and build your professional profile as you master each culinary branch.</p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />
              
              <Tabs defaultValue="foundations" className="w-full">
                <div className="flex justify-center mb-12">
                  <TabsList className="bg-gray-100 p-1 rounded-full h-14 border border-gray-200">
                    <TabsTrigger value="foundations" className="rounded-full px-8 font-black uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-lg">Foundations</TabsTrigger>
                    <TabsTrigger value="techniques" className="rounded-full px-8 font-black uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-lg">Techniques</TabsTrigger>
                    <TabsTrigger value="business" className="rounded-full px-8 font-black uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:shadow-lg">Business</TabsTrigger>
                  </TabsList>
                </div>

                  <TabsContent value="foundations">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                      {user ? (
                        skills.filter(s => s.category === 'foundations').length > 0 ? (
                          skills.filter(s => s.category === 'foundations').map((skill, i) => (
                            <motion.div 
                              key={skill.id}
                              whileHover={{ y: -10 }}
                              className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
                            >
                              <div className={`w-20 h-20 rounded-2xl bg-primary/10 text-4xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {skill.icon}
                              </div>
                              <h4 className="text-2xl font-black mb-2">{skill.name}</h4>
                              <div className="w-full bg-gray-100 h-2 rounded-full mb-3">
                                <div className={`h-full bg-primary rounded-full`} style={{ width: `${(skill.xp % 100)}%` }} />
                              </div>
                              <div className="flex justify-between w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>LEVEL {skill.level}</span>
                                <span>{skill.xp % 100}/100 XP</span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full py-12 text-center text-gray-400 font-bold italic">
                            No foundation skills found.
                          </div>
                        )
                      ) : (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                          <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-2xl font-black italic mb-2">Unlock Your Skill Tree</h4>
                          <p className="text-gray-500 font-bold mb-8">Register now to start earning XP and tracking your culinary expertise.</p>
                          <Button 
                            onClick={() => navigate('/register?redirect=/academy')}
                            className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-full"
                          >
                            CREATE YOUR PROFILE
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                
                <TabsContent value="techniques">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                    {user && skills.filter(s => s.category === 'techniques').map((skill, i) => (
                      <motion.div 
                        key={skill.id}
                        whileHover={{ y: -10 }}
                        className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
                      >
                        <div className={`w-20 h-20 rounded-2xl bg-primary/10 text-4xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                          {skill.icon}
                        </div>
                        <h4 className="text-2xl font-black mb-2">{skill.name}</h4>
                        <div className="w-full bg-gray-100 h-2 rounded-full mb-3">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${(skill.xp % 100)}%` }} />
                        </div>
                        <div className="flex justify-between w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>LEVEL {skill.level}</span>
                          <span>{skill.xp % 100}/100 XP</span>
                        </div>
                      </motion.div>
                    ))}
                    {!user || skills.filter(s => s.category === 'techniques').length === 0 ? (
                      <div className="col-span-full flex items-center justify-center h-64 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <div className="text-center">
                          <Lock className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                          <p className="font-bold text-gray-400">Complete Level 1 Foundations to unlock advanced techniques.</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </TabsContent>
                
                <TabsContent value="business">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                    {user && skills.filter(s => s.category === 'business').map((skill, i) => (
                      <motion.div 
                        key={skill.id}
                        whileHover={{ y: -10 }}
                        className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center group"
                      >
                        <div className={`w-20 h-20 rounded-2xl bg-primary/10 text-4xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                          {skill.icon}
                        </div>
                        <h4 className="text-2xl font-black mb-2">{skill.name}</h4>
                        <div className="w-full bg-gray-100 h-2 rounded-full mb-3">
                          <div className={`h-full bg-primary rounded-full`} style={{ width: `${(skill.xp % 100)}%` }} />
                        </div>
                        <div className="flex justify-between w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span>LEVEL {skill.level}</span>
                          <span>{skill.xp % 100}/100 XP</span>
                        </div>
                      </motion.div>
                    ))}
                    {!user || skills.filter(s => s.category === 'business').length === 0 ? (
                      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 col-span-full">
                        <div className="text-center">
                          <Lock className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                          <p className="font-bold text-gray-400">Management modules require Technique Mastery.</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Academy Marketplace Cross-Link */}
          <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="max-w-xl">
                  <Badge className="bg-orange-100 text-orange-600 border-none mb-4">Master the Tools</Badge>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">The Chef’s Pantry</h2>
                  <p className="text-lg text-gray-500 font-medium">Get the exact ingredients and professional tools used by our instructors in their masterclasses. Elevate your practice with pro-grade supplies.</p>
                </div>
                <Button 
                  onClick={() => navigate('/marketplace')}
                  size="lg" 
                  className="bg-[#1a1a1a] hover:bg-black text-white font-black px-10 h-16 rounded-2xl shadow-xl flex items-center gap-3 shrink-0"
                >
                  SHOP ALL SUPPLIES <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Signature Truffle Oil", cat: "Oils", price: "45.00", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80", course: "Advanced Culinary Techniques" },
                  { name: "Tokyo Spice Blend", cat: "Spices", price: "24.99", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", course: "Mediterranean Cuisine" },
                  { name: "Chef's Knife Set", cat: "Cookware", price: "199.99", img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80", course: "Knife Skills Mastery" },
                ].map((product, i) => (
                  <Card key={i} className="bg-white border-none shadow-xl rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={product.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black border-none backdrop-blur font-black text-[9px] uppercase tracking-widest">{product.cat}</Badge>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <PlaySquare className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Used in: {product.course}</span>
                      </div>
                      <h3 className="text-xl font-black italic mb-6">{product.name}</h3>
                      <div className="flex items-center justify-between pt-6 border-t">
                        <span className="text-2xl font-black italic">£{product.price}</span>
                        <Button variant="outline" className="rounded-full font-black text-xs hover:bg-primary hover:text-white transition-all">ADD TO CART</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

        {/* Recommended Courses Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tight mb-2">Recommended for you</h2>
                <div className="w-20 h-1.5 bg-primary" />
              </div>
              <Button variant="ghost" className="font-black hover:text-primary group">
                VIEW ALL COURSES <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayCourses.map((course) => (
                <div key={course.id} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-[30px] overflow-hidden mb-6 shadow-xl bg-muted">
                    <img 
                      src={course.image_url || ""} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {course.is_best_seller && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-[#FFD700] text-black border-none rounded-full uppercase text-[10px] px-3 py-1 font-black shadow-lg">BEST SELLER</Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0">
                        <Play className="h-6 w-6 fill-primary text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3 px-2">
                     <Badge variant="outline" className="border-primary/20 text-primary/70 rounded-full uppercase text-[9px] font-black">{course.category}</Badge>
                     <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-black">{course.rating}</span>
                     </div>
                  </div>
                    <h3 className="font-black text-xl leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors px-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest px-2">By {course.instructor_name}</p>
                    
                    {course.products_used && course.products_used.length > 0 && (
                      <div className="px-2 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="h-3 w-3 text-orange-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Shop Tools & Ingredients</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {course.products_used.map((product: string, idx: number) => (
                            <Link 
                              key={idx} 
                              to={`/marketplace?search=${encodeURIComponent(product)}`}
                              className="text-[8px] font-bold bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-colors px-2 py-0.5 rounded border border-gray-100"
                            >
                              {product}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
                    <span className="text-2xl font-black italic">£{course.price}</span>
                    <Button 
                      onClick={() => handleEnroll(course)}
                      className="bg-[#1a1a1a] hover:bg-black text-white font-black h-10 px-6 rounded-full flex items-center gap-2 shadow-lg"
                    >
                      ENROLL <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Master Every Discipline</h2>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Explore specialized culinary branches</p>
             </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square rounded-[40px] overflow-hidden mb-4 bg-white shadow-lg border border-white hover:border-primary/20 transition-all">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h4 className="font-black text-xs text-center uppercase tracking-widest group-hover:text-primary transition-colors">{cat.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-[40px] p-8 z-[100]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Enrollment</DialogTitle>
            <DialogDescription className="font-bold text-gray-400 uppercase tracking-widest text-xs pt-1">
              Secure your professional seat
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-8 py-4">
              <div className="flex gap-6 items-center bg-gray-50 p-4 rounded-3xl">
                <div className="w-24 aspect-video rounded-xl overflow-hidden shadow-lg shrink-0">
                  <img 
                    src={selectedCourse.image_url || ""} 
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-black text-lg leading-tight">{selectedCourse.title}</p>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">{selectedCourse.instructor_name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                  <span className="text-gray-400">Tuition Fee</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 line-through">£{selectedCourse.original_price}</span>
                    <span className="text-2xl text-primary italic">£{selectedCourse.price}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center font-black italic">
                  <span className="text-xl">TOTAL</span>
                  <span className="text-3xl">£{selectedCourse.price}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="ghost" onClick={() => setShowEnrollDialog(false)} className="font-black uppercase tracking-widest text-xs h-14 rounded-2xl border-2 border-gray-100">
                  CANCEL
                </Button>
                <Button onClick={handlePayment} className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs h-14 rounded-2xl shadow-xl" disabled={enrolling === selectedCourse.id}>
                  {enrolling === selectedCourse.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "PROCEED TO PAY"
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Shield className="h-3 w-3" /> SECURE STRIPE CHECKOUT
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Academy;
