import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Star, Settings, LogOut, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';

export default function ChefDashboard() {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card shadow-md p-4 flex flex-col justify-between border-r border-border">
        <div>
          <div className="mb-6">
            <ChefMiiLogo />
          </div>
          <nav className="space-y-2">
            <Button 
              variant={activeNav === 'dashboard' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveNav('dashboard')}
            >
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button 
              variant={activeNav === 'stats' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveNav('stats')}
            >
              <BarChart2 className="mr-2 h-4 w-4" /> Stats
            </Button>
            <Button 
              variant={activeNav === 'reviews' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveNav('reviews')}
            >
              <Star className="mr-2 h-4 w-4" /> Reviews
            </Button>
            <Button 
              variant={activeNav === 'settings' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveNav('settings')}
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </nav>
        </div>
        <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatar.png" alt="Chef Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Chef'}</h1>
              <p className="text-sm text-muted-foreground">Here's a quick overview</p>
            </div>
          </div>
          <Bell className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Bookings This Week</p>
              <h3 className="text-3xl font-bold text-foreground">12</h3>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">5-Star Reviews</p>
              <h3 className="text-3xl font-bold text-foreground">27</h3>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Earnings (This Month)</p>
              <h3 className="text-3xl font-bold text-primary">£1,650</h3>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
                <Progress value={75} className="h-4" />
                <p className="text-sm text-muted-foreground mt-2">
                  75% of weekly goal achieved
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Bookings</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Couple's Night</p>
                      <p className="text-sm text-muted-foreground">London</p>
                    </div>
                    <span className="text-sm text-muted-foreground">Dec 3, 7PM</span>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Meal Prep</p>
                      <p className="text-sm text-muted-foreground">Cambridge</p>
                    </div>
                    <span className="text-sm text-muted-foreground">Dec 4, 1PM</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Clients</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Sophie M.</span>
                    <span className="text-sm text-primary font-semibold">5 Bookings</span>
                  </li>
                  <li className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Daniel T.</span>
                    <span className="text-sm text-primary font-semibold">4 Bookings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
