import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Star, Settings, LogOut, Bell, Calendar, DollarSign, Users, Clock, MessageCircle, Menu, X, Building, FileText, Briefcase, Plus, Store, Navigation } from 'lucide-react';
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

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [events, setEvents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeBookings: 0,
    totalSpent: 0,
    avgRating: 0
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
      // Fetch bookings for business
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (bookingsData) {
        setEvents(bookingsData);
        setStats(prev => ({
          ...prev,
          totalEvents: bookingsData.length,
          activeBookings: bookingsData.filter(b => b.status === 'confirmed').length,
          totalSpent: bookingsData.reduce((acc, b) => acc + Number(b.total_price), 0)
        }));
      }

      // Mock invoices for now
      setInvoices([
        { id: 'INV-001', date: '2024-03-15', amount: 450.00, status: 'paid' },
        { id: 'INV-002', date: '2024-03-20', amount: 800.00, status: 'pending' },
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
    { id: 'events', icon: Calendar, label: 'Corporate Events' },
    { id: 'catering', icon: Store, label: 'Catering Hub' },
    { id: 'live-tracking', icon: Navigation, label: 'Live Network' },
    { id: 'billing', icon: FileText, label: 'Billing & Invoices' },
    { id: 'team', icon: Users, label: 'Team Management' },
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
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Business Partner'}</h1>
              <p className="text-sm text-muted-foreground capitalize">Business Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Corporate Account</Badge>
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
                    <span className="text-sm text-muted-foreground">Total Events</span>
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalEvents}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Bookings</span>
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.activeBookings}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">£{stats.totalSpent.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Staff Members</span>
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold">12</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Event Bookings
                    <Button variant="ghost" size="sm" onClick={() => setActiveNav('events')}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length > 0 ? (
                    <div className="space-y-3">
                      {events.slice(0, 4).map(event => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{event.package_name}</p>
                            <p className="text-sm text-muted-foreground">{new Date(event.booking_date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>{event.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent events</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pending Invoices
                    <Button variant="ghost" size="sm" onClick={() => setActiveNav('billing')}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{inv.id}</p>
                          <p className="text-sm text-muted-foreground">{inv.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">£{inv.amount.toFixed(2)}</p>
                          <Badge variant={inv.status === 'paid' ? 'default' : 'outline'} className={inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'text-yellow-600 border-yellow-200'}>
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeNav === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Corporate Events</h2>
              <Button onClick={() => navigate('/packages')}>
                <Plus className="w-4 h-4 mr-2" /> Book New Event
              </Button>
            </div>
            {events.map(event => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.package_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.booking_date}</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.guests} Attendees</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">£{event.total_price}</p>
                      <Badge variant="outline">{event.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

          {activeNav === 'catering' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Catering Hub</h2>
                <Button onClick={() => navigate('/chefs')}>Browse All Chefs</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 border-primary/10" onClick={() => navigate('/live-tracking')}>
                  <div className="aspect-video bg-muted relative">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-primary">Business Partner Rates</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">Chef's Gourmet Kitchen</h3>
                    <p className="text-sm text-muted-foreground">Fine Dining • Corporate Catering</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-bold"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9</span>
                      <Button size="sm">Order Catering</Button>
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
              <p className="text-muted-foreground">Track your corporate catering deliveries in real-time.</p>
              <Button className="w-full h-20 text-xl font-bold shadow-lg" onClick={() => navigate('/live-tracking')}>
                <Navigation className="w-6 h-6 mr-2" /> Open Global Tracking Map
              </Button>
            </div>
          )}

          {activeNav === 'billing' && (

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Billing & Invoices</h2>
              <Button variant="outline">Download All Statements</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Unpaid Balance</p>
                  <p className="text-3xl font-bold text-red-500">£800.00</p>
                  <Button size="sm" className="mt-4 w-full">Pay Now</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Last Payment</p>
                  <p className="text-3xl font-bold text-green-500">£450.00</p>
                  <p className="text-xs text-muted-foreground mt-2">March 15, 2024</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Credit Limit</p>
                  <p className="text-3xl font-bold text-blue-500">£5,000.00</p>
                  <Progress value={16} className="mt-4" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'INV-2024-001', date: 'Mar 15, 2024', event: 'Q1 Team Building', amount: 450.00, status: 'Paid' },
                    { id: 'INV-2024-002', date: 'Mar 20, 2024', event: 'Executive Lunch', amount: 800.00, status: 'Pending' },
                    { id: 'INV-2024-003', date: 'Feb 12, 2024', event: 'Product Launch', amount: 2500.00, status: 'Paid' }
                  ].map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{inv.id}</p>
                          <p className="text-sm text-muted-foreground">{inv.event} • {inv.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">£{inv.amount.toFixed(2)}</p>
                        <Badge className={inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeNav === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Team Management</h2>
              <Button><Plus className="w-4 h-4 mr-2" /> Invite Member</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Wilson', role: 'Event Coordinator', status: 'Active', avatar: 'SW' },
                { name: 'Michael Chen', role: 'Office Manager', status: 'Active', avatar: 'MC' },
                { name: 'David Ross', role: 'VP Operations', status: 'Pending', avatar: 'DR' }
              ].map((member) => (
                <Card key={member.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>{member.status}</Badge>
                      <Button variant="ghost" size="sm">Manage Access</Button>
                    </div>
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
