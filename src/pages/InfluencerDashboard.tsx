import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, BarChart2, DollarSign, Users, Video, Heart, Share2, 
  Settings, LogOut, Bell, Calendar, TrendingUp, Eye, MessageCircle,
  Menu, X, ChefHat, Link as LinkIcon, Copy, Instagram, Youtube, 
  Twitter, Camera, Upload, Play, Image as ImageIcon, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'post' | 'story' | 'reel';
  views: number;
  likes: number;
  shares: number;
  earnings: number;
  thumbnail: string;
  status: 'published' | 'draft' | 'scheduled';
  created_at: string;
}

interface Collaboration {
  id: string;
  chef_name: string;
  chef_image: string;
  campaign: string;
  budget: number;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  deadline: string;
}

interface EarningsData {
  total: number;
  pending: number;
  thisMonth: number;
  lastMonth: number;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'content', icon: Video, label: 'My Content' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'collaborations', icon: Users, label: 'Collaborations' },
  { id: 'earnings', icon: DollarSign, label: 'Earnings' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Amazing Italian Pasta with Chef Marco',
      type: 'video',
      views: 125000,
      likes: 8500,
      shares: 1200,
      earnings: 450,
      thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
      status: 'published',
      created_at: '2025-01-15'
    },
    {
      id: '2',
      title: 'Behind the Scenes: Michelin Star Kitchen',
      type: 'reel',
      views: 89000,
      likes: 6200,
      shares: 890,
      earnings: 320,
      thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
      status: 'published',
      created_at: '2025-01-12'
    },
    {
      id: '3',
      title: 'Top 5 Sushi Chefs in London',
      type: 'video',
      views: 67000,
      likes: 4100,
      shares: 560,
      earnings: 280,
      thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      status: 'published',
      created_at: '2025-01-10'
    },
    {
      id: '4',
      title: 'Street Food Tour with Local Chefs',
      type: 'video',
      views: 0,
      likes: 0,
      shares: 0,
      earnings: 0,
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      status: 'draft',
      created_at: '2025-01-18'
    },
  ]);

  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: '1',
      chef_name: 'Chef Maria Rodriguez',
      chef_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      campaign: 'Mexican Cuisine Week',
      budget: 1500,
      status: 'pending',
      deadline: '2025-02-01'
    },
    {
      id: '2',
      chef_name: 'Chef Takeshi Tanaka',
      chef_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Takeshi',
      campaign: 'Japanese Fusion Feature',
      budget: 2000,
      status: 'accepted',
      deadline: '2025-01-25'
    },
    {
      id: '3',
      chef_name: 'Chef Pierre Dubois',
      chef_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
      campaign: 'French Pastry Series',
      budget: 1800,
      status: 'completed',
      deadline: '2025-01-10'
    },
  ]);

  const [earnings, setEarnings] = useState<EarningsData>({
    total: 12450,
    pending: 1250,
    thisMonth: 2800,
    lastMonth: 3200
  });

  const [referralCode] = useState('CHEFMII-INF-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video' as 'video' | 'post' | 'story' | 'reel',
    description: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://chefmii.com/ref/${referralCode}`);
    toast({ title: 'Referral link copied!' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const totalViews = contents.reduce((sum, c) => sum + c.views, 0);
  const totalLikes = contents.reduce((sum, c) => sum + c.likes, 0);
  const totalShares = contents.reduce((sum, c) => sum + c.shares, 0);
  const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews * 100).toFixed(2) : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-900 to-pink-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <ChefMiiLogo size={32} />
            <span className="text-xl font-bold">ChefMii</span>
          </div>
          <Badge className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none">
            Influencer
          </Badge>
        </div>

        <div className="px-4 py-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-pink-400">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-pink-500">{profile?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile?.full_name || 'Influencer'}</p>
              <p className="text-xs text-pink-200">{formatNumber(totalViews)} total views</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === item.id 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-pink-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-pink-200 hover:text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="lg:ml-64 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {activeNav === 'dashboard' && 'Influencer Dashboard'}
              {activeNav === 'content' && 'My Content'}
              {activeNav === 'analytics' && 'Analytics'}
              {activeNav === 'collaborations' && 'Collaborations'}
              {activeNav === 'earnings' && 'Earnings'}
              {activeNav === 'settings' && 'Settings'}
            </h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name?.split(' ')[0]}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Views</p>
                      <p className="text-3xl font-bold">{formatNumber(totalViews)}</p>
                      <p className="text-purple-200 text-xs flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> +12% this month
                      </p>
                    </div>
                    <Eye className="w-10 h-10 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-sm">Engagement Rate</p>
                      <p className="text-3xl font-bold">{engagementRate}%</p>
                      <p className="text-pink-200 text-xs flex items-center gap-1 mt-1">
                        <Heart className="w-3 h-3" /> {formatNumber(totalLikes)} likes
                      </p>
                    </div>
                    <Heart className="w-10 h-10 text-pink-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Active Collabs</p>
                      <p className="text-3xl font-bold">{collaborations.filter(c => c.status === 'accepted').length}</p>
                      <p className="text-orange-200 text-xs flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" /> {collaborations.filter(c => c.status === 'pending').length} pending
                      </p>
                    </div>
                    <Users className="w-10 h-10 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">This Month</p>
                      <p className="text-3xl font-bold">£{earnings.thisMonth.toLocaleString()}</p>
                      <p className="text-green-200 text-xs flex items-center gap-1 mt-1">
                        <DollarSign className="w-3 h-3" /> £{earnings.pending} pending
                      </p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Content</CardTitle>
                  <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contents.slice(0, 3).map((content) => (
                      <div key={content.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                          <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                          {content.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{content.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(content.views)}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(content.likes)}</span>
                            <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {formatNumber(content.shares)}</span>
                          </div>
                        </div>
                        <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                          {content.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                  <CardDescription>Earn 10% commission on chef bookings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Your referral code</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-3 py-2 rounded-lg font-mono text-sm">{referralCode}</code>
                      <Button size="icon" variant="ghost" onClick={copyReferralLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Referrals this month</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Referral earnings</span>
                      <span className="font-semibold text-green-600">£456</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Share2 className="w-4 h-4 mr-2" /> Share Link
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collaborations.filter(c => c.status === 'pending').map((collab) => (
                    <div key={collab.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={collab.chef_image} />
                          <AvatarFallback>{collab.chef_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collab.chef_name}</p>
                          <p className="text-xs text-muted-foreground">{collab.campaign}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">£{collab.budget}</span>
                        <span className="text-xs text-muted-foreground">Due: {new Date(collab.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Accept</Button>
                        <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeNav === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="reels">Reels</TabsTrigger>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" /> New Content
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <Card key={content.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary"><Play className="w-4 h-4 mr-1" /> Preview</Button>
                    </div>
                    <Badge className="absolute top-2 right-2" variant={content.status === 'published' ? 'default' : 'secondary'}>
                      {content.status}
                    </Badge>
                    <Badge className="absolute top-2 left-2 bg-purple-500">{content.type}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(content.views)}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(content.likes)}</span>
                      </div>
                      <span className="text-green-600 font-medium">£{content.earnings}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <p className="text-3xl font-bold">{formatNumber(totalViews)}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 mx-auto text-pink-500 mb-2" />
                  <p className="text-3xl font-bold">{formatNumber(totalLikes)}</p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Share2 className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                  <p className="text-3xl font-bold">{formatNumber(totalShares)}</p>
                  <p className="text-sm text-muted-foreground">Total Shares</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <p className="text-3xl font-bold">{engagementRate}%</p>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...contents].sort((a, b) => b.views - a.views).map((content, index) => (
                    <div key={content.id} className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</span>
                      <img src={content.thumbnail} alt={content.title} className="w-20 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium">{content.title}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{formatNumber(content.views)} views</span>
                          <span>{formatNumber(content.likes)} likes</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">£{content.earnings}</p>
                        <p className="text-xs text-muted-foreground">earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>18-24</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>25-34</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>35-44</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>45+</span>
                      <span>8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { country: 'United Kingdom', percent: 45 },
                    { country: 'United States', percent: 25 },
                    { country: 'Germany', percent: 12 },
                    { country: 'France', percent: 8 },
                    { country: 'Other', percent: 10 },
                  ].map((loc) => (
                    <div key={loc.country}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{loc.country}</span>
                        <span>{loc.percent}%</span>
                      </div>
                      <Progress value={loc.percent} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeNav === 'collaborations' && (
          <div className="space-y-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending ({collaborations.filter(c => c.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="active">Active ({collaborations.filter(c => c.status === 'accepted').length})</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collaborations.map((collab) => (
                    <Card key={collab.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={collab.chef_image} />
                            <AvatarFallback>{collab.chef_name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{collab.chef_name}</h3>
                            <p className="text-sm text-muted-foreground">{collab.campaign}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-2xl font-bold text-green-600">£{collab.budget}</p>
                            <p className="text-xs text-muted-foreground">Budget</p>
                          </div>
                          <Badge variant={
                            collab.status === 'completed' ? 'default' :
                            collab.status === 'accepted' ? 'secondary' :
                            collab.status === 'pending' ? 'outline' : 'destructive'
                          }>
                            {collab.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Deadline: {new Date(collab.deadline).toLocaleDateString()}
                        </p>
                        {collab.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">Accept</Button>
                            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                          </div>
                        )}
                        {collab.status === 'accepted' && (
                          <Button size="sm" className="w-full">View Details</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeNav === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                <CardContent className="p-6">
                  <p className="text-green-100 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold">£{earnings.total.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold">£{earnings.thisMonth.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-orange-500">£{earnings.pending.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-3xl font-bold">£{earnings.lastMonth.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Video className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Content Revenue</p>
                        <p className="text-sm text-muted-foreground">Views, likes, engagement</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold">£{(earnings.total * 0.6).toFixed(0)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Users className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-medium">Collaborations</p>
                        <p className="text-sm text-muted-foreground">Sponsored content</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold">£{(earnings.total * 0.3).toFixed(0)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Share2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Referral Bonuses</p>
                        <p className="text-sm text-muted-foreground">Chef bookings referrals</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold">£{(earnings.total * 0.1).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Payout Method</Label>
                    <Select defaultValue="bank">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Payout Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Request Payout</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeNav === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-3xl">{profile?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="w-4 h-4 mr-2" /> Change Photo
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Display Name</Label>
                    <Input defaultValue={profile?.full_name || ''} />
                  </div>
                  <div>
                    <Label className="mb-2 block">Email</Label>
                    <Input defaultValue={profile?.email || ''} type="email" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Bio</Label>
                    <Textarea rows={4} placeholder="Tell your audience about yourself..." />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <Input placeholder="Instagram username" className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <Input placeholder="YouTube channel URL" className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <Input placeholder="Twitter/X handle" className="flex-1" />
                </div>
                <Button>Update Links</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Content Title</Label>
              <Input 
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title..."
              />
            </div>
            <div>
              <Label className="mb-2 block">Content Type</Label>
              <Select value={newContent.type} onValueChange={(v: any) => setNewContent(prev => ({ ...prev, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Description</Label>
              <Textarea 
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your content..."
                rows={3}
              />
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
              <Button variant="outline" size="sm" className="mt-2">Select File</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
