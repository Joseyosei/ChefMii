import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Star, Settings, LogOut, Bell, Calendar, DollarSign, Users, Clock, Plus, Trash2, MessageCircle, Menu, X, ChefHat, Edit, Image, Send, Camera, Upload, PlaySquare, Video, ShieldCheck, CheckCircle2, AlertCircle, Award, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cuisineTypes as CUISINE_TYPES, dietaryOptions as DIETARY_OPTIONS } from '@/data/globalChefs';

interface Booking {
  id: string;
  user_id: string;
  package_name: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  status: string;
  total_price: number;
  special_requests: string;
  user_name?: string;
}

interface Earning {
  id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  status: string;
  created_at: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  cuisine_type: string;
  dietary_tags: string[];
  is_active: boolean;
  image_url?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
}

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Conversation {
  id: string;
  user_id: string;
  last_message_at: string;
  user_name?: string;
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  trending: boolean;
  verified: boolean;
  traceability: any;
  created_at: string;
}

interface ChefProfile {
  bio: string;
  cuisine_types: string[];
  specialties: string[];
  hourly_rate: number;
  location: string;
  dietary_options: string[];
  years_experience: number;
  avatar_url: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  total_bookings: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ChefDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuImageRef = useRef<HTMLInputElement>(null);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chefProfile, setChefProfile] = useState<ChefProfile | null>(null);
    const [chefVideos, setChefVideos] = useState<any[]>([]);
    const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingMenuImage, setUploadingMenuImage] = useState(false);
    const [uploadingProductImage, setUploadingProductImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    
    const productImageRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);
    
    const [newProduct, setNewProduct] = useState({
      name: '',
      category: 'Sauces',
      price: 0,
      description: '',
      image_url: '',
      traceability: {}
    });
  
  const [settingsForm, setSettingsForm] = useState({
    fullName: '',
    hourlyRate: 0,
    location: '',
    yearsExperience: 0,
    bio: '',
    cuisineTypes: [] as string[],
    dietaryOptions: [] as string[],
  });
  
    const [newMenuItem, setNewMenuItem] = useState({
      name: '',
      description: '',
      price: 0,
      category: 'main',
      cuisine_type: '',
      dietary_tags: [] as string[],
      image_url: ''
    });
  
    const [restaurantData, setRestaurantData] = useState({
      name: '',
      description: '',
      address: '',
      phone: '',
      image_url: '',
      opening_hours: {}
    });
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    const [stats, setStats] = useState({

    totalEarnings: 0,
    monthlyEarnings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    avgRating: 0,
    totalReviews: 0
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

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('chef-chat-updates')
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

  useEffect(() => {
    if (chefProfile && profile) {
      setSettingsForm({
        fullName: profile.full_name || '',
        hourlyRate: chefProfile.hourly_rate || 0,
        location: chefProfile.location || '',
        yearsExperience: chefProfile.years_experience || 0,
        bio: chefProfile.bio || '',
        cuisineTypes: chefProfile.cuisine_types || [],
        dietaryOptions: chefProfile.dietary_options || [],
      });
    }
  }, [chefProfile, profile]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
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

      await supabase
        .from('chef_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      setChefProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast({ title: 'Profile photo updated!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleMenuImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setUploadingMenuImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `menu/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setNewMenuItem(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Image uploaded!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploadingMenuImage(false);
    }
  };

  const saveChefProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    
    try {
      await supabase
        .from('profiles')
        .update({ full_name: settingsForm.fullName })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('chef_profiles')
        .upsert({
          user_id: user.id,
          hourly_rate: settingsForm.hourlyRate,
          location: settingsForm.location,
          years_experience: settingsForm.yearsExperience,
          bio: settingsForm.bio,
          cuisine_types: settingsForm.cuisineTypes,
          dietary_options: settingsForm.dietaryOptions,
        });

      if (error) throw error;
      
      setChefProfile(prev => prev ? {
        ...prev,
        hourly_rate: settingsForm.hourlyRate,
        location: settingsForm.location,
        years_experience: settingsForm.yearsExperience,
        bio: settingsForm.bio,
        cuisine_types: settingsForm.cuisineTypes,
        dietary_options: settingsForm.dietaryOptions,
      } : null);
      
      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSavingProfile(false);
    }
  };

  const addCuisineType = () => {
    if (selectedCuisine && !settingsForm.cuisineTypes.includes(selectedCuisine)) {
      setSettingsForm(prev => ({
        ...prev,
        cuisineTypes: [...prev.cuisineTypes, selectedCuisine]
      }));
      setSelectedCuisine('');
      setAddCuisineOpen(false);
    }
  };

  const removeCuisineType = (cuisine: string) => {
    setSettingsForm(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.filter(c => c !== cuisine)
    }));
  };

  const addDietaryOption = () => {
    if (selectedDietary && !settingsForm.dietaryOptions.includes(selectedDietary)) {
      setSettingsForm(prev => ({
        ...prev,
        dietaryOptions: [...prev.dietaryOptions, selectedDietary]
      }));
      setSelectedDietary('');
      setAddDietaryOpen(false);
    }
  };

  const removeDietaryOption = (dietary: string) => {
    setSettingsForm(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.filter(d => d !== dietary)
    }));
  };

    const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: chefData } = await supabase
        .from('chef_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (chefData) {
        setChefProfile(chefData);
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('chef_id', user.id)
        .order('booking_date', { ascending: false });

      if (bookingsData) {
        const bookingsWithUsers = await Promise.all(bookingsData.map(async (booking) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', booking.user_id)
            .single();
          return { ...booking, user_name: userProfile?.full_name || 'Guest' };
        }));
        setBookings(bookingsWithUsers);
      }

      const { data: earningsData } = await supabase
        .from('chef_earnings')
        .select('*')
        .eq('chef_id', user.id)
        .order('created_at', { ascending: false });

      if (earningsData) {
        setEarnings(earningsData);
        const total = earningsData.reduce((acc, e) => acc + Number(e.net_amount), 0);
        const thisMonth = earningsData
          .filter(e => new Date(e.created_at).getMonth() === new Date().getMonth())
          .reduce((acc, e) => acc + Number(e.net_amount), 0);
        setStats(prev => ({ ...prev, totalEarnings: total, monthlyEarnings: thisMonth }));
      }

        const { data: menuData } = await supabase
          .from('chef_menus')
          .select('*')
          .eq('chef_id', user.id)
          .order('created_at', { ascending: false });

        if (menuData) {
          setMenuItems(menuData);
        }

        const { data: videoData } = await supabase
          .from('chef_media')
          .select('*')
          .eq('chef_id', user.id)
          .order('created_at', { ascending: false });

        if (videoData) {
          setChefVideos(videoData);
        }

        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('chef_id', user.id)
          .order('created_at', { ascending: false });

        if (productsData) {
          setMarketplaceProducts(productsData);
        }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('entity_id', user.id)
        .eq('entity_type', 'chef')
        .order('created_at', { ascending: false });

      if (reviewsData) {
        const reviewsWithUsers = await Promise.all(reviewsData.map(async (review) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', review.user_id)
            .single();
          return { ...review, user_name: userProfile?.full_name || 'Anonymous' };
        }));
        setReviews(reviewsWithUsers);
        const avgRating = reviewsWithUsers.length > 0 
          ? reviewsWithUsers.reduce((acc, r) => acc + r.rating, 0) / reviewsWithUsers.length 
          : 0;
        setStats(prev => ({ 
          ...prev, 
          avgRating: Math.round(avgRating * 10) / 10, 
          totalReviews: reviewsWithUsers.length 
        }));
      }

      const { data: availabilityData } = await supabase
        .from('chef_availability')
        .select('*')
        .eq('chef_id', user.id)
        .order('day_of_week', { ascending: true });

      if (availabilityData && availabilityData.length > 0) {
        setAvailability(availabilityData);
      } else {
        const defaultAvailability = DAYS.map((_, i) => ({
          id: `temp-${i}`,
          day_of_week: i,
          start_time: '09:00',
          end_time: '21:00',
          is_available: i !== 0
        }));
        setAvailability(defaultAvailability);
      }

      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .eq('chef_id', user.id)
        .order('last_message_at', { ascending: false });

      if (conversationsData) {
        const conversationsWithUsers = await Promise.all(conversationsData.map(async (conv) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', conv.user_id)
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
            user_name: userProfile?.full_name || 'User',
            last_message: lastMsg?.content,
            unread_count: count || 0
          };
        }));
        setConversations(conversationsWithUsers);
      }

      setStats(prev => ({
        ...prev,
        totalBookings: bookingsData?.length || 0,
        pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0
      }));

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

  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('video/')) {
      toast({ title: 'Please select a video file', variant: 'destructive' });
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `videos/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      setNewVideo(prev => ({ ...prev, video_url: publicUrl }));
      toast({ title: 'Video uploaded!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload video', variant: 'destructive' });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `thumbnails/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      setNewVideo(prev => ({ ...prev, thumbnail_url: publicUrl }));
      toast({ title: 'Thumbnail uploaded!' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Failed to upload thumbnail', variant: 'destructive' });
    }
  };

  const addVideo = async () => {
    if (!user || !newVideo.title || !newVideo.video_url) {
      toast({ title: 'Please provide title and video', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('chef_media')
      .insert({
        chef_id: user.id,
        title: newVideo.title,
        description: newVideo.description,
        video_url: newVideo.video_url,
        thumbnail_url: newVideo.thumbnail_url || null,
        type: 'video',
        status: 'published'
      })
      .select()
      .single();

    if (!error && data) {
      setChefVideos(prev => [data, ...prev]);
      setNewVideo({ title: '', description: '', video_url: '', thumbnail_url: '' });
      toast({ title: 'Video published!' });
    } else {
      toast({ title: 'Failed to publish video', variant: 'destructive' });
    }
  };

    const deleteVideo = async (videoId: string) => {
      const { error } = await supabase
        .from('chef_media')
        .delete()
        .eq('id', videoId);

      if (!error) {
        setChefVideos(prev => prev.filter(v => v.id !== videoId));
        toast({ title: 'Video deleted' });
      }
    };

    const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      if (!file.type.startsWith('image/')) {
        toast({ title: 'Please select an image file', variant: 'destructive' });
        return;
      }

      setUploadingProductImage(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `products/${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        setNewProduct(prev => ({ ...prev, image_url: publicUrl }));
        toast({ title: 'Product image uploaded!' });
      } catch (error) {
        console.error('Upload error:', error);
        toast({ title: 'Failed to upload product image', variant: 'destructive' });
      } finally {
        setUploadingProductImage(false);
      }
    };

    const addProduct = async () => {
      if (!user || !newProduct.name || !newProduct.price) {
        toast({ title: 'Please provide name and price', variant: 'destructive' });
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          chef_id: user.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          image_url: newProduct.image_url || null,
          traceability: newProduct.traceability || {},
          verified: true
        })
        .select()
        .single();

      if (!error && data) {
        setMarketplaceProducts(prev => [data, ...prev]);
        setNewProduct({
          name: '',
          category: 'Sauces',
          price: 0,
          description: '',
          image_url: '',
          traceability: {}
        });
        toast({ title: 'Product listed in Marketplace!' });
      } else {
        toast({ title: 'Failed to list product', variant: 'destructive' });
        console.error('Product add error:', error);
      }
    };

    const deleteProduct = async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (!error) {
        setMarketplaceProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: 'Product removed from Marketplace' });
      }
    };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      toast({ title: `Booking ${status}` });
    }
  };

  const addMenuItem = async () => {
    if (!user || !newMenuItem.name || !newMenuItem.price) return;

    const { data, error } = await supabase
      .from('chef_menus')
      .insert({
        chef_id: user.id,
        name: newMenuItem.name,
        description: newMenuItem.description,
        price: newMenuItem.price,
        category: newMenuItem.category,
        cuisine_type: newMenuItem.cuisine_type,
        dietary_tags: newMenuItem.dietary_tags,
        image_url: newMenuItem.image_url || null,
        is_active: true
      })
      .select()
      .single();

    if (!error && data) {
      setMenuItems(prev => [data, ...prev]);
      setNewMenuItem({ name: '', description: '', price: 0, category: 'main', cuisine_type: '', dietary_tags: [], image_url: '' });
      toast({ title: 'Menu item added' });
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    const { error } = await supabase
      .from('chef_menus')
      .delete()
      .eq('id', itemId);

    if (!error) {
      setMenuItems(prev => prev.filter(m => m.id !== itemId));
      toast({ title: 'Menu item deleted' });
    }
  };

  const toggleMenuItemActive = async (itemId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('chef_menus')
      .update({ is_active: isActive })
      .eq('id', itemId);

    if (!error) {
      setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, is_active: isActive } : m));
    }
  };

  const updateAvailability = async (dayOfWeek: number, field: string, value: any) => {
    const existingAvail = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (existingAvail && !existingAvail.id.startsWith('temp')) {
      const { error } = await supabase
        .from('chef_availability')
        .update({ [field]: value })
        .eq('id', existingAvail.id);

      if (!error) {
        setAvailability(prev => prev.map(a => 
          a.day_of_week === dayOfWeek ? { ...a, [field]: value } : a
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('chef_availability')
        .insert({
          chef_id: user?.id,
          day_of_week: dayOfWeek,
          start_time: existingAvail?.start_time || '09:00',
          end_time: existingAvail?.end_time || '21:00',
          is_available: existingAvail?.is_available ?? true,
          [field]: value
        })
        .select()
        .single();

      if (!error && data) {
        setAvailability(prev => prev.map(a => 
          a.day_of_week === dayOfWeek ? data : a
        ));
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
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

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'earnings', icon: DollarSign, label: 'Earnings' },
    { id: 'menu', icon: ChefHat, label: 'Menu Builder' },
    { id: 'restaurant', icon: Store, label: 'My Restaurant' },
    { id: 'products', icon: Package, label: 'My Products' },
    { id: 'videos', icon: Video, label: 'Videos' },
    { id: 'availability', icon: Clock, label: 'Availability' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
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
                {item.id === 'messages' && conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                  </Badge>
                )}
                {item.id === 'bookings' && stats.pendingBookings > 0 && (
                  <Badge variant="secondary" className="ml-auto">{stats.pendingBookings}</Badge>
                )}
              </Button>
            ))}
          </nav>
        </div>
        <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarImage src={chefProfile?.avatar_url} alt="Chef Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Chef'}</h1>
              <p className="text-sm text-muted-foreground capitalize">{activeNav}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {chefProfile?.is_verified && (
              <Badge className="bg-green-500">Verified</Badge>
            )}
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
                    <span className="text-sm text-muted-foreground">Monthly Earnings</span>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">£{stats.monthlyEarnings.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total: £{stats.totalEarnings.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.pendingBookings} pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.avgRating || '-'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.totalReviews} reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Menu Items</span>
                    <ChefHat className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{menuItems.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">{menuItems.filter(m => m.is_active).length} active</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-primary/20 bg-primary/5 shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-1/3 bg-primary/10 border-r border-primary/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">Trust Score</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Verification Progress</span>
                        <span>{chefProfile?.is_verified ? '100%' : '65%'}</span>
                      </div>
                      <Progress value={chefProfile?.is_verified ? 100 : 65} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Complete all verification steps to earn the "Verified Chef" badge and increase your visibility.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${chefProfile?.is_verified ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-600'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Identity Check</p>
                        <p className="text-xs text-muted-foreground">Passport/ID verified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${chefProfile?.is_verified ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-600'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Criminal Record</p>
                        <p className="text-xs text-muted-foreground">Enhanced DBS verified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Hygiene Cert</p>
                        <p className="text-xs text-muted-foreground">Verification pending</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${chefProfile?.is_verified ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-600'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Liability Insurance</p>
                        <p className="text-xs text-muted-foreground">£5M coverage active</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Culinary Degree</p>
                        <p className="text-xs text-muted-foreground">Upload diploma</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8 border-primary/30 hover:bg-primary/10">
                        Complete Verification
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Upcoming Bookings
                    <Button variant="ghost" size="sm" onClick={() => setActiveNav('bookings')}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.filter(b => new Date(b.booking_date) >= new Date()).slice(0, 4).length > 0 ? (
                    <div className="space-y-3">
                      {bookings.filter(b => new Date(b.booking_date) >= new Date()).slice(0, 4).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{booking.user_name}</p>
                            <p className="text-sm text-muted-foreground">{booking.package_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No upcoming bookings</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Reviews
                    <Button variant="ghost" size="sm" onClick={() => setActiveNav('reviews')}>View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.slice(0, 3).length > 0 ? (
                    <div className="space-y-3">
                      {reviews.slice(0, 3).map(review => (
                        <div key={review.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{review.user_name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No reviews yet</p>
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
              <TabsTrigger value="pending">Pending ({stats.pendingBookings})</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {bookings.filter(b => new Date(b.booking_date) >= new Date() && b.status !== 'pending').map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.user_name}</h3>
                        <p className="text-muted-foreground">{booking.package_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
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
                        {booking.special_requests && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded">Note: {booking.special_requests}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <p className="text-2xl font-bold mt-2">£{booking.total_price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="pending" className="mt-6 space-y-4">
              {bookings.filter(b => b.status === 'pending').map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.user_name}</h3>
                        <p className="text-muted-foreground">{booking.package_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                          <span>{booking.booking_time}</span>
                          <span>{booking.guests} guests</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => updateBookingStatus(booking.id, 'confirmed')}>Accept</Button>
                        <Button variant="destructive" onClick={() => updateBookingStatus(booking.id, 'cancelled')}>Decline</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {bookings.filter(b => b.status === 'pending').length === 0 && (
                <p className="text-center text-muted-foreground py-12">No pending bookings</p>
              )}
            </TabsContent>
            <TabsContent value="past" className="mt-6 space-y-4">
              {bookings.filter(b => new Date(b.booking_date) < new Date() || b.status === 'completed').map(booking => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{booking.user_name}</h3>
                        <p className="text-sm text-muted-foreground">{booking.package_name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(booking.booking_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <p className="font-bold mt-1">£{booking.total_price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {activeNav === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                  <p className="text-4xl font-bold text-green-600">£{stats.totalEarnings.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">This Month</p>
                  <p className="text-4xl font-bold">£{stats.monthlyEarnings.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Pending Payout</p>
                  <p className="text-4xl font-bold text-yellow-600">
                    £{earnings.filter(e => e.status === 'pending').reduce((acc, e) => acc + Number(e.net_amount), 0).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnings.length > 0 ? earnings.map(earning => (
                    <div key={earning.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Booking Earning</p>
                        <p className="text-sm text-muted-foreground">{new Date(earning.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+£{Number(earning.net_amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Fee: £{Number(earning.platform_fee).toFixed(2)}</p>
                        <Badge className={earning.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {earning.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-8">No earnings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeNav === 'menu' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Menu Item</CardTitle>
                <CardDescription>Add photos and details for your signature dishes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Food Photo</Label>
                    <div className="flex items-center gap-4">
                      {newMenuItem.image_url ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                          <img src={newMenuItem.image_url} alt="Menu item" className="w-full h-full object-cover" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => setNewMenuItem(prev => ({ ...prev, image_url: '' }))}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                          onClick={() => menuImageRef.current?.click()}
                        >
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Upload Photo</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={menuImageRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleMenuImageUpload}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => menuImageRef.current?.click()}
                        disabled={uploadingMenuImage}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {uploadingMenuImage ? 'Uploading...' : 'Select Image'}
                      </Button>
                    </div>
                  </div>
                  <Input 
                    placeholder="Item name" 
                    value={newMenuItem.name}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input 
                    type="number" 
                    placeholder="Price (£)" 
                    value={newMenuItem.price || ''}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                  <Textarea 
                    placeholder="Description" 
                    className="md:col-span-2"
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select value={newMenuItem.category} onValueChange={(v) => setNewMenuItem(prev => ({ ...prev, category: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="side">Side Dish</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newMenuItem.cuisine_type} onValueChange={(v) => setNewMenuItem(prev => ({ ...prev, cuisine_type: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUISINE_TYPES.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-4" onClick={addMenuItem}>
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Menu Items ({menuItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {menuItems.length > 0 ? menuItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline">{item.category}</Badge>
                          {!item.is_active && <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold">£{Number(item.price).toFixed(2)}</p>
                        <Switch 
                          checked={item.is_active} 
                          onCheckedChange={(checked) => toggleMenuItemActive(item.id, checked)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteMenuItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-8">No menu items yet. Add your first item above!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

          {activeNav === 'restaurant' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Profile</CardTitle>
                  <CardDescription>Manage your restaurant presence on ChefMii</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Restaurant Name</Label>
                      <Input value={restaurantData.name} onChange={e => setRestaurantData({...restaurantData, name: e.target.value})} placeholder="e.g., The Golden Whisk" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input value={restaurantData.phone} onChange={e => setRestaurantData({...restaurantData, phone: e.target.value})} placeholder="+44..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input value={restaurantData.address} onChange={e => setRestaurantData({...restaurantData, address: e.target.value})} placeholder="123 Culinary St..." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={restaurantData.description} onChange={e => setRestaurantData({...restaurantData, description: e.target.value})} placeholder="Describe your restaurant's atmosphere and cuisine..." />
                    </div>
                  </div>
                  <Button onClick={async () => {
                    const { data, error } = await supabase
                      .from('restaurants')
                      .upsert({
                        chef_id: user?.id,
                        ...restaurantData,
                        id: restaurantId || undefined
                      })
                      .select()
                      .single();
                    if (!error && data) {
                      setRestaurantId(data.id);
                      toast({ title: 'Restaurant profile updated!' });
                    }
                  }}>Save Restaurant Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Movement Tracking</CardTitle>
                  <CardDescription>Share your real-time location with customers when you're on the way</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold">Broadcast Location</p>
                        <p className="text-sm text-muted-foreground">Allows clients to see your arrival in real-time</p>
                      </div>
                    </div>
                    <Switch onCheckedChange={async (checked) => {
                      if (checked) {
                        navigator.geolocation.getCurrentPosition(async (pos) => {
                          await supabase.from('chef_locations').upsert({
                            chef_id: user?.id,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                            is_active: true
                          });
                          toast({ title: 'Location broadcasting active' });
                        });
                      } else {
                        await supabase.from('chef_locations').update({ is_active: false }).eq('chef_id', user?.id);
                        toast({ title: 'Location broadcasting stopped' });
                      }
                    }} />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/live-tracking')}>View Global Network Map</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav === 'videos' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Culinary Videos</CardTitle>
                  <CardDescription>Share your cooking techniques and signature dishes with your profile visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="mb-2 block">Video File</Label>
                      <div className="flex items-center gap-4">
                        {newVideo.video_url ? (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            <video src={newVideo.video_url} className="w-full h-full" controls />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => setNewVideo(prev => ({ ...prev, video_url: '' }))}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div 
                            className="w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            {uploadingVideo ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                <span className="text-sm font-medium">Select Video to Upload</span>
                                <span className="text-xs text-muted-foreground">MP4, WebM or MOV (max 100MB)</span>
                              </>
                            )}
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={videoInputRef}
                          className="hidden" 
                          accept="video/*"
                          onChange={handleVideoFileChange}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="mb-2 block">Thumbnail Image</Label>
                      <div className="flex items-center gap-4">
                        {newVideo.thumbnail_url ? (
                          <div className="relative w-40 aspect-video rounded-lg overflow-hidden border">
                            <img src={newVideo.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => setNewVideo(prev => ({ ...prev, thumbnail_url: '' }))}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="h-20 w-40 border-dashed"
                            onClick={() => thumbInputRef.current?.click()}
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Add Thumbnail
                          </Button>
                        )}
                        <input 
                          type="file" 
                          ref={thumbInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleThumbnailFileChange}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <Label>Video Title</Label>
                        <Input 
                          placeholder="e.g., How to sear the perfect Wagyu" 
                          value={newVideo.title}
                          onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          placeholder="Share the story or recipe behind this video..." 
                          value={newVideo.description}
                          onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6 w-full md:w-auto" onClick={addVideo} disabled={!newVideo.video_url || !newVideo.title}>
                    <Video className="w-4 h-4 mr-2" /> Publish Video
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefVideos.map(video => (
                  <Card key={video.id} className="overflow-hidden group">
                    <div className="aspect-video relative bg-black">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlaySquare className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-xl">
                              <Video className="h-6 w-6" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
                            <video src={video.video_url} className="w-full h-full aspect-video" controls autoPlay />
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteVideo(video.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold truncate">{video.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(video.created_at).toLocaleDateString()}
                        </span>
                        {video.status === 'published' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Published</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {chefVideos.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                  <Video className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground">No videos yet</h3>
                  <p className="text-muted-foreground mt-2">Start uploading your culinary journey today</p>
                </div>
              )}
            </div>
          )}

          {activeNav === 'products' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>List New Marketplace Product</CardTitle>
                  <CardDescription>Sell your signature sauces, spice blends, or curated kits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="mb-2 block">Product Photo</Label>
                      <div className="flex items-center gap-4">
                        {newProduct.image_url ? (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <img src={newProduct.image_url} alt="Product" className="w-full h-full object-cover" />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => setNewProduct(prev => ({ ...prev, image_url: '' }))}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <div 
                            className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                            onClick={() => productImageRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">Upload Image</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={productImageRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={handleProductImageUpload}
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => productImageRef.current?.click()}
                          disabled={uploadingProductImage}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {uploadingProductImage ? 'Uploading...' : 'Select Image'}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input 
                        placeholder="e.g., Signature Truffle Sauce" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (£)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newProduct.category} onValueChange={(v) => setNewProduct(prev => ({ ...prev, category: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sauces">Sauces</SelectItem>
                          <SelectItem value="Spices">Spices</SelectItem>
                          <SelectItem value="Oils">Oils</SelectItem>
                          <SelectItem value="Kits">Meal Kits</SelectItem>
                          <SelectItem value="Cookware">Cookware</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Describe what makes this product special..." 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button className="mt-6 w-full md:w-auto" onClick={addProduct}>
                    <Plus className="w-4 h-4 mr-2" /> List Product
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-square relative bg-muted">
                      {product.image_url ? (
                        <img src={product.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{product.category}</Badge>
                        {product.verified && <Badge className="bg-primary">Verified</Badge>}
                      </div>
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-4">{product.description}</p>
                      <div className="mt-auto pt-4 border-t flex items-center justify-between">
                        <p className="text-xl font-bold">£{Number(product.price).toFixed(2)}</p>
                        <Badge variant="secondary">In Stock</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {marketplaceProducts.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground">No products listed</h3>
                  <p className="text-muted-foreground mt-2">Start selling your signature products in the Marketplace</p>
                </div>
              )}
            </div>
          )}

          {activeNav === 'availability' && (
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((avail) => (
                  <div key={avail.day_of_week} className="flex flex-wrap items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-28">
                      <p className="font-medium">{DAYS[avail.day_of_week]}</p>
                    </div>
                    <Switch 
                      checked={avail.is_available}
                      onCheckedChange={(checked) => updateAvailability(avail.day_of_week, 'is_available', checked)}
                    />
                    {avail.is_available && (
                      <>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="time" 
                            value={avail.start_time} 
                            className="w-32"
                            onChange={(e) => updateAvailability(avail.day_of_week, 'start_time', e.target.value)}
                          />
                          <span>to</span>
                          <Input 
                            type="time" 
                            value={avail.end_time} 
                            className="w-32"
                            onChange={(e) => updateAvailability(avail.day_of_week, 'end_time', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {!avail.is_available && (
                      <span className="text-muted-foreground">Not available</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeNav === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <Card className="lg:col-span-1 overflow-hidden">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                <div className="divide-y">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => { setSelectedConversation(conv); fetchMessages(conv.id); }}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback>{conv.user_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{conv.user_name}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                      </div>
                      {conv.unread_count ? <Badge variant="destructive">{conv.unread_count}</Badge> : null}
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <p className="p-8 text-center text-muted-foreground">No conversations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{selectedConversation.user_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle>{selectedConversation.user_name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
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

        {activeNav === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-5xl font-bold">{stats.avgRating || '-'}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(stats.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stats.totalReviews} reviews</p>
              </div>
            </div>
            {reviews.length > 0 ? reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{review.user_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{review.user_name}</p>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Reviews from your clients will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeNav === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={chefProfile?.avatar_url} />
                      <AvatarFallback className="text-3xl">{profile?.full_name?.charAt(0)}</AvatarFallback>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Full Name</Label>
                    <Input 
                      value={settingsForm.fullName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Hourly Rate (£)</Label>
                    <Input 
                      type="number" 
                      value={settingsForm.hourlyRate || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Location</Label>
                    <Input 
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Years of Experience</Label>
                    <Input 
                      type="number" 
                      value={settingsForm.yearsExperience || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, yearsExperience: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Bio</Label>
                    <Textarea 
                      rows={4} 
                      value={settingsForm.bio}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={saveChefProfile} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cuisine & Specialties</CardTitle>
                <CardDescription>Add cuisines and dietary options you offer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Cuisine Types</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settingsForm.cuisineTypes.map((cuisine, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          {cuisine}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                            onClick={() => removeCuisineType(cuisine)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Dialog open={addCuisineOpen} onOpenChange={setAddCuisineOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Cuisine</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Cuisine Type</DialogTitle>
                        </DialogHeader>
                        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine" />
                          </SelectTrigger>
                          <SelectContent>
                            {CUISINE_TYPES.filter(c => !settingsForm.cuisineTypes.includes(c)).map(cuisine => (
                              <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAddCuisineOpen(false)}>Cancel</Button>
                          <Button onClick={addCuisineType}>Add</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <Label className="mb-2 block">Dietary Options</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {settingsForm.dietaryOptions.map((option, i) => (
                        <Badge key={i} variant="outline" className="gap-1 pr-1">
                          {option}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                            onClick={() => removeDietaryOption(option)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Dialog open={addDietaryOpen} onOpenChange={setAddDietaryOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Dietary Option</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Dietary Option</DialogTitle>
                        </DialogHeader>
                        <Select value={selectedDietary} onValueChange={setSelectedDietary}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dietary option" />
                          </SelectTrigger>
                          <SelectContent>
                            {DIETARY_OPTIONS.filter(d => !settingsForm.dietaryOptions.includes(d.id)).map(option => (
                              <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAddDietaryOpen(false)}>Cancel</Button>
                          <Button onClick={addDietaryOption}>Add</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button className="mt-4" onClick={saveChefProfile} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Cuisine & Dietary Options'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
