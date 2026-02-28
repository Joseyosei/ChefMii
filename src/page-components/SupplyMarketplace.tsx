import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, ShoppingCart, Package, MapPin, Star, Tag, ChefHat, CheckCircle2, Calendar, Leaf, Zap, TrendingUp, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function SupplyMarketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vendor_products')
      .select('*, vendors(business_name, rating, address)');
    
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.vendors?.business_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const placeOrder = async (product: any) => {
    if (!user) {
      toast({ title: 'Please login to order', variant: 'destructive' });
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('vendor_orders')
        .insert({
          chef_id: user.id,
          vendor_id: product.vendor_id,
          total_amount: product.price,
          status: 'pending',
          delivery_address: 'Chef registered address' // Simplified for demo
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('vendor_order_items')
        .insert({
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: product.price
        });

      if (itemError) throw itemError;

      toast({ title: 'Order placed!', description: `Vendor ${product.vendors.business_name} will contact you soon.` });
    } catch (error) {
      console.error('Order error:', error);
      toast({ title: 'Order failed', variant: 'destructive' });
    }
  };

  const categories = [
    { id: 'all', label: 'All Produce', icon: Package },
    { id: 'vegetables', label: 'Vegetables', icon: Tag },
    { id: 'fruits', label: 'Fruits', icon: Tag },
    { id: 'fish', label: 'Fish & Seafood', icon: Tag },
    { id: 'livestock', label: 'Livestock/Meat', icon: Tag },
    { id: 'spices', label: 'Spices & Herbs', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-primary/10 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between border-2 border-primary/20">
          <div className="max-w-xl space-y-4">
            <Badge className="bg-primary text-primary-foreground uppercase tracking-widest text-[10px] font-bold py-1 px-3">B2B Marketplace</Badge>
            <h1 className="text-4xl font-bold">Chef's Supply Hub</h1>
            <p className="text-muted-foreground text-lg">
              Direct access to local farmers, fisheries, and premium spice merchants. Fresh ingredients from the source to your kitchen.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="text-sm font-medium">Verified Sources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="text-sm font-medium">Wholesale Pricing</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-2xl shadow-xl transform rotate-3 border-4 border-primary/10">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ChefHat className="text-primary w-6 h-6" />
                 </div>
                 <div>
                   <p className="font-bold">Next Delivery</p>
                   <p className="text-xs text-muted-foreground">Today at 4:00 PM</p>
                 </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary" />
                </div>
                <p className="text-[10px] text-right text-muted-foreground">Premium Spices - In Transit</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <Button 
                      key={cat.id} 
                      variant={activeCategory === cat.id ? 'default' : 'ghost'} 
                      className="justify-start h-11"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <cat.icon className="w-4 h-4 mr-3" />
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Seasonal Trends
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs font-bold text-primary uppercase">Peak Harvest</p>
                    <p className="text-sm font-medium">Heirloom Tomatoes</p>
                    <p className="text-[10px] text-muted-foreground">Best quality this week</p>
                  </div>
                  <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/10">
                    <p className="text-xs font-bold text-orange-600 uppercase">Coming Soon</p>
                    <p className="text-sm font-medium">Wild Mushrooms</p>
                    <p className="text-[10px] text-muted-foreground">Available in 12 days</p>
                  </div>
                </div>
              </div>

              <Card className="bg-muted/50 border-none">
                <CardHeader>
                  <CardTitle className="text-sm">Global Sourcing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ChefMii connects you with vendors globally. Filter by location to find the freshest local produce.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs">Manage Sourcing Radius</Button>
                </CardContent>
              </Card>
            </aside>

          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search products, vendors, or regions..." 
                  className="pl-10 h-12 rounded-xl" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-12 rounded-xl px-6">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)}
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden border-border group hover:shadow-2xl transition-all duration-300">
                      <div className="aspect-[4/3] bg-muted relative">
                        <img src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge className="bg-white/90 text-black backdrop-blur-sm border-none shadow-sm">{product.category}</Badge>
                          {product.is_organic && (
                            <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm flex items-center gap-1">
                              <Leaf className="w-3 h-3" /> Organic
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button className="p-2 bg-white/90 text-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          {product.bulk_price && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center cursor-help">
                                    <Zap className="w-4 h-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Bulk Pricing: £{product.bulk_price}/{product.unit || 'unit'} for orders over {product.bulk_threshold || 10} units</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        {product.harvest_date && (
                          <div className="absolute bottom-3 left-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Harvested: {new Date(product.harvest_date).toLocaleDateString()}
                            </div>
                            {product.origin && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {product.origin}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">£{product.price}</p>
                            <p className="text-[10px] text-muted-foreground">per {product.unit || 'unit'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{product.vendors?.address || 'Local Region'}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Vendor</p>
                            <p className="text-sm font-bold">{product.vendors?.business_name}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded text-xs font-bold">
                             <Star className="w-3 h-3 fill-yellow-600" />
                             {product.vendors?.rating || '5.0'}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full rounded-xl" onClick={() => placeOrder(product)}>Order Batch</Button>
                      </CardFooter>
                    </Card>
                  ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground font-medium">No products found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
