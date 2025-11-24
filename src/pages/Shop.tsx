import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Sparkles, Gift, Shirt } from "lucide-react";
import { Link } from "react-router-dom";
import productChefApron from "@/assets/product-chef-apron.jpg";
import productChefJacket from "@/assets/product-chef-jacket.jpg";
import productCuttingBoard from "@/assets/product-cutting-board.jpg";
import productUtensils from "@/assets/product-utensils.jpg";
import productChefHat from "@/assets/product-chef-hat.jpg";
import productGiftSet from "@/assets/product-gift-set.jpg";

const Shop = () => {
  const products = [
    {
      name: "Premium Chef Apron - Classic Black",
      category: "Chefwear",
      price: "£59.99",
      rating: 4.9,
      reviews: 234,
      image: productChefApron,
      colors: ["Black", "White", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      endorsed: "Chef Emma Thompson"
    },
    {
      name: "Professional Chef Jacket - Double Breasted",
      category: "Chefwear",
      price: "£89.99",
      rating: 5.0,
      reviews: 456,
      image: productChefJacket,
      colors: ["White", "Black"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      endorsed: "Chef Marco Ricci"
    },
    {
      name: "Bamboo Cutting Board Set",
      category: "Kitchen Accessories",
      price: "£45.00",
      rating: 4.8,
      reviews: 678,
      image: productCuttingBoard,
      colors: ["Natural"],
      endorsed: "ChefMii Collection"
    },
    {
      name: "Stainless Steel Utensil Set",
      category: "Kitchen Accessories",
      price: "£79.99",
      rating: 4.9,
      reviews: 892,
      image: productUtensils,
      colors: ["Silver", "Rose Gold"],
      endorsed: "Professional Grade"
    },
    {
      name: "Chef Hat Collection",
      category: "Chefwear",
      price: "£34.99",
      rating: 4.7,
      reviews: 345,
      image: productChefHat,
      colors: ["White"],
      sizes: ["One Size"],
      endorsed: "Traditional Design"
    },
    {
      name: "Gourmet Gift Set",
      category: "Gift Sets",
      price: "£129.99",
      rating: 5.0,
      reviews: 567,
      image: productGiftSet,
      colors: ["Premium"],
      endorsed: "Perfect for gifting"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">ChefMii Shop</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Culinary Lifestyle Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Premium chefwear, kitchen accessories, and gourmet gifts. 
              Curated for professionals and home cooks alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg">
                  <Shirt className="mr-2 h-5 w-5" />
                  Shop Chefwear
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline">
                  <Gift className="mr-2 h-5 w-5" />
                  Gift Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">New Collection Launch</p>
                <p className="text-background/80">Premium Spring/Summer 2025 Line</p>
              </div>
            </div>
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                Explore Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search products..." className="md:w-80" />
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="chefwear">Chefwear</SelectItem>
                <SelectItem value="accessories">Kitchen Accessories</SelectItem>
                <SelectItem value="gifts">Gift Sets</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">Under £50</SelectItem>
                <SelectItem value="50-100">£50 - £100</SelectItem>
                <SelectItem value="100+">£100+</SelectItem>
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
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground">High-quality essentials for culinary professionals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <Card key={i} className="overflow-hidden hover-lift group">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  {product.colors && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {product.colors.map((color, j) => (
                        <div key={j} className="w-6 h-6 rounded-full bg-background/80 backdrop-blur border-2 border-white flex items-center justify-center">
                          <div className={`w-4 h-4 rounded-full ${color === 'Black' ? 'bg-black' : color === 'White' ? 'bg-white border border-gray-300' : color === 'Navy' ? 'bg-blue-900' : color === 'Rose Gold' ? 'bg-rose-300' : 'bg-gray-400'}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.endorsed}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  {product.sizes && (
                    <div className="flex gap-2 mb-4">
                      {product.sizes.map((size, j) => (
                        <Button key={j} variant="outline" size="sm" className="w-12">
                          {size}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">{product.price}</p>
                    <Link to="/register">
                      <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Gift className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl font-bold mb-6">Perfect Gift Collections</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Curated gift sets for the culinary enthusiast in your life. 
              Beautiful packaging and premium quality guaranteed.
            </p>
            <Link to="/shop">
              <Button size="lg">
                Browse Gift Sets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;