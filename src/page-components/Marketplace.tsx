import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, ShoppingCart, Heart, TrendingUp, Award, Shield, 
  Leaf, MapPin, Calendar, CheckCircle2, Search, ArrowRight,
  Package, Zap, Sparkles, Database, Info, X, ChevronRight, Loader2, Play
} from "lucide-react";
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showTraceability, setShowTraceability] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          chef:chef_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setProducts(defaultProducts);
      } else {
        const mappedProducts = data && data.length > 0 ? data.map(p => ({
          ...p,
          image: p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
          reviews: p.reviews_count || 0,
          chef: p.chef?.full_name || p.endorsed_by || "ChefMii Collection"
        })) : defaultProducts;
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Marketplace fetch error:", err);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.chef.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const defaultProducts = [
    {
      id: "1",
      name: "Chef Emma's Signature Pasta Sauce",
      chef: "Chef Emma Thompson",
      category: "Sauces",
      price: 12.99,
      rating: 4.9,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80",
      trending: true,
      verified: true,
      course_link: "/academy",
      traceability: {
        origin: "Parma, Italy",
        farm: "Verdi Organic Estates",
        harvest: "Sept 2025",
        sustainability: "CO2 Neutral",
        blockchain_id: "ETH-0x4f2...a91",
        timeline: [
          { date: "Sept 12, 2025", status: "Harvested", location: "Verdi Estates, Parma" },
          { date: "Sept 15, 2025", status: "Quality Verified", location: "Chef Ricci Lab" },
          { date: "Sept 20, 2025", status: "Eco-Packed", location: "Milan Hub" },
          { date: "Oct 05, 2025", status: "Arrived", location: "London Distribution" }
        ]
      }
    },
    {
      id: "2",
      name: "Tokyo Spice Blend Collection",
      chef: "Chef Yuki Tanaka",
      category: "Spices",
      price: 24.99,
      rating: 5.0,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
      trending: true,
      verified: true,
      course_link: "/academy",
      traceability: {
        origin: "Kyoto, Japan",
        farm: "Mountain Herb Coop",
        harvest: "Aug 2025",
        sustainability: "Traditional Methods",
        blockchain_id: "POL-0x82...e22",
        timeline: [
          { date: "Aug 05, 2025", status: "Hand-Picked", location: "Kyoto Mountains" },
          { date: "Aug 10, 2025", status: "Sun-Dried", location: "Kyoto Herb Coop" },
          { date: "Aug 25, 2025", status: "Master Blended", location: "Chef Yuki's Studio" },
          { date: "Sept 10, 2025", status: "Exported", location: "Osaka Port" }
        ]
      }
    },
    {
      id: "3",
      name: "Mediterranean Recipe Book",
      chef: "Chef Maria Santos",
      category: "Books",
      price: 34.99,
      rating: 4.8,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      trending: false,
      verified: true
    },
    {
      id: "4",
      name: "Premium Truffle Oil",
      chef: "Chef Marco Ricci",
      category: "Oils & Vinegars",
      price: 45.00,
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
      trending: true,
      verified: true,
      traceability: {
        origin: "Alba, Italy",
        farm: "Ricci Truffle Forest",
        harvest: "Oct 2025",
        sustainability: "Pesticide Free",
        blockchain_id: "ETH-0x12...b88"
      }
    },
    {
      id: "5",
      name: "Artisan Meal Kit - Italian",
      chef: "Chef Marco Ricci",
      category: "Meal Kits",
      price: 49.99,
      rating: 5.0,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80",
      trending: false,
      verified: true
    },
    {
      id: "6",
      name: "Professional Chef Knife Set",
      chef: "ChefMii Collection",
      category: "Cookware",
      price: 199.99,
      rating: 4.9,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
      trending: true,
      verified: true
    }
  ];

  const smartSubscriptions = [
    { name: "Chef's Pantry Box", price: "£35/mo", contents: "4 Chef Sauces + 2 Spices", color: "bg-orange-50", subscriptionType: "chefs-pantry-box" },
    { name: "Global Spice Journey", price: "£20/mo", contents: "3 Rare Spices + Recipes", color: "bg-blue-50", subscriptionType: "global-spice-journey" },
    { name: "The Baker's Secret", price: "£25/mo", contents: "Professional Flour & Extracts", color: "bg-pink-50", subscriptionType: "bakers-secret" },
  ];

  const handleSubscribe = async (subscriptionType: string) => {
    if (!user) {
      toast({ title: 'Please login to subscribe', variant: 'destructive' });
      navigate('/login');
      return;
    }

    setSubscriptionLoading(subscriptionType);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Please login to subscribe', variant: 'destructive' });
        navigate('/login');
        return;
      }

      const response = await supabase.functions.invoke('create-subscription-checkout', {
        body: {
          subscriptionType,
          successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/marketplace`,
        },
      });

      if (response.error) {
        console.error('Subscription checkout error:', response.error);
        const errorMessage = response.error.message || 'Failed to create checkout session';
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Error',
        description: error instanceof Error ? error.message : 'Failed to start subscription checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubscriptionLoading(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    if (!user) {
      toast({ title: 'Please login to add items to cart', variant: 'destructive' });
      navigate('/login');
      return;
    }
    
    const success = await addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
    });
    
    if (success) {
      setShowCart(true);
    }
  };

  const handleTraceability = (product: any) => {
    setSelectedProduct(product);
    setShowTraceability(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-primary text-white border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-xs">ChefMii Global Marketplace</Badge>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-tight">
              PRO PANTRY <br/>FOR HOME CHEFS
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl font-semibold leading-relaxed">
              Direct access to the ingredients and tools that power the world's most talented kitchens. Verified by Blockchain.
            </p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                   <Input 
                     placeholder="Search sauces, spices, kits..." 
                     className="w-full bg-white/10 border-white/20 h-16 pl-12 rounded-2xl text-lg focus:ring-primary focus:border-primary" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-2xl text-lg shadow-2xl transition-all hover:gap-6"
                  onClick={() => {
                    const grid = document.getElementById('products-grid');
                    grid?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  EXPLORE ALL <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
          </div>
        </div>
      </section>

      {/* Trust & Innovation Badges */}
      <section className="py-12 border-b bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Database, text: "Blockchain Traced", sub: "Farm-to-fork transparency" },
              { icon: Award, text: "Chef Verified", sub: "Pro-grade quality testing" },
              { icon: Leaf, text: "100% Sustainable", sub: "Carbon neutral shipping" },
              { icon: Shield, text: "Secure Web3 Pay", sub: "Encrypted transactions" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-help">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">{item.text}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Pantry Subscriptions */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-600 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">Never Run Out</Badge>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Smart Pantry Subscriptions</h2>
            </div>
            <Button variant="ghost" className="font-black hover:text-primary transition-colors">VIEW ALL SUBS <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {smartSubscriptions.map((sub, i) => (
                <Card key={i} className={`${sub.color} border-none p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden`}>
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/40 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                  <div className="relative z-10">
                    <Package className="h-10 w-10 mb-6 text-gray-900" />
                    <h3 className="text-2xl font-black mb-2">{sub.name}</h3>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-6">{sub.contents}</p>
                    <div className="flex items-center justify-between mt-8">
                      <span className="text-3xl font-black italic">{sub.price}</span>
                      <Button 
                        onClick={() => handleSubscribe(sub.subscriptionType)}
                        disabled={subscriptionLoading === sub.subscriptionType}
                        className="bg-white text-black hover:bg-black hover:text-white font-black rounded-full h-12 px-8 shadow-lg disabled:opacity-50"
                      >
                        {subscriptionLoading === sub.subscriptionType ? (
                          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> LOADING...</>
                        ) : (
                          'SUBSCRIBE'
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </div>
      </section>

      {/* Main Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tight mb-2">Curated Pro Essentials</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Professional ingredients for your domestic kitchen</p>
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {["All", "Sauces", "Spices", "Oils", "Kits", "Cookware", "Books"].map((cat) => (
                <Button 
                  key={cat} 
                  variant="outline" 
                  className={`rounded-full px-8 font-black uppercase tracking-widest text-xs h-10 transition-all ${selectedCategory === cat ? 'bg-primary text-white border-none shadow-lg scale-105' : 'bg-white hover:border-primary hover:text-primary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id || i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="bg-white border-none shadow-xl rounded-[40px] overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                        <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-900">
                          <Heart className="h-5 w-5" />
                        </button>
                        {product.traceability && (
                          <button 
                            onClick={() => handleTraceability(product)}
                            className="w-12 h-12 rounded-2xl bg-primary/90 backdrop-blur shadow-xl flex items-center justify-center hover:bg-primary text-white transition-all"
                          >
                            <Database className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {product.trending && (
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-[#FF4B2B] text-white border-none font-black uppercase text-[9px] px-3 py-1 rounded-full shadow-lg">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            TRENDING
                          </Badge>
                        </div>
                      )}

                        {/* AI Recommendation Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          {product.course_link && (
                            <Link 
                              to={product.course_link}
                              className="inline-flex items-center gap-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 hover:bg-white hover:text-primary transition-colors"
                            >
                              <Play className="h-3 w-3 fill-current" /> WATCH MASTERCLASS
                            </Link>
                          )}
                          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-2">
                             <Sparkles className="h-3 w-3" /> AI Suggestion
                          </div>
                          <p className="text-white text-xs font-bold leading-tight">"Pairs perfectly with Chef Yuki's Spice Blend and Organic Fusilli."</p>
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="border-gray-100 bg-gray-50 text-gray-400 rounded-full font-black text-[9px] uppercase">{product.category}</Badge>
                        {product.verified && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">VERIFIED</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-black italic leading-tight mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">by {product.chef}</p>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-black">{product.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">({product.reviews} reviews)</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                        <p className="text-3xl font-black italic">£{product.price.toFixed(2)}</p>
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#1a1a1a] hover:bg-black text-white font-black h-12 px-8 rounded-2xl shadow-xl flex items-center gap-3"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          ADD
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-10 right-10 z-[100] bg-primary text-white w-20 h-20 rounded-full shadow-[0_20px_50px_rgba(255,107,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <ShoppingCart className="h-8 w-8" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
            {itemCount}
          </span>
        </button>
      )}

      {/* Blockchain Traceability Sheet */}
      <Sheet open={showTraceability} onOpenChange={setShowTraceability}>
        <SheetContent side="right" className="bg-white border-none sm:max-w-md p-0 overflow-hidden">
           <div className="h-full flex flex-col">
             <div className="p-8 bg-[#1a1a1a] text-white">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary/80">Blockchain Ledger Verified</span>
                  </div>
                  <SheetTitle className="text-3xl font-black italic text-white leading-tight">Farm-to-Fork Traceability</SheetTitle>
                  <SheetDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-2">
                    Immutable transparency for every ingredient
                  </SheetDescription>
                </SheetHeader>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {selectedProduct?.traceability && (
                  <>
                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supply Chain Timeline</p>
                      <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                        {selectedProduct.traceability.timeline?.map((step: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-primary shadow-sm" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{step.date}</span>
                              <span className="text-sm font-black italic text-gray-900">{step.status}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{step.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-100">
                      {[
                        { label: "Country of Origin", value: selectedProduct.traceability.origin, icon: MapPin },
                        { label: "Sourcing Farm", value: selectedProduct.traceability.farm, icon: Leaf },
                        { label: "Harvest Period", value: selectedProduct.traceability.harvest, icon: Calendar },
                        { label: "ESG Rating", value: selectedProduct.traceability.sustainability, icon: Shield },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                            <item.icon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-lg font-black text-gray-900 italic">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-black text-sm uppercase">Verified Authentic</span>
                       </div>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">This product has been scanned and verified at 4 key checkpoints: Processing, Packaging, Export, and Final Warehouse.</p>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase">Blockchain Hash ID</p>
                          <code className="block bg-white p-3 rounded-xl text-[10px] font-mono border border-gray-200 break-all">
                             {selectedProduct.traceability.blockchain_id}
                          </code>
                       </div>
                    </div>
                  </>
                )}
             </div>

             <div className="p-8 border-t bg-gray-50">
               <Button onClick={() => setShowTraceability(false)} className="w-full bg-[#1a1a1a] hover:bg-black text-white font-black py-8 rounded-2xl text-lg">
                 CLOSE LEDGER
               </Button>
               <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">
                 Powered by ChefMii Chain v2.6
               </p>
             </div>
           </div>
        </SheetContent>
      </Sheet>

      {/* Side-Cart Drawer */}
      <Sheet open={showCart} onOpenChange={setShowCart}>
        <SheetContent side="right" className="bg-white border-none sm:max-w-md p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-8 bg-[#1a1a1a] text-white">
              <SheetHeader className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary/80">Your Pro Pantry Cart</span>
                </div>
                <SheetTitle className="text-3xl font-black italic text-white leading-tight">Shopping Cart</SheetTitle>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                    <ShoppingCart className="h-10 w-10 text-gray-200" />
                  </div>
                  <p className="text-lg font-black italic text-gray-900 mb-2">Your cart is empty</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Start adding pro ingredients</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-3xl border border-gray-100 group hover:border-primary/20 transition-colors">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.product_image || ''} className="w-full h-full object-cover" alt={item.product_name} />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black italic text-sm leading-tight mb-1">{item.product_name}</h4>
                          <p className="text-[10px] font-black text-primary">£{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-black transition-colors">-</button>
                            <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-black transition-colors">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black italic text-gray-900">£{total.toFixed(2)}</span>
              </div>
              <Button 
                onClick={() => navigate('/cart')}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-8 rounded-2xl text-lg shadow-xl"
                disabled={cartItems.length === 0}
              >
                CHECKOUT NOW
              </Button>
              <button 
                onClick={() => setShowCart(false)}
                className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 hover:text-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default Marketplace;
