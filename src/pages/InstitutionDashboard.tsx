import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Star, Settings, LogOut, Bell, Calendar, DollarSign, Users, Clock, MessageCircle, Menu, X, School, BookOpen, GraduationCap, Plus, Store, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activePlans: 0,
    monthlyBudget: 0,
    satisfaction: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user, loading]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Mock data for institution
      setStats({
        totalMembers: 450,
        activePlans: 3,
        monthlyBudget: 12500,
        satisfaction: 4.8
      });

      setMealPlans([
        { id: '1', name: 'Student Healthy Plan', status: 'active', members: 120 },
        { id: '2', name: 'Faculty Gourmet', status: 'active', members: 45 },
        { id: '3', name: 'Weekend Brunch Series', status: 'scheduled', members: 80 }
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'plans', icon: BookOpen, label: 'Meal Plans' },
    { id: 'sourcing', icon: Store, label: 'Menu Sourcing' },
    { id: 'live-tracking', icon: Navigation, label: 'Live Network' },
    { id: 'members', icon: Users, label: 'Member Directory' },
    { id: 'feedback', icon: Star, label: 'Feedback' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-md p-4 flex flex-col justify-between border-r border-border transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <ChefMiiLogo />
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant={activeNav === item.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </aside>

      <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <School className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Institution Partner'}</h1>
              <p className="text-sm text-muted-foreground capitalize">Institution Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">Institutional Account</Badge>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {activeNav === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalMembers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Plans</span>
                    <BookOpen className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.activePlans}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Monthly Budget</span>
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">£{stats.monthlyBudget.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Satisfaction Score</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.satisfaction}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Active Meal Plans
                    <Button variant="ghost" size="sm" onClick={() => setActiveNav('plans')}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mealPlans.map(plan => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-muted-foreground">{plan.members} members enrolled</p>
                        </div>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>{plan.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Upcoming Graduations/Events
                    <Button variant="ghost" size="sm">View Calendar</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">No events scheduled for this week</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

          {activeNav === 'sourcing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Menu Sourcing</h2>
                <Button onClick={() => navigate('/chefs')}>Explore All Chefs</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 border-primary/10" onClick={() => navigate('/live-tracking')}>
                  <div className="aspect-video bg-muted relative">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-primary">Institutional Partner</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">Chef's Gourmet Kitchen</h3>
                    <p className="text-sm text-muted-foreground">Volume Catering • Institutional Solutions</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-bold"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9</span>
                      <Button size="sm">Source Menu</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeNav === 'live-tracking' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Navigation className="w-6 h-6" />
                Live Network Tracking
              </h2>
              <p className="text-muted-foreground">Track your institutional meal deliveries in real-time.</p>
              <Button className="w-full h-20 text-xl font-bold shadow-lg" onClick={() => navigate('/live-tracking')}>
                <Navigation className="w-6 h-6 mr-2" /> Open Global Tracking Map
              </Button>
            </div>
          )}

          {activeNav === 'members' && (

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Member Directory</h2>
              <div className="flex gap-2">
                <Input placeholder="Search members..." className="w-64" />
                <Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { name: 'John Doe', role: 'Student', plan: 'Healthy Student', status: 'Active' },
                    { name: 'Jane Smith', role: 'Faculty', plan: 'Faculty Gourmet', status: 'Active' },
                    { name: 'Robert Brown', role: 'Staff', plan: 'Healthy Student', status: 'Inactive' },
                    { name: 'Emily Davis', role: 'Student', plan: 'Healthy Student', status: 'Active' }
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-sm font-medium">Plan</p>
                          <p className="text-sm text-muted-foreground">{member.plan}</p>
                        </div>
                        <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>{member.status}</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeNav === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Member Feedback</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="font-bold text-lg">4.8</span>
                <span className="text-sm font-medium">Average Score</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { author: 'Student Council', comment: 'The new healthy menu is a hit! Everyone loves the variety.', rating: 5, date: '2 days ago' },
                { author: 'Dr. Sarah Lee', comment: 'Excellent gourmet options for the faculty lunch. Very impressed.', rating: 5, date: '1 week ago' },
                { author: 'Care Home Staff', comment: 'Consistent quality and great service from the chefs.', rating: 4, date: '2 weeks ago' },
                { author: 'Anonymous Student', comment: 'Need more vegetarian options on Tuesdays please!', rating: 4, date: '3 weeks ago' }
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <p className="font-bold">{item.author}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, star) => (
                          <Star key={star} className={`w-4 h-4 ${star < item.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{item.comment}"</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
