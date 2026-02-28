import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, Play, Heart, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ============================================================
// TYPES
// ============================================================

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

interface FilterState {
  type: string;
  sortBy: 'latest' | 'popular' | 'trending';
  search: string;
}

// ============================================================
// ALGORITHM: CONTENT RANKING & RECOMMENDATION
// ============================================================

const calculateTrendingScore = (media: ChefMedia): number => {
  const hoursSincePublished = 
    (Date.now() - new Date(media.published_at).getTime()) / (1000 * 60 * 60);
  
  const engagementScore = (media.likes * 2) + (media.views * 0.5);
  const timeDecay = Math.pow(hoursSincePublished + 2, 1.5);
  
  let freshnessMultiplier = 1;
  if (hoursSincePublished < 24) freshnessMultiplier = 2;
  else if (hoursSincePublished < 168) freshnessMultiplier = 1.5; // 7 days
  else if (hoursSincePublished > 720) freshnessMultiplier = 0.8; // 30 days
  
  return (engagementScore / timeDecay) * freshnessMultiplier;
};

const sortByAlgorithm = (
  mediaList: ChefMedia[], 
  sortBy: 'latest' | 'popular' | 'trending'
): ChefMedia[] => {
  switch (sortBy) {
    case 'latest':
      return [...mediaList].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    case 'popular':
      return [...mediaList].sort((a, b) => b.views - a.views);
    case 'trending':
      return [...mediaList].sort(
        (a, b) => calculateTrendingScore(b) - calculateTrendingScore(a)
      );
    default:
      return mediaList;
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views: number): string => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    recipe: 'Recipe',
    tutorial: 'Tutorial',
    behind_the_scenes: 'Behind the Scenes',
    live: 'Live',
    interview: 'Interview',
  };
  return labels[type] || type;
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    recipe: 'bg-green-500',
    tutorial: 'bg-blue-500',
    behind_the_scenes: 'bg-purple-500',
    live: 'bg-red-500',
    interview: 'bg-yellow-500',
  };
  return colors[type] || 'bg-gray-500';
};

// ============================================================
// COMPONENTS
// ============================================================

// Media Card Component
function MediaCard({ media }: { media: ChefMedia }) {
  return (
    <Link to={`/chef-media/${media.id}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={media.thumbnail_url || '/placeholder-video.jpg'}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(media.duration_seconds)}
          </div>
          
          {/* Type Badge */}
          <div className={`absolute top-2 left-2 ${getTypeColor(media.type)} text-white text-xs px-2 py-1 rounded-full px-2`}>
            {getTypeLabel(media.type)}
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-orange-500 ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors text-left">
            {media.title}
          </h3>
          
          {/* Chef Info */}
          <Link 
            to={`/chef-media/chef/${media.chef_id}`}
            className="flex items-center gap-2 mt-3 hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={media.chef?.avatar_url || '/placeholder-avatar.jpg'}
              alt={media.chef?.name || 'Chef'}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {media.chef?.name}
                {media.chef?.verified && (
                  <span className="text-orange-500">✓</span>
                )}
              </p>
              <p className="text-xs text-gray-500">{media.chef?.specialty}</p>
            </div>
          </Link>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatViews(media.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {formatViews(media.likes)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Filter Bar Component
function FilterBar({ 
  filters, 
  onFilterChange 
}: { 
  filters: FilterState; 
  onFilterChange: (filters: FilterState) => void;
}) {
  const contentTypes = [
    { value: '', label: 'All Content' },
    { value: 'recipe', label: 'Recipes' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'behind_the_scenes', label: 'Behind the Scenes' },
    { value: 'live', label: 'Live Streams' },
    { value: 'interview', label: 'Interviews' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos, chefs, recipes..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="trending">🔥 Trending</option>
          <option value="latest">🕐 Latest</option>
          <option value="popular">👀 Most Viewed</option>
        </select>
      </div>
    </div>
  );
}

// Featured Section Component
function FeaturedSection({ media }: { media: ChefMedia[] }) {
  const featured = media.slice(0, 3);
  
  if (featured.length === 0) return null;
  
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900">Featured This Week</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function ChefMediaPage() {
  const [media, setMedia] = useState<ChefMedia[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<ChefMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    sortBy: 'trending',
    search: '',
  });

  // Fetch media data
  useEffect(() => {
    async function fetchMedia() {
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
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching media:', error);
      } else {
        setMedia(data || []);
      }
      
      setLoading(false);
    }

    fetchMedia();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...media];

    // Filter by type
    if (filters.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.chef?.name?.toLowerCase().includes(searchLower) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting algorithm
    result = sortByAlgorithm(result, filters.sortBy);

    setFilteredMedia(result);
  }, [media, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chef Media</h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Discover recipes, tutorials, and behind-the-scenes content from our amazing chefs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">No videos found</h3>
            <p className="text-gray-500 mb-4 text-center">
              {filters.search || filters.type
                ? 'Try adjusting your filters'
                : 'Check back soon for new content'}
            </p>
            {(filters.search || filters.type) && (
              <button
                onClick={() => setFilters({ type: '', sortBy: 'trending', search: '' })}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Section (only show when no filters active) */}
            {!filters.search && !filters.type && filters.sortBy === 'trending' && (
              <FeaturedSection media={filteredMedia} />
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredMedia.length}</span> videos
              </p>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
