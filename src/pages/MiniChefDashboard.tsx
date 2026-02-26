import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ChefHat, Award, BookOpen, Star } from 'lucide-react';

interface MiniChefProfile {
  id: string;
  display_name: string;
  avatar_url: string;
  progress: {
    level: number;
    experience: number;
    completed_lessons: number;
    badges: string[];
  };
}

export default function MiniChefDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MiniChefProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('mini_chefs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, create a default one
        const defaultProfile = {
          user_id: user.id,
          display_name: user.user_metadata?.full_name || 'Mini Chef',
          avatar_url: '',
          progress: {
            level: 1,
            experience: 0,
            completed_lessons: 0,
            badges: []
          }
        };
        const { data: newData } = await supabase
          .from('mini_chefs')
          .insert([defaultProfile])
          .select()
          .single();
        setProfile(newData as any);
      } else if (data) {
        setProfile(data as any);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 animate-bounce mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading MiniChef profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6 text-center">
              <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl">{profile?.display_name?.[0]}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-2xl font-bold">{profile?.display_name}</h2>
              <p className="text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                Level {profile?.progress.level} Mini Chef
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experience Points</span>
                  <span>{profile?.progress.experience} / 1000</span>
                </div>
                <Progress value={(profile?.progress.experience || 0) / 10} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Stats & Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                    <p className="text-2xl font-bold">{profile?.progress.completed_lessons}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Badges</p>
                    <p className="text-2xl font-bold">{profile?.progress.badges.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full text-green-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="text-2xl font-bold">Top 10%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {profile?.progress.badges.length ? (
                    profile.progress.badges.map((badge, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <Award className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-medium">{badge}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No badges earned yet. Keep cooking!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">No recent activity. Start your first lesson in the Kids Zone!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
