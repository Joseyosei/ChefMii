import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Package, Calendar, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type') || 'shop';

  useEffect(() => {
    if (sessionId && type === 'shop' && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [sessionId, type, cleared, clearCart]);

  useEffect(() => {
    const confirmBooking = async () => {
      if (sessionId && type === 'booking' && !bookingConfirmed && !isConfirming) {
        setIsConfirming(true);
        try {
          const { data, error } = await supabase.functions.invoke('confirm-booking', {
            body: { session_id: sessionId },
          });

          if (error) {
            console.error('Error confirming booking:', error);
            setConfirmError(error.message || 'Failed to confirm booking');
          } else if (data?.success) {
            setBookingConfirmed(true);
          } else if (data?.error) {
            setConfirmError(data.error);
          }
        } catch (err) {
          console.error('Error confirming booking:', err);
          setConfirmError('Failed to confirm booking');
        } finally {
          setIsConfirming(false);
        }
      }
    };

    confirmBooking();
  }, [sessionId, type, bookingConfirmed, isConfirming]);

  const getSuccessContent = () => {
    switch (type) {
      case 'booking':
        return {
          icon: Calendar,
          title: 'Booking Confirmed!',
          description: 'Your chef booking has been successfully paid. The chef will receive your booking details and confirm shortly.',
          cta: 'View My Bookings',
          link: '/user-dashboard',
        };
      case 'course':
        return {
          icon: GraduationCap,
          title: 'Enrollment Complete!',
          description: 'Welcome to ChefMii Academy! You now have full access to your course. Start learning today.',
          cta: 'Go to My Courses',
          link: '/user-dashboard',
        };
      default:
        return {
          icon: Package,
          title: 'Order Confirmed!',
          description: 'Thank you for your purchase! Your order has been placed and will be shipped soon.',
          cta: 'View My Orders',
          link: '/user-dashboard',
        };
    }
  };

  const content = getSuccessContent();
  const Icon = content.icon;

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Processing...</h2>
        </Card>
      </div>
    );
  }

  if (type === 'booking' && isConfirming) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Confirming your booking...</h2>
          <p className="text-muted-foreground mt-2">Please wait while we process your payment.</p>
        </Card>
      </div>
    );
  }

  if (type === 'booking' && confirmError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertCircle className="h-14 w-14 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Received</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment was successful, but there was an issue confirming your booking automatically. 
              Please contact support with your session ID.
            </p>
            <Card className="p-4 mb-8 bg-muted/50">
              <p className="text-sm text-muted-foreground font-mono break-all">{sessionId}</p>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/user-dashboard')}>
                View My Bookings
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Contact Support
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{content.description}</p>
          
          <Card className="p-6 mb-8 bg-muted/50">
            <div className="flex items-center justify-center gap-3">
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm text-muted-foreground">
                Confirmation sent to your email
              </span>
            </div>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate(content.link)}>
              {content.cta}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/')}>
              Continue Browsing
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
