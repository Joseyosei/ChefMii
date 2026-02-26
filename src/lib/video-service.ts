import { supabase } from "@/integrations/supabase/client";

export async function insertComment(video_id: string, user_id: string, text: string) {
  const { data, error } = await supabase
    .from('video_comments')
    .insert([{ video_id, user_id, comment_text: text }])
    .select();
  return { data, error };
}

export async function uploadVideo(chef_id: string, title: string, cuisine: string, video_url: string, hashtags: string[]) {
  const { data: videoData, error: videoError } = await supabase
    .from('videos')
    .insert([{
      chef_id,
      title,
      cuisine,
      video_url,
      hashtags
    }])
    .select()
    .single();

  if (videoError) return { error: videoError };

  // Generate placeholder vector (128-dim)
  const vector = Array.from({ length: 128 }, () => Math.random());

  const { error: embedError } = await supabase
    .from('video_embeddings')
    .insert([{
      video_id: videoData.id,
      vector
    }]);

  return { data: videoData, error: embedError };
}

// Recommendation Algorithm Implementation
export async function recommend_videos_for_user(user_id: string, top_k = 20) {
  // Step 1: Retrieve user profile embedding
  const { data: userEmbed } = await supabase
    .from('user_embeddings')
    .select('vector')
    .eq('user_id', user_id)
    .single();

  const user_profile = userEmbed?.vector || Array.from({ length: 128 }, () => 0.5);

  // Step 2: Candidate generation
  // Get recent videos
  const { data: recentVideos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  // Get videos from chefs followed by user (mocking follow logic if not present)
  // Assuming a 'follows' table exists or just using recent videos for now
  const candidatePool = recentVideos || [];

  // Step 3: Score videos
  const scoredVideos = await Promise.all(candidatePool.map(async (video) => {
    const { data: videoEmbed } = await supabase
      .from('video_embeddings')
      .select('vector')
      .eq('video_id', video.id)
      .single();

    const video_embedding = videoEmbed?.vector || Array.from({ length: 128 }, () => Math.random());
    
    const engagement_score = Math.random(); // Mock engagement score
    const similarity = cosineSimilarity(user_profile, video_embedding);
    const freshness = calculateFreshness(video.created_at);
    
    const final_score = 0.6 * similarity + 0.3 * engagement_score + 0.1 * freshness;
    return { video, score: final_score };
  }));

  // Step 4: Rank and return
  return scoredVideos
    .sort((a, b) => b.score - a.score)
    .slice(0, top_k)
    .map(v => v.video);
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
}

function calculateFreshness(createdAt: string) {
  const ageInDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - ageInDays / 30); // 1.0 for new, 0 for 30+ days old
}

export async function generateVoiceover(text: string, videoId: string) {
  // Mock API call to ElevenLabs
  console.log(`Generating voiceover for text: ${text}`);
  const mockAudioUrl = `https://example.com/audio/${videoId}.mp3`;

  const { error } = await supabase
    .from('videos')
    .update({ voiceover_url: mockAudioUrl })
    .eq('id', videoId);

  return { audioUrl: mockAudioUrl, error };
}
