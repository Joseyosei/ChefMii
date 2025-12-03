import { useState } from 'react';
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
import { CalendarDays, Clock, Users, ChefHat, Check } from 'lucide-react';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const chefId = searchParams.get('chef') || '';
  const chefName = searchParams.get('name') || 'Chef';
  
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [packageType, setPackageType] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const packages = [
    { name: 'Intimate Dinner', price: '£150', description: 'Perfect for couples', guests: '2-4' },
    { name: 'Family Feast', price: '£300', description: 'Great for families', guests: '5-8' },
    { name: 'Party Package', price: '£500', description: 'Ideal for celebrations', guests: '10-15' },
    { name: 'Corporate Event', price: '£800+', description: 'Professional catering', guests: '15+' },
  ];

  const timeSlots = ['12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00'];

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Please login to book', variant: 'destructive' });
      navigate('/login');
      return;
    }

    if (!date || !time || !packageType) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      chef_id: chefId,
      package_name: packageType,
      booking_date: date.toISOString().split('T')[0],
      booking_time: time,
      guests: parseInt(guests),
      special_requests: specialRequests,
      status: 'pending',
    });

    if (error) {
      toast({ title: 'Error creating booking', variant: 'destructive' });
    } else {
      toast({ title: 'Booking request sent!' });
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Book {chefName}</h1>
          <p className="text-muted-foreground text-center mb-8">Complete your booking in 3 simple steps</p>

          {/* Step 1: Select Package */}
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
                    <p className="text-2xl font-bold text-primary my-2">{pkg.price}</p>
                    <p className="text-muted-foreground text-sm">{pkg.description}</p>
                    <p className="text-sm mt-2">Guests: {pkg.guests}</p>
                  </Card>
                ))}
              </div>
              <Button className="w-full" size="lg" disabled={!packageType} onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Date & Time */}
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

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
              
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
                <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
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
