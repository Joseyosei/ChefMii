import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Play, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  cuisine: string;
  likes_count: number;
  comments_count: number;
}

export default function ChefMediaGrid({ chefId }: { chefId: string }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('chef_id', chefId)
        .order('created_at', { ascending: false });

      if (data) {
        setVideos(data as any);
      }
      setLoading(false);
    }

    fetchVideos();
  }, [chefId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-video bg-accent/20 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <motion.div
          key={video.id}
          whileHover={{ scale: 1.02 }}
          className="relative group cursor-pointer"
        >
          <Card className="overflow-hidden border-0">
            <div className="relative aspect-video">
              <img 
                src={video.thumbnail_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop'} 
                alt={video.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
              <div className="absolute bottom-2 right-2 flex gap-2 text-white text-xs font-medium">
                <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
                  <Heart className="h-3 w-3 fill-white" />
                  {video.likes_count || 0}
                </div>
                <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
                  <MessageCircle className="h-3 w-3 fill-white" />
                  {video.comments_count || 0}
                </div>
              </div>
            </div>
          </Card>
          <h4 className="mt-2 text-sm font-medium truncate">{video.title}</h4>
        </motion.div>
      ))}
      {videos.length === 0 && (
        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          No videos uploaded yet.
        </div>
      )}
    </div>
  );
}
