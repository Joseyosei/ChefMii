import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, Activity, Star, Award, Shield, User,
  Calendar, CheckCircle2, TrendingUp, Sparkles,
  ChevronRight, Lock, Play, ShoppingBag, Map
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ParentDashboard = () => {
  const { user } = useAuth();
  const [kids, setKids] = useState<any[]>([
    {
      id: "kid-1",
      name: "Leo",
      age: 8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
      skills: {
        safety: 85,
        nutrition: 60,
        math: 45,
        creativity: 90
      },
      badges: ["Safe Slicer", "Veggie Hunter", "Morning Baker"],
      lastActivity: "Mastered 'Organic Pasta' recipe",
      nextKit: "Italian Adventure (Feb 15)"
    },
    {
      id: "kid-2",
      name: "Mia",
      age: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
      skills: {
        safety: 40,
        nutrition: 80,
        math: 20,
        creativity: 95
      },
      badges: ["Helper Bee", "Smoothie Queen"],
      lastActivity: "Watched 'Healthy Smoothies' video",
      nextKit: "Fruit Explorer (Feb 15)"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-primary text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[10px]">Family Hub</Badge>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Beta Access</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Parent Dashboard</h1>
            <p className="text-xl text-gray-500 font-semibold">Monitor progress, manage kits, and celebrate your mini chefs' wins.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Kid Profiles & Overview */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kids.map((kid) => (
                  <Card key={kid.id} className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white hover:shadow-2xl transition-all group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage src={kid.avatar} />
                            <AvatarFallback>{kid.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-2xl font-black italic">{kid.name}</CardTitle>
                            <CardDescription className="font-bold uppercase tracking-widest text-[10px]">{kid.age} Years Old • {kid.badges.length} Badges</CardDescription>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-gray-100">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-3xl space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Skill Development</p>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>KITCHEN SAFETY</span>
                              <span>{kid.skills.safety}%</span>
                            </div>
                            <Progress value={kid.skills.safety} className="h-1.5 bg-gray-200" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>NUTRITION KNOWLEDGE</span>
                              <span>{kid.skills.nutrition}%</span>
                            </div>
                            <Progress value={kid.skills.nutrition} className="h-1.5 bg-gray-200" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {kid.badges.map((badge: string, i: number) => (
                          <Badge key={i} variant="outline" className="border-primary/20 text-primary bg-primary/5 rounded-full font-black text-[9px] px-3 py-1">
                            <Award className="h-3 w-3 mr-1" />
                            {badge.toUpperCase()}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Subscription</p>
                          <p className="text-sm font-black italic">{kid.nextKit}</p>
                        </div>
                        <Button size="sm" className="bg-black text-white hover:bg-primary font-black rounded-full text-[10px]">MANAGE</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Learning Activity Feed */}
              <Card className="border-none shadow-xl rounded-[40px] bg-white p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black italic uppercase tracking-tight">Recent Activity</h3>
                  <Button variant="ghost" className="font-black text-primary">VIEW ALL HISTORY</Button>
                </div>
                <div className="space-y-8">
                  {[
                    { kid: "Leo", activity: "Completed 'Knife Safety Level 1'", time: "2 hours ago", icon: Shield, color: "bg-blue-50 text-blue-500" },
                    { kid: "Mia", activity: "Identified 5 healthy vegetables in AR Hunt", time: "5 hours ago", icon: Map, color: "bg-green-50 text-green-500" },
                    { kid: "Leo", activity: "Started 'The Science of Yeast' module", time: "Yesterday", icon: Play, color: "bg-purple-50 text-purple-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group cursor-pointer">
                      <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-lg italic leading-tight">{item.kid} <span className="text-gray-400 font-normal"> {item.activity}</span></p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.time}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-500 font-black">+10 PTS</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: ROI & Subscriptions */}
            <div className="space-y-8">
              <Card className="bg-[#1a1a1a] text-white border-none shadow-2xl rounded-[40px] p-8 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Educational ROI</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Money Management</p>
                      <p className="text-xl font-black italic">£12.50 Saved</p>
                      <p className="text-xs text-white/60">Kids helped calculate ingredient costs this month.</p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Healthy Habits</p>
                      <p className="text-xl font-black italic">8 New Foods</p>
                      <p className="text-xs text-white/60">Mia tried broccoli and kale after the AR Hunt!</p>
                    </div>
                  </div>
                  <Button className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl shadow-xl">
                    DOWNLOAD REPORT
                  </Button>
                </div>
              </Card>

              <Card className="border-none shadow-xl rounded-[40px] bg-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Mini Chef Kits</h3>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-sm uppercase">NEXT DELIVERY</p>
                    <Badge className="bg-orange-500 text-white">READY</Badge>
                  </div>
                  <p className="text-2xl font-black italic">Feb 15, 2026</p>
                  <p className="text-xs text-orange-600 font-bold mt-1">"The Italian Pasta Master" Box</p>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest border-2">PAUSE SUBSCRIPTION</Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest border-2">CHANGE FREQUENCY</Button>
                </div>
              </Card>

              <Card className="border-none shadow-xl rounded-[40px] bg-white p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">Safety Controls</h4>
                <p className="text-xs text-gray-500 font-medium mb-6">Manage what your kids can see and purchase in the Kids' Zone.</p>
                <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white font-black rounded-xl h-12">OPEN SETTINGS</Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParentDashboard;
