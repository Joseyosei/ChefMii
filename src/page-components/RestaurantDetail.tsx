import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, MapPin, Clock, Phone, ShoppingBag, Plus, Minus, X, CheckCircle2, Store, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    setLoading(true);
    // Fetch Restaurant
    const { data: rest, error: restError } = await supabase
      .from('restaurants')
      .select('*, profiles(full_name, avatar_url)')
      .eq('id', id)
      .single();

    if (rest) {
      setRestaurant(rest);
      // Fetch Menu Items (reusing chef_menus for now or we could add restaurant_id to chef_menus)
      const { data: items } = await supabase
        .from('chef_menus')
        .select('*')
        .eq('chef_id', rest.chef_id)
        .eq('is_active', true);
      
      setMenuItems(items || []);
    }
    setLoading(false);
  };

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({ title: `Added ${item.name} to cart` });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = Math.max(0, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (!user) {
      toast({ title: 'Please login to order', variant: 'destructive' });
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('restaurant_orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurant.id,
          total_amount: cartTotal,
          status: 'pending',
          delivery_address: 'User default address'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemError } = await supabase
        .from('restaurant_order_items')
        .insert(orderItems);

      if (itemError) throw itemError;

      toast({ title: 'Order placed successfully!', description: 'The restaurant has received your order.' });
      setCart([]);
    } catch (error) {
      toast({ title: 'Order failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!restaurant) {
    return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><h1 className="text-2xl font-bold">Restaurant not found</h1><Button onClick={() => navigate('/')}>Go Home</Button></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <img src={restaurant.profiles?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + restaurant.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-white space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                  <Badge className="bg-primary text-white border-none">Restaurant</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.address}</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {restaurant.rating || '5.0'} ({restaurant.total_reviews} reviews)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Open Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-bold">Full Menu</h2>
              <div className="flex gap-2">
                 <Badge variant="outline">Main Course</Badge>
                 <Badge variant="outline">Appetizers</Badge>
                 <Badge variant="outline">Drinks</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map(item => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all border-border/50">
                  <div className="aspect-[16/10] bg-muted relative">
                    <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <Button size="icon" className="rounded-full shadow-lg" onClick={() => addToCart(item)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="font-bold text-primary">£{Number(item.price).toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.dietary_tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] py-0">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {menuItems.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">This restaurant hasn't listed any menu items yet.</p>}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">£{Number(item.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-muted rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-muted-foreground hover:text-primary"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-muted-foreground hover:text-primary"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                          <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Your cart is empty</p>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 border-t bg-muted/30 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>£{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                          <span>Total</span>
                          <span>£{cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      <Button className="w-full h-12 rounded-xl text-lg font-bold" onClick={placeOrder}>
                        Checkout Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                    Chef Information
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <Avatar>
                      <AvatarImage src={restaurant.profiles?.avatar_url} />
                      <AvatarFallback>{restaurant.profiles?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{restaurant.profiles?.full_name}</p>
                      <p className="text-xs text-muted-foreground">Executive Chef</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/chef-media/chef/${restaurant.chef_id}`)}>View Chef Portfolio</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
