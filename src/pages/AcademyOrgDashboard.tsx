import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users, Briefcase, GraduationCap, CheckCircle2, 
  BarChart3, Settings, UserPlus, Mail, Search,
  ChevronRight, ArrowUpRight, Loader2, Globe
} from "lucide-react";
import { motion } from "framer-motion";

interface OrgMember {
  id: string;
  user_id: string;
  role: string;
  user_email?: string;
  user_name?: string;
  progress?: number;
}

interface Organization {
  id: string;
  name: string;
  logo_url: string;
}

const AcademyOrgDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/academy/org-dashboard");
      return;
    }
    fetchOrgData();
  }, [user]);

  const fetchOrgData = async () => {
    try {
      // Find the organization the user belongs to
      const { data: membership, error: memberError } = await supabase
        .from("academy_org_members")
        .select("*, academy_organizations(*)")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (memberError) throw memberError;

      if (!membership) {
        // Mock data if no real membership exists for demo purposes
        setOrg({ id: "demo-org", name: "Le Cordon Bleu Paris", logo_url: "https://api.dicebear.com/7.x/initials/svg?seed=LCB" });
        setIsAdmin(true);
        setMembers([
          { id: "1", user_id: "u1", role: "admin", user_email: "executive.chef@lcb.com", user_name: "Jean Dupont", progress: 95 },
          { id: "2", user_id: "u2", role: "member", user_email: "sous.chef@lcb.com", user_name: "Marie Curie", progress: 82 },
          { id: "3", user_id: "u3", role: "member", user_email: "commis.1@lcb.com", user_name: "Pierre Gasly", progress: 45 },
          { id: "4", user_id: "u4", role: "member", user_email: "commis.2@lcb.com", user_name: "Esteban Ocon", progress: 12 },
        ]);
        setLoading(false);
        return;
      }

      setOrg(membership.academy_organizations);
      setIsAdmin(membership.role === "admin");

      // Fetch all members of this org
      const { data: allMembers, error: allMembersError } = await supabase
        .from("academy_org_members")
        .select("*")
        .eq("org_id", membership.org_id);
      
      if (allMembersError) throw allMembersError;
      setMembers(allMembers);

    } catch (err) {
      console.error("Error fetching org data:", err);
      toast({ title: "Failed to load organization dashboard", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      <Navbar />
      
      <div className="bg-[#1a1a1a] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                {org?.logo_url ? <img src={org.logo_url} className="w-full h-full object-cover" /> : <Briefcase className="h-10 w-10" />}
              </div>
              <div>
                <Badge className="bg-primary text-white border-none uppercase tracking-widest text-[10px] px-3 py-1 font-black mb-2">
                  ENTERPRISE ACCOUNT
                </Badge>
                <h1 className="text-4xl font-black italic uppercase tracking-tight">{org?.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm font-bold text-white/40">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {members.length} Staff Members</span>
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> Global License</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl h-12 px-6 flex items-center gap-2">
                <UserPlus className="h-5 w-5" /> INVITE STAFF
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-black rounded-xl h-12 px-6">
                <Settings className="h-5 w-5" /> ORG SETTINGS
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Compliance Rate", value: "92%", sub: "+4% this month", icon: <CheckCircle2 className="h-6 w-6 text-green-500" /> },
              { label: "Active Learners", value: "85%", sub: "12 members online", icon: <Users className="h-6 w-6 text-blue-500" /> },
              { label: "Certs Earned", value: "24", sub: "8 pending review", icon: <GraduationCap className="h-6 w-6 text-primary" /> },
              { label: "Training Hours", value: "420h", sub: "Average 15h/week", icon: <BarChart3 className="h-6 w-6 text-purple-500" /> },
            ].map((stat, i) => (
              <Card key={i} className="p-6 border-none shadow-xl rounded-3xl bg-white overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gray-50">{stat.icon}</div>
                  <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">{stat.sub}</span>
                </div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</h4>
                <p className="text-3xl font-black italic mt-1">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Main List */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic uppercase tracking-tight">Staff Learning Progress</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input placeholder="Search members..." className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm" />
                </div>
              </div>

              <div className="space-y-4">
                {members.map((member, i) => (
                  <div key={member.id} className="p-6 rounded-[30px] border border-gray-100 hover:border-primary/30 transition-all group">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-inner">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_name}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-lg truncate group-hover:text-primary transition-colors">{member.user_name}</h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {member.user_email}</span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">{member.role}</span>
                        </div>
                      </div>
                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-gray-400">Total Progress</span>
                          <span className="text-primary">{member.progress}%</span>
                        </div>
                        <Progress value={member.progress} className="h-2 bg-gray-50" />
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-gray-300 hover:text-primary">
                        <ArrowUpRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white">
              <h3 className="font-black text-xl italic mb-6">Upcoming Training</h3>
              <div className="space-y-6">
                {[
                  { title: "HACCP Refresher", date: "Feb 15", staff: 12 },
                  { title: "Fire Safety Drill", date: "Feb 22", staff: 45 },
                  { title: "Knife Skills Level 2", date: "Mar 01", staff: 8 },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-12 h-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-primary uppercase">{item.date.split(' ')[0]}</span>
                      <span className="text-lg font-black text-primary">{item.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.staff} STAFF ASSIGNED</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 border-gray-100 text-gray-400 hover:text-primary font-black uppercase tracking-widest text-[10px] h-12 rounded-xl">
                VIEW ALL SCHEDULES
              </Button>
            </Card>

            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-[#1a1a1a] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-black text-xl italic mb-4">Training Reports</h3>
              <p className="text-white/60 text-sm font-medium mb-6">Download automated compliance reports for health inspectors and regulatory boards.</p>
              <Button className="w-full bg-white text-black hover:bg-gray-100 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl flex items-center justify-center gap-2">
                GENERATE REPORT <BarChart3 className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AcademyOrgDashboard;
