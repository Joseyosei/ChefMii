import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, Settings, LogOut, Bell, Package, ShoppingCart, Users, Plus, Trash2, MessageCircle, Menu, X, Camera, Upload, ShieldCheck, CheckCircle2, TrendingUp, DollarSign, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChefMiiLogo from '@/components/ChefMiiLogo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { signOut, profile, user, loading } = useAuth();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlySales: 0,
    activeProducts: 0,
    pendingOrders: 0
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    unit: 'kg',
    category: 'vegetables',
    stock_quantity: 0,
    image_url: ''
  });

  const productImageRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchVendorData();
    }
  }, [user, loading]);

  const fetchVendorData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch Vendor Profile
      const { data: vProfile, error: vError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (vProfile) {
        setVendorProfile(vProfile);
        
        // Fetch Products
        const { data: pData } = await supabase
          .from('vendor_products')
          .select('*')
          .eq('vendor_id', vProfile.id)
          .order('created_at', { ascending: false });
        
        setProducts(pData || []);

        // Fetch Orders
        const { data: oData } = await supabase
          .from('vendor_orders')
          .select('*, profiles(full_name)')
          .eq('vendor_id', vProfile.id)
          .order('created_at', { ascending: false });
        
        setOrders(oData || []);

        // Calculate Stats
        const total = (oData || []).reduce((acc, o) => acc + Number(o.total_amount), 0);
        const monthly = (oData || [])
          .filter(o => new Date(o.created_at).getMonth() === new Date().getMonth())
          .reduce((acc, o) => acc + Number(o.total_amount), 0);

        setStats({
          totalSales: total,
          monthlySales: monthly,
          activeProducts: pData?.length || 0,
          pendingOrders: oData?.filter(o => o.status === 'pending').length || 0
        });
      } else {
        // If no vendor profile exists, we should probably redirect to a "Setup Vendor" step
        // For now, let's create a dummy one if it's a vendor role
        if (profile?.role === 'vendor') {
           const { data: newV } = await supabase
            .from('vendors')
            .insert({
              user_id: user.id,
              business_name: profile.full_name + "'s Farm",
              vendor_type: 'farmer'
            })
            .select()
            .single();
           if (newV) setVendorProfile(newV);
        }
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `vendor-products/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setNewProduct(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Image uploaded!' });
    } catch (error) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const addProduct = async () => {
    if (!vendorProfile || !newProduct.name || !newProduct.price) return;

    const { data, error } = await supabase
      .from('vendor_products')
      .insert({
        vendor_id: vendorProfile.id,
        ...newProduct
      })
      .select()
      .single();

    if (!error && data) {
      setProducts(prev => [data, ...prev]);
      setNewProduct({ name: '', description: '', price: 0, unit: 'kg', category: 'vegetables', stock_quantity: 0, image_url: '' });
      toast({ title: 'Product added to marketplace' });
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('vendor_products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Product removed' });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('vendor_orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast({ title: `Order ${status}` });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <ChefMiiLogo />
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant={activeNav === item.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          <Button variant="outline" className="mt-auto" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Vendor Hub</h1>
              <p className="text-muted-foreground">{vendorProfile?.business_name}</p>
            </div>
          </div>
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {activeNav === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Monthly Sales</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">£{stats.monthlySales.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Sales</span>
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">£{stats.totalSales.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Active Products</span>
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats.activeProducts}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Pending Orders</span>
                    <ShoppingCart className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-bold">{order.profiles?.full_name || 'Chef'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">£{Number(order.total_amount).toFixed(2)}</p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-center text-muted-foreground">No orders yet</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Trust Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Vendor Verification</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Farm Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Business License</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Quality Assured</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4" />
                      <span>DBS Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeNav === 'inventory' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Produce</CardTitle>
                <CardDescription>List your fresh harvests for chefs to browse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="md:col-span-1">
                    <Label className="mb-2 block">Product Image</Label>
                    <div 
                      className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-muted"
                      onClick={() => productImageRef.current?.click()}
                    >
                      {newProduct.image_url ? (
                        <img src={newProduct.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Upload Image</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={productImageRef} className="hidden" onChange={handleImageUpload} />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input placeholder="e.g., Fresh Organic Carrots" value={newProduct.name} onChange={e => setNewProduct(prev => ({...prev, name: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newProduct.category} onValueChange={v => setNewProduct(prev => ({...prev, category: v}))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetables">Vegetables</SelectItem>
                            <SelectItem value="fruits">Fruits</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="spices">Spices</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Price (£)</Label>
                        <Input type="number" value={newProduct.price} onChange={e => setNewProduct(prev => ({...prev, price: Number(e.target.value)}))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input placeholder="e.g., kg, box" value={newProduct.unit} onChange={e => setNewProduct(prev => ({...prev, unit: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input type="number" value={newProduct.stock_quantity} onChange={e => setNewProduct(prev => ({...prev, stock_quantity: Number(e.target.value)}))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={newProduct.description} onChange={e => setNewProduct(prev => ({...prev, description: e.target.value}))} />
                    </div>
                    <Button onClick={addProduct} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add to Inventory</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <img src={p.image_url || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500'} className="w-full h-full object-cover" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-sm text-primary font-bold">£{p.price} / {p.unit}</p>
                    <p className="text-xs text-muted-foreground mt-1">Stock: {p.stock_quantity} units</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeNav === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="space-y-4 pt-4">
                  {orders.filter(o => o.status === 'pending').map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div className="flex items-center gap-4">
                        <Avatar><AvatarFallback>{order.profiles?.full_name?.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-bold">{order.profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">Order ID: {order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold">£{Number(order.total_amount).toFixed(2)}</p>
                        <Button onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept</Button>
                        <Button variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>Decline</Button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'pending').length === 0 && <p className="text-center py-12 text-muted-foreground">No pending orders</p>}
                </TabsContent>
                <TabsContent value="active" className="space-y-4 pt-4">
                  {orders.filter(o => ['accepted', 'shipped'].includes(o.status)).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div>
                        <p className="font-bold">{order.profiles?.full_name}</p>
                        <Badge>{order.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        {order.status === 'accepted' && <Button onClick={() => updateOrderStatus(order.id, 'shipped')}>Mark Shipped</Button>}
                        {order.status === 'shipped' && <Button onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</Button>}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {activeNav === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input value={vendorProfile?.business_name} onChange={e => setVendorProfile({...vendorProfile, business_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input value={vendorProfile?.phone} onChange={e => setVendorProfile({...vendorProfile, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Business Address</Label>
                  <Textarea value={vendorProfile?.address} onChange={e => setVendorProfile({...vendorProfile, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Business Description</Label>
                  <Textarea value={vendorProfile?.description} onChange={e => setVendorProfile({...vendorProfile, description: e.target.value})} />
                </div>
                <Button className="w-full">Save Profile Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
