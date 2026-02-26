-- Table for chef matches (dating feature)
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  chef_id TEXT NOT NULL,
  liked BOOLEAN NOT NULL DEFAULT false,
  super_liked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create matches" ON public.matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their matches" ON public.matches FOR UPDATE USING (auth.uid() = user_id);

-- Table for chef videos
CREATE TABLE public.chef_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chef_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chef videos" ON public.chef_videos FOR SELECT USING (true);
CREATE POLICY "Chefs can upload their videos" ON public.chef_videos FOR INSERT WITH CHECK (auth.uid() = chef_id);
CREATE POLICY "Chefs can update their videos" ON public.chef_videos FOR UPDATE USING (auth.uid() = chef_id);
CREATE POLICY "Chefs can delete their videos" ON public.chef_videos FOR DELETE USING (auth.uid() = chef_id);

-- Table for video likes
CREATE TABLE public.video_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.chef_videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video likes" ON public.video_likes FOR SELECT USING (true);
CREATE POLICY "Users can like videos" ON public.video_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike videos" ON public.video_likes FOR DELETE USING (auth.uid() = user_id);

-- Table for follows
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  chef_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, chef_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow chefs" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow chefs" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Table for comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.chef_videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can post comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Table for saved videos
CREATE TABLE public.saved_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.chef_videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.saved_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved videos" ON public.saved_videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save videos" ON public.saved_videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave videos" ON public.saved_videos FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for chef videos
INSERT INTO storage.buckets (id, name, public) VALUES ('chef-videos', 'chef-videos', true);

CREATE POLICY "Anyone can view chef videos" ON storage.objects FOR SELECT USING (bucket_id = 'chef-videos');
CREATE POLICY "Authenticated users can upload chef videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chef-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own videos" ON storage.objects FOR UPDATE USING (bucket_id = 'chef-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own videos" ON storage.objects FOR DELETE USING (bucket_id = 'chef-videos' AND auth.uid()::text = (storage.foldername(name))[1]);