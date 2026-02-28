import { useState } from 'react';
import {
  Search, MapPin, Clock, Star, ChefHat, ShoppingBag,
  Plus, Minus, X, Heart, Leaf, ChevronRight, Timer, Utensils, Bike
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Kitchen {
  id: string;
  kitchen_name: string;
  description: string;
  cuisine_types: string[];
  cover_image_url: string;
  logo_url: string;
  average_rating: number;
  total_reviews: number;
  delivery_fee: number;
  estimated_prep_time_mins: number;
  delivery_radius_miles: number;
  minimum_order_amount: number;
  is_open: boolean;
  distance_miles?: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  dietary_tags: string[];
  calories?: number;
  is_bestseller: boolean;
  is_featured: boolean;
  preparation_time_mins: number;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const MOCK_KITCHENS: Kitchen[] = [
  {
    id: '1',
    kitchen_name: "Chef Marcus's Kitchen",
    description: 'Authentic Caribbean cuisine with a modern twist',
    cuisine_types: ['Caribbean', 'Jamaican', 'Soul Food'],
    cover_image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    logo_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200',
    average_rating: 4.8,
    total_reviews: 234,
    delivery_fee: 3.99,
    estimated_prep_time_mins: 25,
    delivery_radius_miles: 5,
    minimum_order_amount: 15,
    is_open: true,
    distance_miles: 1.2,
  },
  {
    id: '2',
    kitchen_name: "Sofia's Italian Table",
    description: 'Handmade pasta and traditional Italian recipes',
    cuisine_types: ['Italian', 'Mediterranean', 'Pasta'],
    cover_image_url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800',
    logo_url: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=200',
    average_rating: 4.9,
    total_reviews: 567,
    delivery_fee: 2.99,
    estimated_prep_time_mins: 30,
    delivery_radius_miles: 4,
    minimum_order_amount: 20,
    is_open: true,
    distance_miles: 0.8,
  },
  {
    id: '3',
    kitchen_name: 'Spice Route Kitchen',
    description: 'Authentic Indian & South Asian flavors',
    cuisine_types: ['Indian', 'Pakistani', 'Asian'],
    cover_image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    logo_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200',
    average_rating: 4.7,
    total_reviews: 189,
    delivery_fee: 3.49,
    estimated_prep_time_mins: 35,
    delivery_radius_miles: 6,
    minimum_order_amount: 18,
    is_open: true,
    distance_miles: 2.1,
  },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Jerk Chicken Plate',
    description: 'Authentic jerk chicken with rice & peas, plantain, and coleslaw',
    price: 14.99,
    image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    dietary_tags: ['gluten-free'],
    calories: 680,
    is_bestseller: true,
    is_featured: true,
    preparation_time_mins: 20,
  },
  {
    id: '2',
    name: 'Oxtail Stew',
    description: 'Slow-cooked oxtail in rich gravy with butter beans',
    price: 18.99,
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    dietary_tags: ['gluten-free'],
    calories: 820,
    is_bestseller: true,
    is_featured: false,
    preparation_time_mins: 25,
  },
  {
    id: '3',
    name: 'Ackee & Saltfish',
    description: "Jamaica's national dish with fried dumplings",
    price: 15.99,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    dietary_tags: [],
    calories: 590,
    is_bestseller: false,
    is_featured: true,
    preparation_time_mins: 18,
  },
  {
    id: '4',
    name: 'Vegan Curry Bowl',
    description: 'Chickpea and vegetable curry with coconut rice',
    price: 12.99,
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    dietary_tags: ['vegan', 'vegetarian', 'gluten-free'],
    calories: 520,
    is_bestseller: false,
    is_featured: false,
    preparation_time_mins: 15,
  },
];

function KitchenCard({ kitchen, onClick }: { kitchen: Kitchen; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
      <div className="relative h-40 overflow-hidden">
        <img src={kitchen.cover_image_url} alt={kitchen.kitchen_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute -bottom-6 left-4">
          <img src={kitchen.logo_url} alt="" className="w-14 h-14 rounded-xl border-4 border-white object-cover shadow-md" />
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {kitchen.estimated_prep_time_mins}-{kitchen.estimated_prep_time_mins + 15} min
        </div>
      </div>
      <div className="p-4 pt-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{kitchen.kitchen_name}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{kitchen.cuisine_types.join(' \u2022 ')}</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100"><Heart className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-semibold">{kitchen.average_rating}</span>
            <span className="text-gray-400">({kitchen.total_reviews})</span>
          </div>
          <span className="text-gray-300">&bull;</span>
          <div className="flex items-center gap-1 text-gray-500"><MapPin className="w-4 h-4" />{kitchen.distance_miles} mi</div>
          <span className="text-gray-300">&bull;</span>
          <span className="text-gray-500">{kitchen.delivery_fee === 0 ? 'Free delivery' : `\u00A3${kitchen.delivery_fee.toFixed(2)} delivery`}</span>
        </div>
        {!kitchen.is_open && <div className="mt-3 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg inline-block">Opens tomorrow at 11:00</div>}
      </div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 hover:shadow-md transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.is_bestseller && <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">Bestseller</span>}
        </div>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-3 mt-2">
          {item.dietary_tags.map((tag) => (
            <span key={tag} className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Leaf className="w-3 h-3" />{tag}</span>
          ))}
          {item.calories && <span className="text-xs text-gray-400">{item.calories} cal</span>}
        </div>
        <p className="font-bold text-gray-900 mt-3">{'\u00A3'}{item.price.toFixed(2)}</p>
      </div>
      <div className="relative">
        <img src={item.image_url} alt={item.name} className="w-28 h-28 rounded-xl object-cover" />
        <button onClick={() => onAdd(item)} className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function CartSidebar({ cart, kitchen, onUpdateQuantity, onCheckout, onClose }: { cart: CartItem[]; kitchen: Kitchen | null; onUpdateQuantity: (index: number, delta: number) => void; onCheckout: () => void; onClose: () => void }) {
  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = kitchen?.delivery_fee || 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl">Your Order</h2>
          {kitchen && <p className="text-sm text-gray-500">{kitchen.kitchen_name}</p>}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((cartItem, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <img src={cartItem.item.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{cartItem.item.name}</h4>
                  <p className="text-orange-600 font-semibold">{'\u00A3'}{(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full border">
                  <button onClick={() => onUpdateQuantity(index, -1)} className="p-2 hover:bg-gray-100 rounded-full"><Minus className="w-4 h-4" /></button>
                  <span className="font-medium w-6 text-center">{cartItem.quantity}</span>
                  <button onClick={() => onUpdateQuantity(index, 1)} className="p-2 hover:bg-gray-100 rounded-full"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{'\u00A3'}{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span>{'\u00A3'}{deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Service fee</span><span>{'\u00A3'}{serviceFee.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{'\u00A3'}{total.toFixed(2)}</span></div>
          <button onClick={onCheckout} className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
            Checkout &bull; {'\u00A3'}{total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChefMiiEatsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const cuisines = ['All', 'Caribbean', 'Italian', 'Indian', 'Asian', 'Mexican', 'Vegan'];

  const addToCart = (item: MenuItem) => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">ChefMii Eats</h1>
                <p className="text-xs text-gray-500">Order from local chefs</p>
              </div>
            </div>
            <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <MapPin className="w-4 h-4 text-orange-500" /><span className="font-medium">London, E1</span><ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search kitchens, dishes, cuisines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{cartItemCount}</span>}
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4">
            {cuisines.map((cuisine) => (
              <button key={cuisine} onClick={() => setSelectedCuisine(cuisine === 'All' ? null : cuisine)} className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${(cuisine === 'All' && !selectedCuisine) || selectedCuisine === cuisine ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedKitchen ? (
          <div>
            <button onClick={() => setSelectedKitchen(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
              <ChevronRight className="w-5 h-5 rotate-180" />Back to all kitchens
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
              <div className="h-48 relative">
                <img src={selectedKitchen.cover_image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute -bottom-10 left-6">
                  <img src={selectedKitchen.logo_url} alt="" className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
                </div>
              </div>
              <div className="p-6 pt-14">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedKitchen.kitchen_name}</h1>
                    <p className="text-gray-500 mt-1">{selectedKitchen.description}</p>
                  </div>
                  <button className="p-3 rounded-full border hover:bg-gray-50"><Heart className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 text-yellow-400 fill-current" /><span className="font-bold">{selectedKitchen.average_rating}</span><span className="text-gray-400">({selectedKitchen.total_reviews} reviews)</span></div>
                  <div className="flex items-center gap-1 text-gray-500"><Timer className="w-5 h-5" />{selectedKitchen.estimated_prep_time_mins}-{selectedKitchen.estimated_prep_time_mins + 15} min</div>
                  <div className="flex items-center gap-1 text-gray-500"><Bike className="w-5 h-5" />{'\u00A3'}{selectedKitchen.delivery_fee.toFixed(2)} delivery</div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
              <div className="grid gap-4">
                {MOCK_MENU_ITEMS.map((item) => <MenuItemCard key={item.id} item={item} onAdd={addToCart} />)}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Featured Chefs</h2>
                <button className="text-orange-500 font-medium hover:text-orange-600">See all &rarr;</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_KITCHENS.map((kitchen) => <KitchenCard key={kitchen.id} kitchen={kitchen} onClick={() => setSelectedKitchen(kitchen)} />)}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Kitchens Near You</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_KITCHENS.map((kitchen) => <KitchenCard key={kitchen.id} kitchen={kitchen} onClick={() => setSelectedKitchen(kitchen)} />)}
              </div>
            </section>
          </div>
        )}
      </main>

      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartOpen(false)} />
          <CartSidebar cart={cart} kitchen={selectedKitchen} onUpdateQuantity={updateCartQuantity} onCheckout={() => alert('Checkout coming soon!')} onClose={() => setIsCartOpen(false)} />
        </>
      )}

      {cartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-4 md:hidden">
          <button onClick={() => setIsCartOpen(true)} className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-between px-6">
            <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" />View Cart ({cartItemCount})</span>
            <span>{'\u00A3'}{cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0).toFixed(2)}</span>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
