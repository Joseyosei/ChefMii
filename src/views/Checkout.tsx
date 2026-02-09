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
import { CreditCard, Truck, Lock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, total, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [loading, setLoading] = useState(false);

  const deliveryCost = deliveryMethod === 'express' ? 5.99 : 2.99;
  const orderTotal = total + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: 'Please login to complete checkout', variant: 'destructive' });
      navigate('/login');
      return;
    }

    setLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    await clearCart();
    toast({ title: 'Order placed successfully!' });
    navigate('/user-dashboard');
    setLoading(false);
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

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Address
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Surname</Label>
                    <Input id="lastName" required className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address Line 1</Label>
                    <Input id="address" required className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input id="address2" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input id="postcode" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required className="mt-1" />
                  </div>
                </div>
              </Card>

              {/* Delivery Method */}
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

              {/* Payment */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" required className="mt-1" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
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

                <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm and Pay'}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Secure checkout
                </div>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
