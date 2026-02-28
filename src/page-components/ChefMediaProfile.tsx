import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, Heart, Eye, UserPlus, Star, 
  MapPin, Globe, Award, ChefHat, 
  Calendar, Info, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Chef {
  id: string;
  name: string;
  avatar_url: string;
  cover_image_url?: string;
  specialty: string;
  bio: string;
  location: string;
  verified: boolean;
  rating: number;
  total_reviews: number;
  total_followers: number;
  certifications: string[];
}

interface ChefMedia {
  id: string;
  title: string;
  type: string;
  thumbnail_url: string;
  duration_seconds: number;
  views: number;
  likes: number;
  published_at: string;
}

export default function ChefMediaProfilePage() {
  const { chefId } = useParams();
  const [chef, setChef] = useState<Chef | null>(null);
  const [media, setMedia] = useState<ChefMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChefData() {
      if (!chefId) return;
      setLoading(true);

      // Fetch Chef details
      const { data: chefData, error: chefError } = await supabase
        .from('chefs')
        .select('*')
        .eq('id', chefId)
        .single();

      if (chefError) {
        console.error('Error fetching chef:', chefError);
      } else {
        setChef(chefData);
      }

      // Fetch Chef's Media
      const { data: mediaData, error: mediaError } = await supabase
        .from('chef_media')
        .select('*')
        .eq('chef_id', chefId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (mediaError) {
        console.error('Error fetching chef media:', mediaError);
      } else {
        setMedia(mediaData || []);
      }

      setLoading(false);
    }

    fetchChefData();
  }, [chefId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Navbar />
        <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Chef Not Found</h2>
        <Link to="/chef-media" className="text-orange-500 hover:underline">Back to Chef Media</Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Cover Image */}
      <div className="h-64 md:h-80 w-full relative">
        <img 
          src={chef.cover_image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d'} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <img 
                  src={chef.avatar_url || '/placeholder-avatar.jpg'} 
                  alt={chef.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md mx-auto -mt-20 mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                  {chef.name}
                  {chef.verified && <span className="text-orange-500 text-sm">✓</span>}
                </h1>
                <p className="text-orange-500 font-medium">{chef.specialty}</p>
                
                <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-gray-900">{chef.rating}</span>
                  <span className="text-gray-400 text-sm">({chef.total_reviews})</span>
                </div>
              </div>

              <div className="flex gap-2 mb-8">
                <button className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                  Follow
                </button>
                <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <UserPlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{chef.location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <ChefHat className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">Pro Chef</span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {chef.certifications?.map((cert) => (
                        <span key={cert} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Video Catalog */}
          <div className="lg:col-span-3">
            {/* Stats Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap gap-8">
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Followers</p>
                <p className="text-2xl font-bold text-gray-900">{chef.total_followers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {media.reduce((acc, m) => acc + m.views, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Videos</p>
                <p className="text-2xl font-bold text-gray-900">{media.length}</p>
              </div>
            </div>

            {/* About */}
            <section className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 text-left">
                <Info className="w-5 h-5 text-orange-500" />
                About Chef {chef.name}
              </h2>
              <p className="text-gray-600 leading-relaxed text-left">
                {chef.bio}
              </p>
            </section>

            {/* Content Tabs */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 text-left">Video Catalog</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium hover:border-orange-500 transition-colors">Latest</button>
                <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium hover:border-orange-500 transition-colors">Most Popular</button>
              </div>
            </div>

            {/* Video Grid */}
            {media.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
                <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No videos published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {media.map((item) => (
                  <Link key={item.id} to={`/chef-media/${item.id}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                      <div className="relative aspect-video">
                        <img 
                          src={item.thumbnail_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded">
                          {Math.floor(item.duration_seconds / 60)}:{(item.duration_seconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-orange-500 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-left">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-orange-500 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {item.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
