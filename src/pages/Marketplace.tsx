import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, TrendingUp, Award, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import productPastaSauce from "@/assets/product-pasta-sauce.jpg";
import productSpiceCollection from "@/assets/product-spice-collection.jpg";
import productCookbook from "@/assets/product-cookbook.jpg";

const Marketplace = () => {
  const products = [
    {
      name: "Chef Emma's Signature Pasta Sauce",
      chef: "Chef Emma Thompson",
      category: "Sauces",
      price: "£12.99",
      rating: 4.9,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
      trending: true,
      verified: true
    },
    {
      name: "Tokyo Spice Blend Collection",
      chef: "Chef Yuki Tanaka",
      category: "Spices",
      price: "£24.99",
      rating: 5.0,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1596040033229-a0b959d1d5f0?w=800&q=80",
      trending: true,
      verified: true
    },
    {
      name: "Mediterranean Recipe Book",
      chef: "Chef Maria Santos",
      category: "Books",
      price: "£34.99",
      rating: 4.8,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      trending: false,
      verified: true
    },
    {
      name: "Premium Truffle Oil",
      chef: "Chef Marco Ricci",
      category: "Oils & Vinegars",
      price: "£45.00",
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
      trending: true,
      verified: true
    },
    {
      name: "Artisan Meal Kit - Italian",
      chef: "Chef Marco Ricci",
      category: "Meal Kits",
      price: "£49.99",
      rating: 5.0,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&q=80",
      trending: false,
      verified: true
    },
    {
      name: "Professional Chef Knife Set",
      chef: "ChefMii Collection",
      category: "Cookware",
      price: "£199.99",
      rating: 4.9,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
      trending: true,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-accent/20 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">ChefMii Market</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Shop Chef-Created Products
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover signature sauces, spice blends, recipe books, meal kits, 
              and premium cookware from world-class chefs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Input placeholder="Search products..." className="flex-1" />
              <Link to="/marketplace">
                <Button size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Browse All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            {[
              { icon: Shield, text: "Secure Checkout" },
              { icon: Award, text: "Chef Verified" },
              { icon: TrendingUp, text: "Premium Quality" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="sauces">Sauces</SelectItem>
                <SelectItem value="spices">Spices</SelectItem>
                <SelectItem value="books">Recipe Books</SelectItem>
                <SelectItem value="kits">Meal Kits</SelectItem>
                <SelectItem value="cookware">Cookware</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25">Under £25</SelectItem>
                <SelectItem value="25-50">£25 - £50</SelectItem>
                <SelectItem value="50-100">£50 - £100</SelectItem>
                <SelectItem value="100+">£100+</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Trending Products</h2>
              <p className="text-muted-foreground">Hand-picked by our chef community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <Card key={i} className="overflow-hidden hover-lift group">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                  {product.trending && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.verified && (
                      <Shield className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">by {product.chef}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">{product.price}</p>
                    <Link to="/register">
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chef Picks Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Chef's Picks This Month</h2>
            <p className="text-xl text-muted-foreground">
              Curated selections from our featured culinary experts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                <img src={productSpiceCollection} alt="Holiday Spice Collection" className="object-cover w-full h-full" />
              </div>
              <Badge className="mb-2">Limited Edition</Badge>
              <h3 className="text-xl font-semibold mb-2">Holiday Spice Collection</h3>
              <p className="text-muted-foreground mb-4">Exclusive seasonal blend</p>
              <Link to="/marketplace">
                <Button className="w-full">Shop Now</Button>
              </Link>
            </Card>
            <Card className="p-6">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                <img src={productCookbook} alt="Asian Fusion Cookbook" className="object-cover w-full h-full" />
              </div>
              <Badge className="mb-2">New Release</Badge>
              <h3 className="text-xl font-semibold mb-2">Asian Fusion Cookbook</h3>
              <p className="text-muted-foreground mb-4">50 innovative recipes</p>
              <Link to="/marketplace">
                <Button className="w-full">Shop Now</Button>
              </Link>
            </Card>
            <Card className="p-6">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                <img src={productPastaSauce} alt="Premium Olive Oil Set" className="object-cover w-full h-full" />
              </div>
              <Badge className="mb-2">Best Seller</Badge>
              <h3 className="text-xl font-semibold mb-2">Premium Olive Oil Set</h3>
              <p className="text-muted-foreground mb-4">From Italian vineyards</p>
              <Link to="/marketplace">
                <Button className="w-full">Shop Now</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;