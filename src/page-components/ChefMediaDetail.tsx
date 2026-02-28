import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, Heart, Eye, Share2, MessageCircle, 
  ChevronRight, Clock, Calendar, Bookmark,
  ThumbsUp, UserPlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ChefMedia {
  id: string;
  chef_id: string;
  title: string;
  description: string;
  type: 'recipe' | 'tutorial' | 'behind_the_scenes' | 'live' | 'interview';
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  views: number;
  likes: number;
  tags: string[];
  published_at: string;
  chef: {
    id: string;
    name: string;
    avatar_url: string;
    specialty: string;
    verified: boolean;
  };
}

export default function ChefMediaDetailPage() {
  const { id } = useParams();
  const [media, setMedia] = useState<ChefMedia | null>(null);
  const [related, setRelated] = useState<ChefMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('chef_media')
        .select(`
          *,
          chef:chefs (
            id,
            name,
            avatar_url,
            specialty,
            verified
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching media:', error);
      } else {
        setMedia(data);
        fetchRelated(data.chef_id, data.id);
        // Track view
        incrementViews(data.id);
      }
      setLoading(false);
    }

    async function fetchRelated(chefId: string, currentId: string) {
      const { data } = await supabase
        .from('chef_media')
        .select(`
          *,
          chef:chefs (
            id,
            name,
            avatar_url,
            specialty,
            verified
          )
        `)
        .eq('status', 'published')
        .neq('id', currentId)
        .limit(4);
      
      setRelated(data || []);
    }

    fetchMedia();
  }, [id]);

  const incrementViews = async (mediaId: string) => {
    await supabase.rpc('increment_media_views', { media_id: mediaId });
  };

  const handleLike = async () => {
    if (!media) return;
    setLiked(!liked);
    // In production, update Supabase media_likes table
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Play className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Video Not Found</h2>
          <Link to="/chef-media" className="text-orange-500 hover:underline">Back to Chef Media</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-lg">
              {media.video_url ? (
                <video 
                  src={media.video_url} 
                  controls 
                  className="w-full h-full"
                  poster={media.thumbnail_url}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" fill="currentColor" />
                    <p className="text-xl font-medium">Video Player Placeholder</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title & Stats */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-left">
              {media.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {media.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(media.published_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked ? 'bg-orange-500 text-white' : 'bg-white border hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  {liked ? media.likes + 1 : media.likes}
                </button>
                <button className="p-2 rounded-full bg-white border hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full bg-white border hover:bg-gray-50">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Chef Profile */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <Link to={`/chef-media/chef/${media.chef_id}`} className="flex items-center gap-4 group">
                <img 
                  src={media.chef?.avatar_url || '/placeholder-avatar.jpg'} 
                  alt={media.chef?.name} 
                  className="w-14 h-14 rounded-full border-2 border-orange-100 group-hover:border-orange-500 transition-colors"
                />
                <div className="text-left">
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    {media.chef?.name}
                    {media.chef?.verified && <span className="text-orange-500 text-sm">✓</span>}
                  </p>
                  <p className="text-sm text-gray-500">{media.chef?.specialty}</p>
                </div>
              </Link>
              <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
                <UserPlus className="w-4 h-4" />
                Follow
              </button>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 text-left">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap text-left">
                {media.description || 'No description provided.'}
              </p>
              
              {media.tags && media.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {media.tags.map((tag) => (
                    <span key={tag} className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Related Content */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-left">
              Related Content
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </h3>
            <div className="space-y-4">
              {related.map((item) => (
                <Link key={item.id} to={`/chef-media/${item.id}`} className="flex gap-4 group">
                  <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                      {Math.floor(item.duration_seconds / 60)}:{(item.duration_seconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-orange-500 transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{item.chef?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.views.toLocaleString()} views</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
