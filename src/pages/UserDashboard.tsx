import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Bookmark, Heart, Settings, LogOut, ChefHat, Calendar as CalendarIcon, Star, MapPin, Clock, Gift, Users, Bell, X, Send, Camera, Lock, Mail, Phone, Home, Navigation, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LiveTrackingMap from '@/components/LiveTrackingMap';

interface Booking {
  id: string;
  chef_id: string;
  package_name: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  status: string;
  total_price: number;
  chef_name?: string;
  chef_avatar?: string;
}

interface Favorite {
  id: string;
  chef_id: string;
  chef_name?: string;
  chef_avatar?: string;
  chef_cuisine?: string[];
  chef_rating?: number;
}

interface Conversation {
  id: string;
  chef_id: string;
  last_message_at: string;
  chef_name?: string;
  chef_avatar?: string;
  unread_count?: number;
  last_message?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface LoyaltyData {
  points: number;
  tier: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading, updateProfile, updatePassword, refreshProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loyalty, setLoyalty] = useState<LoyaltyData>({ points: 0, tier: 'Bronze' });
  const [isLoading, setIsLoading] = useState(true);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchDashboardData();
    }
  }, [user, loading]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setEmailNotifications(profile.email_notifications ?? true);
      setSmsNotifications(profile.sms_notifications ?? false);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('chat-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        if (selectedConversation && payload.new.conversation_id === selectedConversation.id) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
      
      if (bookingsData) {
        const bookingsWithChefs = await Promise.all(bookingsData.map(async (booking) => {
          const { data: chefProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', booking.chef_id)
            .single();
          
          const { data: chefData } = await supabase
            .from('chef_profiles')
            .select('avatar_url')
            .eq('user_id', booking.chef_id)
            .single();
          
          return {
            ...booking,
            chef_name: chefProfile?.full_name || 'Chef',
            chef_avatar: chefData?.avatar_url
          };
        }));
        setBookings(bookingsWithChefs);
      }

      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (favoritesData) {
        const favoritesWithChefs = await Promise.all(favoritesData.map(async (fav) => {
          const { data: chefProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', fav.chef_id)
            .single();
          
          const { data: chefData } = await supabase
            .from('chef_profiles')
            .select('avatar_url, cuisine_types, rating')
            .eq('user_id', fav.chef_id)
            .single();
          
          return {
            ...fav,
            chef_name: chefProfile?.full_name || 'Chef',
            chef_avatar: chefData?.avatar_url,
            chef_cuisine: chefData?.cuisine_types,
            chef_rating: chefData?.rating
          };
        }));
        setFavorites(favoritesWithChefs);
      }

      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });
      
      if (conversationsData) {
        const conversationsWithChefs = await Promise.all(conversationsData.map(async (conv) => {
          const { data: chefProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', conv.chef_id)
            .single();
          
          const { data: chefData } = await supabase
            .from('chef_profiles')
            .select('avatar_url')
            .eq('user_id', conv.chef_id)
            .single();
          
          const { data: lastMsg } = await supabase
            .from('chat_messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);
          
          return {
            ...conv,
            chef_name: chefProfile?.full_name || 'Chef',
            chef_avatar: chefData?.avatar_url,
            last_message: lastMsg?.content,
            unread_count: count || 0
          };
        }));
        setConversations(conversationsWithChefs);
      }

      const { data: loyaltyData } = await supabase
        .from('loyalty_points')
        .select('points, tier')
        .eq('user_id', user.id)
        .single();
      
      if (loyaltyData) {
        setLoyalty(loyaltyData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user?.id);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        content: newMessage.trim(),
        is_read: false
      });
    
    if (!error) {
      setNewMessage('');
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);
    
    if (!error) {
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast({ title: 'Removed from favorites' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be less than 5MB', variant: 'destructive' });
      return;
    }

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      if (updateError) throw updateError;

      toast({ title: 'Profile photo updated!' });
      await refreshProfile();
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await updateProfile({
        full_name: fullName,
        phone,
        address,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
      });

      if (error) throw error;
      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      
      toast({ title: 'Password changed successfully!' });
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({ title: 'Failed to change password', variant: 'destructive' });
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-80px)] bg-card border-r border-border p-6 hidden lg:block sticky top-20">
          <nav className="space-y-2">
              {[
                { id: 'dashboard', icon: ChefHat, label: 'Dashboard' },
                { id: 'bookings', icon: Bookmark, label: 'Bookings' },
                { id: 'restaurants', icon: Store, label: 'Order Food' },
                { id: 'live-tracking', icon: Navigation, label: 'Live Network' },
                { id: 'messages', icon: MessageCircle, label: 'Messages' },
                { id: 'favorites', icon: Heart, label: 'Favorites' },
                { id: 'rewards', icon: Gift, label: 'Rewards' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(item => (

              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeNav === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === 'messages' && conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 mt-8 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-muted-foreground capitalize">{activeNav}</p>
              </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
            </div>

            {activeNav === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Bookings</span>
                        <Bookmark className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold">{bookings.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Saved Chefs</span>
                        <Heart className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-3xl font-bold">{favorites.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Reward Points</span>
                        <Gift className="w-5 h-5 text-yellow-500" />
                      </div>
                      <p className="text-3xl font-bold">{loyalty.points}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Tier Status</span>
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold">{loyalty.tier}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Upcoming Bookings
                        <Button variant="ghost" size="sm" onClick={() => setActiveNav('bookings')}>
                          View All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bookings.filter(b => new Date(b.booking_date) >= new Date()).slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {bookings.filter(b => new Date(b.booking_date) >= new Date()).slice(0, 3).map(booking => (
                            <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                              <Avatar>
                                <AvatarImage src={booking.chef_avatar} />
                                <AvatarFallback>{booking.chef_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium">{booking.chef_name}</p>
                                <p className="text-sm text-muted-foreground">{booking.package_name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground">{booking.booking_time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No upcoming bookings</p>
                          <Link to="/chefs">
                            <Button className="mt-4">Find a Chef</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Recent Messages
                        <Button variant="ghost" size="sm" onClick={() => setActiveNav('messages')}>
                          View All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {conversations.slice(0, 3).length > 0 ? (
                        <div className="space-y-4">
                          {conversations.slice(0, 3).map(conv => (
                            <div 
                              key={conv.id} 
                              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted"
                              onClick={() => {
                                setSelectedConversation(conv);
                                setActiveNav('messages');
                                fetchMessages(conv.id);
                              }}
                            >
                              <Avatar>
                                <AvatarImage src={conv.chef_avatar} />
                                <AvatarFallback>{conv.chef_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{conv.chef_name}</p>
                                <p className="text-sm text-muted-foreground truncate">{conv.last_message || 'No messages yet'}</p>
                              </div>
                              {conv.unread_count ? (
                                <Badge variant="destructive">{conv.unread_count}</Badge>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No messages yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeNav === 'bookings' && (
              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="mt-6">
                  {bookings.filter(b => new Date(b.booking_date) >= new Date() && b.status !== 'cancelled').length > 0 ? (
                    <div className="space-y-4">
                      {bookings.filter(b => new Date(b.booking_date) >= new Date() && b.status !== 'cancelled').map(booking => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                  <AvatarImage src={booking.chef_avatar} />
                                  <AvatarFallback>{booking.chef_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-lg">{booking.chef_name}</h3>
                                  <p className="text-muted-foreground">{booking.package_name}</p>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <CalendarIcon className="w-4 h-4" />
                                      {new Date(booking.booking_date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {booking.booking_time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {booking.guests} guests
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                <p className="text-xl font-bold mt-2">£{booking.total_price}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                      <p className="text-muted-foreground mb-4">Ready to book your next culinary experience?</p>
                      <Link to="/chefs"><Button>Find a Chef</Button></Link>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tracking" className="mt-6">
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'in_transit').length > 0 ? (
                    <div className="space-y-6">
                      {bookings.filter(b => b.status === 'confirmed' || b.status === 'in_transit').map(booking => (
                        <LiveTrackingMap
                          key={booking.id}
                          chefName={booking.chef_name || 'Chef'}
                          chefImage={booking.chef_avatar}
                          userLocation={{ lat: 51.5074, lng: -0.1278 }}
                          estimatedArrival="15 min"
                          bookingStatus={booking.status}
                          onMessageChef={() => {
                            toast({ title: 'Opening chat...' });
                          }}
                          onCallChef={() => {
                            toast({ title: 'Calling chef...' });
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Navigation className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No active tracking</h3>
                      <p className="text-muted-foreground">When your chef is on the way, you'll be able to track them here in real-time!</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="past" className="mt-6">
                  {bookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'completed').length > 0 ? (
                    <div className="space-y-4">
                      {bookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'completed').map(booking => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                  <AvatarImage src={booking.chef_avatar} />
                                  <AvatarFallback>{booking.chef_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-lg">{booking.chef_name}</h3>
                                  <p className="text-muted-foreground">{booking.package_name}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(booking.booking_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Button variant="outline">Book Again</Button>
                                <Button variant="outline">Leave Review</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No past bookings</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="cancelled" className="mt-6">
                  {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === 'cancelled').map(booking => (
                        <Card key={booking.id} className="opacity-75">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                  <AvatarFallback>{booking.chef_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{booking.chef_name}</h3>
                                  <p className="text-sm text-muted-foreground">{booking.package_name}</p>
                                </div>
                              </div>
                              <Badge variant="destructive">Cancelled</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No cancelled bookings</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {activeNav === 'messages' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {conversations.map(conv => (
                        <div 
                          key={conv.id}
                          onClick={() => {
                            setSelectedConversation(conv);
                            fetchMessages(conv.id);
                          }}
                          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors ${
                            selectedConversation?.id === conv.id ? 'bg-muted' : ''
                          }`}
                        >
                          <Avatar>
                            <AvatarImage src={conv.chef_avatar} />
                            <AvatarFallback>{conv.chef_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{conv.chef_name}</p>
                            <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                          </div>
                          {conv.unread_count ? <Badge variant="destructive">{conv.unread_count}</Badge> : null}
                        </div>
                      ))}
                      {conversations.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          No conversations yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2 flex flex-col">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={selectedConversation.chef_avatar} />
                              <AvatarFallback>{selectedConversation.chef_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{selectedConversation.chef_name}</CardTitle>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.sender_id === user?.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p>{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Type a message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          />
                          <Button onClick={sendMessage}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      Select a conversation to start messaging
                    </div>
                  )}
                </Card>
              </div>
            )}

            {activeNav === 'favorites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length > 0 ? (
                  favorites.map(fav => (
                    <Card key={fav.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-muted relative">
                          {fav.chef_avatar && (
                            <img src={fav.chef_avatar} alt={fav.chef_name} className="w-full h-full object-cover" />
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => removeFavorite(fav.id)}
                          >
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{fav.chef_name}</h3>
                            {fav.chef_rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{fav.chef_rating}</span>
                              </div>
                            )}
                          </div>
                          {fav.chef_cuisine && (
                            <p className="text-sm text-muted-foreground mb-4">{fav.chef_cuisine.join(', ')}</p>
                          )}
                          <Link to={`/chef/${fav.chef_id}`}>
                            <Button className="w-full">View Profile</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorite chefs yet</h3>
                    <p className="text-muted-foreground mb-4">Start exploring and save chefs you love!</p>
                    <Link to="/chefs"><Button>Find Chefs</Button></Link>
                  </div>
                )}
              </div>
            )}

              {activeNav === 'rewards' && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Your Rewards</h2>
                          <p className="text-muted-foreground">Earn points with every booking</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-primary">{loyalty.points}</p>
                          <p className="text-sm text-muted-foreground">Available points</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg">
                        <Star className="w-8 h-8 text-amber-500" />
                        <div>
                          <p className="font-semibold">{loyalty.tier} Member</p>
                          <p className="text-sm text-muted-foreground">
                            {loyalty.tier === 'Bronze' && 'Earn 500 more points to reach Silver'}
                            {loyalty.tier === 'Silver' && 'Earn 1000 more points to reach Gold'}
                            {loyalty.tier === 'Gold' && 'You have the highest tier!'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6">
                      <Gift className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold mb-2">£10 Off Next Booking</h3>
                      <p className="text-sm text-muted-foreground mb-4">200 points</p>
                      <Button variant="outline" className="w-full" disabled={loyalty.points < 200}>Redeem</Button>
                    </Card>
                    <Card className="p-6">
                      <Gift className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold mb-2">Free Dessert Course</h3>
                      <p className="text-sm text-muted-foreground mb-4">350 points</p>
                      <Button variant="outline" className="w-full" disabled={loyalty.points < 350}>Redeem</Button>
                    </Card>
                    <Card className="p-6">
                      <Gift className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold mb-2">25% Off Any Package</h3>
                      <p className="text-sm text-muted-foreground mb-4">500 points</p>
                      <Button variant="outline" className="w-full" disabled={loyalty.points < 500}>Redeem</Button>
                    </Card>
                  </div>
                </div>
              )}

              {activeNav === 'restaurants' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Order from Chef's Restaurants</h2>
                    <Button onClick={() => navigate('/chefs')}>Browse All Chefs</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Simplified for demo - we'd fetch all restaurants here */}
                    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 border-primary/10" onClick={() => navigate('/live-tracking')}>
                      <div className="aspect-video bg-muted relative">
                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" className="w-full h-full object-cover" />
                        <Badge className="absolute top-2 left-2 bg-primary">Open Now</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">Chef's Gourmet Kitchen</h3>
                        <p className="text-sm text-muted-foreground">Fine Dining • Contemporary</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-sm font-bold"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9</span>
                          <Button size="sm">Order Food</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeNav === 'live-tracking' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Live Chef Network</h2>
                  <p className="text-muted-foreground">See chefs currently in transit and their estimated delivery times.</p>
                  <Button className="w-full h-16 text-lg font-bold" onClick={() => navigate('/live-tracking')}>
                    <Navigation className="w-6 h-6 mr-2" /> Open Global Tracking Map
                  </Button>
                </div>
              )}


            {activeNav === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and photo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-3xl">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPhoto}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-semibold">{profile?.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingPhoto}
                        >
                          {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          value={profile?.email || ''}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+44 123 456 7890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your address"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveProfile} disabled={savingProfile}>
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input 
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input 
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleChangePassword} disabled={changingPassword}>
                            {changingPassword ? 'Changing...' : 'Change Password'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive booking updates and promotions via email</p>
                      </div>
                      <Switch 
                        id="email-notif"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notif">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive booking reminders via SMS</p>
                      </div>
                      <Switch 
                        id="sms-notif"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={savingProfile} variant="outline">
                      Save Notification Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
