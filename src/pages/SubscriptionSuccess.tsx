import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Package, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 max-w-md text-center border-none shadow-2xl rounded-[40px]">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-black">Processing...</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 max-w-md text-center border-none shadow-2xl rounded-[40px]">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-black">Activating your subscription...</h2>
          <p className="text-muted-foreground mt-2">Please wait a moment.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="h-16 w-16 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-black italic mb-4 tracking-tight">SUBSCRIPTION ACTIVATED!</h1>
          <p className="text-lg text-muted-foreground mb-8 font-medium">
            Welcome to the ChefMii Smart Pantry! Your first box will be curated and shipped within 5-7 business days.
          </p>
          
          <Card className="p-8 mb-8 bg-gradient-to-br from-orange-50 to-pink-50 border-none rounded-[32px] shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-widest text-gray-400">What's Next</p>
                <p className="font-bold text-gray-900">Your box is being prepared</p>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-600">AI-curated ingredients based on your preferences</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-600">Exclusive recipes from top ChefMii chefs</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-600">Cancel or modify anytime from your dashboard</span>
              </div>
            </div>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#1a1a1a] hover:bg-black text-white font-black h-14 px-10 rounded-2xl shadow-xl"
              onClick={() => navigate('/user-dashboard')}
            >
              VIEW MY SUBSCRIPTIONS
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="font-black h-14 px-10 rounded-2xl"
              onClick={() => navigate('/marketplace')}
            >
              EXPLORE MORE
            </Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;
