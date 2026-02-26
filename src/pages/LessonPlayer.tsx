import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Play, Clock, CheckCircle2, ChevronRight, ChevronLeft, 
  BookOpen, ShoppingCart, Loader2, ArrowLeft, Menu, X, Star,
  Award, MessageSquare, Download, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/hooks/useCart";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  video_url: string;
  order_index: number;
}

interface Product {
  name: string;
  price: number;
  image: string;
}

interface Course {
  id: string;
  title: string;
  instructor_name: string;
  related_products?: Product[];
}

const LessonPlayer = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLessonId = searchParams.get("lesson");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/academy/player/${id}`);
      return;
    }
    fetchCourseAndLessons();
  }, [id, user]);

  const fetchCourseAndLessons = async () => {
    try {
      // Check enrollment first
      const { data: enrollment, error: enrollError } = await supabase
        .from("academy_enrollments")
        .select("id")
        .eq("user_id", user?.id)
        .eq("course_id", id)
        .maybeSingle();

      if (!enrollment) {
        toast({ title: "Please enroll to access lessons", variant: "destructive" });
        navigate(`/academy/course/${id}`);
        return;
      }

      // Fetch course info
      const { data: courseData } = await supabase
        .from("academy_courses")
        .select("id, title, instructor_name, related_products")
        .eq("id", id)
        .single();
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from("academy_lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index", { ascending: true });
      
      const sortedLessons = lessonsData || [];
      setLessons(sortedLessons);

      // Set current lesson
      if (currentLessonId) {
        const found = sortedLessons.find(l => l.id === currentLessonId);
        setCurrentLesson(found || sortedLessons[0]);
      } else {
        setCurrentLesson(sortedLessons[0]);
      }

      // Fetch completed lessons
      const { data: progressData } = await supabase
        .from("academy_user_progress")
        .select("lesson_id")
        .eq("user_id", user?.id);
      
      setCompletedLessons(progressData?.map(p => p.lesson_id) || []);
    } catch (err) {
      console.error("Error fetching player data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setSearchParams({ lesson: lesson.id });
  };

  const toggleComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      if (completedLessons.includes(lessonId)) {
        await supabase
          .from("academy_user_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
      } else {
        await supabase
          .from("academy_user_progress")
          .insert({ user_id: user.id, lesson_id: lessonId });
        setCompletedLessons(prev => [...prev, lessonId]);
        
        // Award XP
        awardXP();
        
        toast({ title: "Lesson marked as completed!", className: "bg-green-500 text-white border-none font-black" });
        
        // Handle course completion
        if (completedLessons.length + 1 === lessons.length) {
          handleCourseCompletion();
        }
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const awardXP = async () => {
    try {
      // Get skill_id for this course
      const { data: courseData } = await supabase
        .from("academy_courses")
        .select("skill_id")
        .eq("id", id)
        .single();
      
      if (!courseData?.skill_id) return;

      // Get current XP
      const { data: userSkill } = await supabase
        .from("academy_user_skills")
        .select("*")
        .eq("user_id", user?.id)
        .eq("skill_id", courseData.skill_id)
        .maybeSingle();
      
      const currentXP = userSkill?.xp || 0;
      const currentLevel = userSkill?.level || 1;
      const newXP = currentXP + 25; // 25 XP per lesson
      const newLevel = Math.floor(newXP / 100) + 1;

      if (userSkill) {
        await supabase
          .from("academy_user_skills")
          .update({ xp: newXP, level: newLevel, updated_at: new Date().toISOString() })
          .eq("id", userSkill.id);
      } else {
        await supabase
          .from("academy_user_skills")
          .insert({ 
            user_id: user?.id, 
            skill_id: courseData.skill_id, 
            xp: newXP, 
            level: newLevel 
          });
      }

      if (newLevel > currentLevel) {
        toast({ 
          title: "LEVEL UP!", 
          description: `You reached level ${newLevel} in this skill!`,
          className: "bg-yellow-500 text-white border-none font-black"
        });
      }
    } catch (err) {
      console.error("Error awarding XP:", err);
    }
  };

  const handleCourseCompletion = async () => {
    try {
      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from("academy_certificates")
        .select("id")
        .eq("user_id", user?.id)
        .eq("course_id", id)
        .maybeSingle();
      
      if (existingCert) {
        toast({ title: "Course completed again!", description: "You already have a certificate for this course." });
        return;
      }

      // Create certificate record
      const { data: cert, error } = await supabase
        .from("academy_certificates")
        .insert({
          user_id: user?.id,
          course_id: id,
          issue_date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;

      toast({ 
        title: "🎉 CONGRATULATIONS!", 
        description: "You've completed the course. Your certificate is ready!",
        className: "bg-[#1a1a1a] text-white border-primary border-2 font-black"
      });

      // Navigate to certificate view
      setTimeout(() => {
        navigate(`/academy/certificate/${cert.id}`);
      }, 3000);

    } catch (err) {
      console.error("Error generating certificate:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!currentLesson) return null;

  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Player Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#1a1a1a] z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/academy/course/${id}`)} className="text-white/60 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <h1 className="text-sm md:text-base font-black italic tracking-tight line-clamp-1">
              {course?.title}
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              BY {course?.instructor_name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Your Progress</span>
            <div className="flex items-center gap-3 w-48">
              <Progress value={progressPercentage} className="h-1.5 bg-white/5" />
              <span className="text-[10px] font-black text-primary">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Player Area */}
        <main className="flex-1 overflow-y-auto bg-[#050505] relative">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Video Container */}
            <div className="aspect-video bg-black rounded-[30px] overflow-hidden shadow-2xl relative mb-8 group">
              <video 
                key={currentLesson.video_url}
                className="w-full h-full object-contain"
                controls
                src={currentLesson.video_url}
              />
              <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge className="bg-black/60 backdrop-blur border-white/10 text-white font-black text-[10px] px-3 py-1">
                  MODULE {currentLesson.order_index}
                </Badge>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <div className="flex-1">
                <h2 className="text-3xl font-black italic uppercase tracking-tight mb-4">{currentLesson.title}</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Badge variant="outline" className="border-white/10 text-white/60 font-black text-[10px] px-3 py-1">
                    <Clock className="h-3 w-3 mr-2" /> {currentLesson.duration}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 text-white/60 font-black text-[10px] px-3 py-1">
                    <BookOpen className="h-3 w-3 mr-2" /> TRANSCRIPT AVAILABLE
                  </Badge>
                  <Badge variant="outline" className="border-white/10 text-white/60 font-black text-[10px] px-3 py-1">
                    <Star className="h-3 w-3 mr-2" /> TOP RATED LESSON
                  </Badge>
                </div>
                
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start h-auto p-0 mb-8">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-black uppercase tracking-widest px-8 pb-4">Overview</TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-black uppercase tracking-widest px-8 pb-4">Notes</TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-black uppercase tracking-widest px-8 pb-4">Resources</TabsTrigger>
                    <TabsTrigger value="qa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-black uppercase tracking-widest px-8 pb-4">Q&A</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <p className="text-lg text-white/60 font-medium leading-relaxed">
                      {currentLesson.description || "No description available for this lesson."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                      <Card className="p-6 bg-white/5 border-white/10 rounded-[30px]">
                        <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-4">Key Takeaways</h4>
                        <ul className="space-y-3">
                          {[
                            "Mastering professional equipment hygiene",
                            "Understanding chemical cross-contamination",
                            "Implementing real-time safety checklists"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-white/80">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-1" /> {item}
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <Card className="p-6 bg-white/5 border-white/10 rounded-[30px]">
                        <h4 className="font-black text-sm uppercase tracking-widest text-primary mb-4">Chef's Pro Tip</h4>
                        <p className="text-sm font-medium italic text-white/70">
                          "Always treat your workspace as a surgical theatre. Precision and cleanliness aren't just for safety; they're the foundation of elite culinary performance."
                        </p>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-0">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                         <h4 className="font-black text-lg italic">Personal Study Notes</h4>
                         <Button variant="outline" className="border-white/10 text-white font-black text-[10px] uppercase tracking-widest">ADD NEW NOTE</Button>
                       </div>
                       <div className="bg-white/5 border-dashed border-2 border-white/10 rounded-[30px] p-12 text-center">
                          <p className="text-white/30 font-bold italic">You haven't added any notes for this module yet.</p>
                       </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Safety Checklist.pdf", size: "2.4 MB" },
                        { title: "HACCP Guidelines.pdf", size: "5.1 MB" },
                        { title: "Kitchen Ops Chart.png", size: "1.2 MB" },
                      ].map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary/50 transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Download className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{file.title}</p>
                              <p className="text-[10px] font-black text-white/40">{file.size}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-primary" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Lesson Sidebar Actions */}
              <div className="w-full md:w-80 space-y-6">
                <Button 
                  onClick={() => toggleComplete(currentLesson.id)}
                  className={`w-full h-16 font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${
                    completedLessons.includes(currentLesson.id) 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {completedLessons.includes(currentLesson.id) ? (
                    <>COMPLETED <CheckCircle2 className="h-6 w-6" /></>
                  ) : (
                    <>MARK AS COMPLETED <ChevronRight className="h-6 w-6" /></>
                  )}
                </Button>

                <Card className="p-8 bg-[#1a1a1a] border-white/10 rounded-[40px] shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h4 className="font-black text-lg italic mb-2">Master the Tools</h4>
                  <p className="text-white/50 text-xs font-bold mb-6 uppercase tracking-widest">Get the supplies from this lesson</p>
                  
                  <div className="space-y-4 mb-8">
                    {course?.related_products && course.related_products.length > 0 ? (
                      course.related_products.map((product, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate">{product.name}</p>
                            <p className="text-[10px] font-black text-primary">£{product.price}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-white/40 hover:text-primary hover:bg-primary/10"
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/30 text-[10px] font-bold italic">No related products for this module.</p>
                    )}
                  </div>

                  <Button 
                    onClick={() => navigate('/marketplace')}
                    className="w-full h-12 bg-white text-black hover:bg-gray-100 font-black text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    GO TO MARKETPLACE <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>

                <div className="flex items-center justify-center gap-6">
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                        <Share2 className="h-4 w-4 text-white/40 group-hover:text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Share</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                        <MessageSquare className="h-4 w-4 text-white/40 group-hover:text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Forum</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                        <Award className="h-4 w-4 text-white/40 group-hover:text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">Badges</span>
                   </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Curriculum Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-full md:w-96 bg-[#111111] border-l border-white/10 flex flex-col z-40 fixed md:relative right-0 top-16 md:top-0 h-[calc(100vh-64px)]"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-3">
                  <Menu className="h-5 w-5 text-primary" /> Course Curriculum
                </h3>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {lessons.map((lesson, i) => {
                    const isActive = currentLesson.id === lesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);
                    
                    return (
                      <button 
                        key={lesson.id}
                        onClick={() => handleLessonChange(lesson)}
                        className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden ${
                          isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-primary" />}
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 shrink-0 ${isCompleted ? 'text-green-500' : isActive ? 'text-primary' : 'text-white/20'}`}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-primary' : 'text-white/40'}`}>
                              MODULE {lesson.order_index}
                            </p>
                            <h4 className={`text-sm font-black italic tracking-tight leading-tight ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] font-black text-white/20 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {lesson.duration}
                              </span>
                              {isCompleted && (
                                <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] font-black px-1.5 py-0 h-4">COMPLETED</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="p-6 bg-[#0a0a0a] border-t border-white/10">
                <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white font-black text-xs uppercase tracking-widest h-12 rounded-xl flex items-center justify-center gap-2">
                   NEXT LESSON <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonPlayer;
