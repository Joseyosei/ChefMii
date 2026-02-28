import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap, Star, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AcademyPricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      name: "Starter",
      price: "9.99",
      period: "per course",
      description: "Perfect for hobbyists and home cooks looking to improve their skills.",
      features: [
        "Full lifetime access to 1 course",
        "Mobile and TV access",
        "Certificate of completion",
        "Course resources and materials",
        "Direct instructor support"
      ],
      cta: "Buy Now",
      highlight: false
    },
    {
      name: "Academy Plus",
      price: "29.99",
      period: "per month",
      description: "Best for aspiring professional chefs and culinary enthusiasts.",
      features: [
        "Unlimited access to ALL courses",
        "Exclusive monthly masterclasses",
        "Priority instructor support",
        "Professional certification path",
        "Early access to new content",
        "Ad-free experience"
      ],
      cta: "Go Pro",
      highlight: true
    },
    {
      name: "Professional",
      price: "199.99",
      period: "one-time",
      description: "Comprehensive professional training for career advancement.",
      features: [
        "Everything in Academy Plus",
        "1-on-1 mentorship sessions",
        "Career placement assistance",
        "Industry-recognized diploma",
        "Business management modules",
        "Access to alumni network"
      ],
      cta: "Join Academy",
      highlight: false
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      toast({ title: "Please login to subscribe", variant: "destructive" });
      navigate("/login");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'subscription',
          items: [
            {
              name: `Chefmii Academy: ${plan.name}`,
              price: parseFloat(plan.price),
              quantity: 1,
            }
          ],
          metadata: {
            plan_name: plan.name,
            user_id: user.id,
          },
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=academy`,
          cancelUrl: `${window.location.origin}/academy-pricing`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({ title: "Failed to initiate payment", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-6">
              CHEFMII ACADEMY PRICING
            </h1>
            <p className="text-xl text-muted-foreground">
              Invest in your culinary future. Choose the plan that fits your ambition and start learning from the world's best chefs today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <Card 
                key={i} 
                className={`p-8 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 border-2 ${
                  plan.highlight ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold uppercase italic rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black italic mb-2 uppercase">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">£{plan.price}</span>
                    <span className="text-muted-foreground font-semibold">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-muted-foreground font-medium leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-6 text-lg font-black uppercase italic rounded-xl ${
                    plan.highlight ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : ''
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="font-bold uppercase italic">Instant Access</h4>
              <p className="text-sm text-muted-foreground">Start learning immediately after checkout</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h4 className="font-bold uppercase italic">Top Instructors</h4>
              <p className="text-sm text-muted-foreground">Learn from Michelin-star and celebrity chefs</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-bold uppercase italic">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">Safe and encrypted checkout via Stripe</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-bold uppercase italic">Certificates</h4>
              <p className="text-sm text-muted-foreground">Earn recognized culinary credentials</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AcademyPricing;
