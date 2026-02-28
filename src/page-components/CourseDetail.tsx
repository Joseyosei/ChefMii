import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Play, Clock, Users, Star, ChefHat, BookOpen, Loader2, 
  ChevronRight, Lock, CheckCircle2, Shield, Calendar, Globe
} from "lucide-react";
import { motion } from "framer-motion";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  students_count: number;
  rating: number;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("academy_courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("academy_lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index", { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Check enrollment
      if (user) {
        const { data: enrollment, error: enrollError } = await supabase
          .from("academy_enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .maybeSingle();

        if (enrollError) console.error("Enrollment check error:", enrollError);
        setEnrolled(!!enrollment);

        if (enrollment) {
          // Fetch progress
          const { data: progressData } = await supabase
            .from("academy_user_progress")
            .select("lesson_id")
            .eq("user_id", user.id);
          
          const completedLessons = progressData?.filter(p => lessonsData?.some(l => l.id === p.lesson_id)).length || 0;
          setProgress(lessonsData && lessonsData.length > 0 ? (completedLessons / lessonsData.length) * 100 : 0);
        }
      }
    } catch (err) {
      console.error("Error fetching course data:", err);
      toast({ title: "Course not found", variant: "destructive" });
      navigate("/academy");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (!user) {
      toast({ title: "Please login to enroll" });
      navigate(`/register?redirect=/academy/course/${id}`);
      return;
    }
    // Redirect to pricing or checkout
    navigate("/academy-pricing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-[#1a1a1a] text-white py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-primary text-white border-none uppercase tracking-widest text-[10px] px-3 py-1 font-black">
                {course.category}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-black">{course.rating}</span>
                <span className="text-white/40 font-bold ml-1">({course.students_count} students)</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-xl text-white/70 mb-8 font-medium leading-relaxed max-w-2xl">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-white/60">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                <span>By {course.instructor_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>English (Accredited)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white">
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-6">Professional Outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Global Safety Certification",
                  "Michelin-standard Cleanliness",
                  "Cross-contamination Mastery",
                  "Chemical Handling Protocols",
                  "HACCP System Implementation",
                  "Regulatory Compliance Proficiency"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Curriculum */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase tracking-tight">Curriculum</h2>
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  {lessons.length} MODULES • TOTAL {course.duration}
                </span>
              </div>
              
              <div className="space-y-4">
                {lessons.map((lesson, i) => (
                  <motion.div 
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group p-6 rounded-[30px] border transition-all ${
                      enrolled ? 'bg-white hover:border-primary shadow-sm hover:shadow-md cursor-pointer' : 'bg-gray-50 border-gray-100 opacity-80'
                    }`}
                    onClick={() => enrolled && navigate(`/academy/player/${id}?lesson=${lesson.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                          enrolled ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-lg group-hover:text-primary transition-colors">{lesson.title}</h4>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1"><Play className="h-3 w-3" /> VIDEO ({lesson.duration})</span>
                            {lesson.description && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> NOTES</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {!enrolled ? (
                          <Lock className="h-5 w-5 text-gray-300" />
                        ) : (
                          <Button variant="ghost" size="sm" className="rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white">
                            PREVIEW
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white">
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-8">Lead Instructor</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl shrink-0 border-4 border-white">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor_name}`} 
                    alt={course.instructor_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-black italic">{course.instructor_name}</h4>
                  <p className="text-sm font-black text-primary uppercase tracking-widest mb-4">Master Executive Chef • 25+ Years Experience</p>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    A veteran of the culinary arts with three Michelin stars and a passion for teaching the next generation of professional chefs the rigorous standards of elite kitchen operations.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-xs font-black">
                      <Users className="h-4 w-4 text-primary" /> 15k+ Students
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-xs font-black">
                      <Star className="h-4 w-4 text-primary" /> 4.9 Rating
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="sticky top-24 p-8 border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              
              <div className="aspect-video rounded-3xl overflow-hidden mb-8 shadow-inner relative group cursor-pointer">
                <img src={course.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {enrolled ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                        <span>Course Progress</span>
                        <span className="text-primary">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-gray-100" />
                    </div>
                    <Button 
                      onClick={() => navigate(`/academy/player/${id}`)}
                      className="w-full h-16 bg-[#1a1a1a] hover:bg-black text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3"
                    >
                      RESUME LEARNING <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-4xl font-black italic">£{course.price}</span>
                      <Badge className="bg-[#FF4B2B] text-white italic">SAVE 95%</Badge>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">SALE ENDS IN 01:26:31</p>
                    <Button 
                      onClick={handleEnroll}
                      className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl"
                    >
                      ENROLL NOW
                    </Button>
                  </>
                )}

                <div className="space-y-4 pt-6 border-t">
                  <h5 className="font-black text-xs uppercase tracking-widest text-gray-400">This course includes:</h5>
                  <div className="space-y-3">
                    {[
                      { icon: <Play className="h-4 w-4" />, label: `${lessons.length} on-demand video modules` },
                      { icon: <BookOpen className="h-4 w-4" />, label: "Full lifetime access" },
                      { icon: <Shield className="h-4 w-4" />, label: "Professional Certificate" },
                      { icon: <Calendar className="h-4 w-4" />, label: "Self-paced learning" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <span className="text-primary">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* B2B Promo */}
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-[#1a1a1a] text-white">
              <h4 className="font-black text-xl italic mb-4">Training a team?</h4>
              <p className="text-white/60 text-sm font-medium mb-6">Get customized dashboard and bulk discounts for your restaurant staff.</p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-xs h-12 rounded-xl">
                REQUEST BUSINESS DEMO
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
