import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <XCircle className="h-14 w-14 text-orange-600" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground mb-8">
            No worries! Your payment was cancelled and you haven't been charged. 
            Your cart items are still saved if you'd like to complete your purchase later.
          </p>
          
          <Card className="p-6 mb-8 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              If you experienced any issues during checkout, please contact our support team.
            </p>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/cart')}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Return to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentCancelled;
