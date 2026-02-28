import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { CalendarDays, Clock, Users, ChefHat, Check, CreditCard, Loader2 } from 'lucide-react';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const chefId = searchParams.get('chef') || '';
  const chefName = searchParams.get('name') || 'Chef';
  const serviceSlug = searchParams.get('service');
  
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [packageType, setPackageType] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (serviceSlug) {
      // Map service slugs to package names
      const mapping: Record<string, string> = {
        'daily-meal-prep': 'Family Feast',
        'family-chef': 'Family Feast',
        'seniors-meal': 'Family Feast',
        'student-meals': 'Family Feast',
        'couples-nights': 'Intimate Dinner',
        'birthday-bash': 'Party Package',
        'wedding-feast': 'Party Package',
        'bridal-bachelor': 'Party Package',
        'remembrance': 'Party Package',
        'baby-shower': 'Party Package',
        'office-lunch': 'Corporate Event',
        'conference-chef': 'Corporate Event',
        'school-meals': 'Corporate Event',
        'military-mess': 'Corporate Event',
        'flight-chef': 'Corporate Event',
        'royalty-residence': 'Corporate Event',
        'travel-chef': 'Corporate Event',
        'michelin-home': 'Intimate Dinner',
        'celebrity-wellness': 'Family Feast',
        'presidential-chef': 'Corporate Event',
        'on-set-chef': 'Corporate Event',
        'podcast-chef': 'Corporate Event',
        'festival-booth': 'Party Package',
        'kids-club': 'Family Feast',
        'holiday-feast': 'Party Package',
      };
      
      const matchedPackage = mapping[serviceSlug];
      if (matchedPackage) {
        setPackageType(matchedPackage);
      } else {
        // Try to match by name roughly
        const fallback = serviceSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setSpecialRequests(prev => `Interested in: ${fallback}. ${prev}`);
      }
    }
  }, [serviceSlug]);

  const packages = [
    { 
      name: 'Intimate Dinner', 
      labourCost: 150, 
      transportCost: 30, 
      ingredientsCost: 120, 
      hours: 4,
      description: 'Perfect for couples', 
      guests: '2-4',
      suggestions: 'Add wine pairing or dessert platter for the best experience.'
    },
    { 
      name: 'Family Feast', 
      labourCost: 300, 
      transportCost: 50, 
      ingredientsCost: 250, 
      hours: 6,
      description: 'Great for families', 
      guests: '5-8',
      suggestions: 'Include appetizers and a variety of side dishes.'
    },
    { 
      name: 'Party Package', 
      labourCost: 500, 
      transportCost: 80, 
      ingredientsCost: 400, 
      hours: 8,
      description: 'Ideal for celebrations', 
      guests: '10-15',
      suggestions: 'Buffet style setup and customized celebration cake.'
    },
    { 
      name: 'Corporate Event', 
      labourCost: 800, 
      transportCost: 120, 
      ingredientsCost: 600, 
      hours: 10,
      description: 'Professional catering', 
      guests: '15+',
      suggestions: 'Professional serving staff and premium corporate branding on menus.'
    },
  ];

  const timeSlots = ['12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00'];

  const selectedPackage = packages.find(p => p.name === packageType);
  const totalPrice = selectedPackage ? (selectedPackage.labourCost + selectedPackage.transportCost + selectedPackage.ingredientsCost) : 0;

  const handleCreateBooking = async () => {
    if (!user) {
      toast({ title: 'Please login to book', variant: 'destructive' });
      navigate('/login');
      return;
    }

    if (!date || !time || !packageType || !selectedPackage) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chefId);
    const actualChefId = isValidUUID ? chefId : user.id;
    
    const { data, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      chef_id: actualChefId,
      package_name: packageType,
      booking_date: date.toISOString().split('T')[0],
      booking_time: time,
      guests: parseInt(guests),
      special_requests: specialRequests || `Requested Chef: ${chefName}`,
      status: 'pending',
      total_price: totalPrice,
      payment_status: 'pending',
    }).select().single();

    if (error) {
      toast({ title: 'Error creating booking', variant: 'destructive' });
      setLoading(false);
      return;
    }

    setBookingId(data.id);
    setStep(4);
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!user || !bookingId || !selectedPackage) {
      toast({ title: 'Missing booking information', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          type: 'booking',
          items: [
            {
              name: `Chef Labour Cost: ${packageType}`,
              price: selectedPackage.labourCost,
              quantity: 1,
            },
            {
              name: `Transport Cost`,
              price: selectedPackage.transportCost,
              quantity: 1,
            },
            {
              name: `Cost of Ingredients`,
              price: selectedPackage.ingredientsCost,
              quantity: 1,
            }
          ],
          metadata: {
            booking_id: bookingId,
            chef_name: chefName,
            booking_date: date?.toISOString().split('T')[0],
            booking_time: time,
            hours: selectedPackage.hours.toString(),
          },
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=booking`,
          cancelUrl: `${window.location.origin}/booking?chef=${chefId}&name=${encodeURIComponent(chefName)}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({ 
        title: 'Payment failed', 
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPayment = () => {
    toast({ title: 'Booking request sent!' });
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-20 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Book {chefName}</h1>
          <p className="text-muted-foreground text-center mb-8">Complete your booking in 4 simple steps</p>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Select a Package
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`p-6 cursor-pointer transition-all ${
                        packageType === pkg.name ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                      }`}
                      onClick={() => setPackageType(pkg.name)}
                    >
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-2xl font-bold text-primary my-2">£{pkg.labourCost + pkg.transportCost + pkg.ingredientsCost}</p>
                      <p className="text-muted-foreground text-sm mb-2">{pkg.description}</p>
                      <div className="text-xs space-y-1 text-muted-foreground border-t pt-2">
                        <p>Labour: £{pkg.labourCost} ({pkg.hours} hrs)</p>
                        <p>Transport: £{pkg.transportCost}</p>
                        <p>Ingredients: £{pkg.ingredientsCost}</p>
                        <p className="text-primary italic mt-2">Suggest: {pkg.suggestions}</p>
                      </div>
                      <p className="text-sm mt-2 font-medium">Guests: {pkg.guests}</p>
                    </Card>
                  ))}
                </div>
                <Button className="w-full" size="lg" disabled={!packageType} onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Select Date & Time
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date()}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Select Time
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((t) => (
                        <Button
                          key={t}
                          variant={time === t ? 'default' : 'outline'}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Guests
                    </Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 6, 8, 10, 12, 15, 20].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} guests
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" disabled={!date || !time} onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review Your Booking</h2>
              
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chef</span>
                    <span className="font-medium">{chefName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package</span>
                    <span className="font-medium">{packageType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{date?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                    <div className="flex justify-between border-t pt-4">
                      <span className="font-semibold">Subtotal</span>
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground ml-4">
                      <div className="flex justify-between">
                        <span>Labour ({selectedPackage?.hours} hrs)</span>
                        <span>£{selectedPackage?.labourCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport</span>
                        <span>£{selectedPackage?.transportCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingredients</span>
                        <span>£{selectedPackage?.ingredientsCost}</span>
                      </div>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary text-xl">£{totalPrice}</span>
                    </div>
                  </div>
                </Card>

              <div>
                <Label htmlFor="requests">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  placeholder="Dietary requirements, allergies, special occasions..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" onClick={handleCreateBooking} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </h2>
              
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Booking Created!</h3>
                  <p className="text-muted-foreground">Complete payment to confirm your booking</p>
                </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-medium">{packageType}</span>
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground ml-4">
                      <div className="flex justify-between">
                        <span>Labour</span>
                        <span>£{selectedPackage?.labourCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport</span>
                        <span>£{selectedPackage?.transportCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingredients</span>
                        <span>£{selectedPackage?.ingredientsCost}</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary">£{totalPrice}</span>
                    </div>
                  </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handleSkipPayment} disabled={loading}>
                  Pay Later
                </Button>
                <Button className="flex-1" onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay with Stripe'
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Secure payment powered by Stripe. You can also pay later, but your booking won't be confirmed until payment is received.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Booking Request Sent!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {chefName} will review your request and get back to you shortly. You can view your booking in your dashboard.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate('/chefs')}>
                  Browse More Chefs
                </Button>
                <Button onClick={() => navigate('/user-dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingFlow;
