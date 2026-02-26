import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function CommentBox({ videoId }: { videoId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel(`video_comments:video_id=eq.${videoId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_comments',
          filter: `video_id=eq.${videoId}`,
        },
        async (payload) => {
          // Fetch the profile for the new comment
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', payload.new.user_id)
            .single();
            
          const commentWithProfile = {
            ...payload.new,
            profiles: profile
          } as Comment;
          
          setComments(prev => [commentWithProfile, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('video_comments')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data as any);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please login to comment" });
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('video_comments')
      .insert([{
        video_id: videoId,
        user_id: user.id,
        comment_text: newComment
      }]);

    if (error) {
      toast({ title: "Error", description: "Failed to post comment", variant: "destructive" });
    } else {
      setNewComment('');
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
      <div className="p-4 border-bottom">
        <h3 className="font-semibold text-lg">Comments</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{comment.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-accent/30 p-3 rounded-2xl rounded-tl-none">
                <p className="text-sm font-semibold mb-1">{comment.profiles?.full_name || 'Anonymous User'}</p>
                <p className="text-sm">{comment.comment_text}</p>
              </div>
              <span className="text-[10px] text-muted-foreground ml-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)} 
          placeholder="Write a comment..." 
          className="rounded-full"
          disabled={loading}
        />
        <Button type="submit" size="sm" className="rounded-full" disabled={loading || !newComment.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
}
