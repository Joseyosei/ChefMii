import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Truck, Lock, Loader2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, total } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [loading, setLoading] = useState(false);

  const deliveryCost = deliveryMethod === 'express' ? 5.99 : 2.99;
  const orderTotal = total + deliveryCost;

  const handleStripeCheckout = async () => {
    if (!user) {
      toast({ title: 'Please login to complete checkout', variant: 'destructive' });
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast({ title: 'Your cart is empty', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({ title: 'Please login to complete checkout', variant: 'destructive' });
        navigate('/login');
        return;
      }

      const items = [
        ...cartItems.map((item) => ({
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image: item.product_image || undefined,
        })),
        {
          name: deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
          price: deliveryCost,
          quantity: 1,
        },
      ];

      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'shop',
          items,
          metadata: {
            delivery_method: deliveryMethod,
          },
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=shop`,
          cancelUrl: `${window.location.origin}/payment-cancelled`,
        },
      });

      if (response.error) {
        console.error('Checkout error:', response.error);
        const errorMessage = response.error.message || 'Failed to create checkout session';
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ 
        title: 'Checkout failed', 
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Address
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Surname</Label>
                  <Input id="lastName" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address Line 1</Label>
                  <Input id="address" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input id="address2" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" className="mt-1" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
              
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      <span className="font-medium">Standard Delivery</span>
                      <p className="text-sm text-muted-foreground">5-7 business days</p>
                    </Label>
                  </div>
                  <span className="font-semibold">£2.99</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 mt-3">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="cursor-pointer">
                      <span className="font-medium">Express Delivery</span>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </Label>
                  </div>
                  <span className="font-semibold">£5.99</span>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </h2>
              
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to Stripe's secure payment page to complete your purchase.
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product_name} x {item.quantity}
                    </span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Postage</span>
                  <span>£{deliveryCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Order Total</span>
                  <span>£{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg" 
                onClick={handleStripeCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay with Stripe'
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                Secure checkout powered by Stripe
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
