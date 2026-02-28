import { useState } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Clock,
  ChefHat, Utensils, Leaf, AlertTriangle, Save, X, Upload,
  ShoppingBag, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  dietary_tags: string[];
  allergens: string[];
  preparation_time_mins: number;
  calories?: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  stock_quantity?: number;
  order_count: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  item_count: number;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Main Courses', description: 'Hearty dishes', item_count: 8 },
  { id: '2', name: 'Starters', description: 'Light bites', item_count: 5 },
  { id: '3', name: 'Desserts', description: 'Sweet treats', item_count: 4 },
  { id: '4', name: 'Drinks', description: 'Beverages', item_count: 6 },
];

const MOCK_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Jerk Chicken Plate',
    description: 'Authentic jerk chicken with rice & peas, plantain, and coleslaw',
    price: 14.99,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    dietary_tags: ['gluten-free'],
    allergens: [],
    preparation_time_mins: 20,
    calories: 680,
    is_available: true,
    is_featured: true,
    is_bestseller: true,
    order_count: 234,
  },
  {
    id: '2',
    name: 'Oxtail Stew',
    description: 'Slow-cooked oxtail in rich gravy with butter beans',
    price: 18.99,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    dietary_tags: ['gluten-free'],
    allergens: [],
    preparation_time_mins: 25,
    calories: 820,
    is_available: true,
    is_featured: false,
    is_bestseller: true,
    order_count: 189,
  },
  {
    id: '3',
    name: 'Vegan Curry Bowl',
    description: 'Chickpea and vegetable curry with coconut rice',
    price: 12.99,
    category_id: '1',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    dietary_tags: ['vegan', 'vegetarian', 'gluten-free'],
    allergens: [],
    preparation_time_mins: 15,
    calories: 520,
    is_available: false,
    is_featured: false,
    is_bestseller: false,
    order_count: 67,
  },
];

const DIETARY_OPTIONS = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'
];

const ALLERGEN_OPTIONS = [
  'nuts', 'peanuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'
];

function StatCard({ icon: Icon, label, value, change, positive }: { icon: any; label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '+' : ''}{change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

function MenuItemRow({ item, onEdit, onToggleAvailability, onDelete }: { item: MenuItem; onEdit: (item: MenuItem) => void; onToggleAvailability: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className={`bg-white rounded-xl p-4 border ${!item.is_available ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
      <div className="flex items-center gap-4">
        <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            {item.is_bestseller && <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">Bestseller</span>}
            {item.is_featured && <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">Featured</span>}
          </div>
          <p className="text-gray-500 text-sm mt-0.5 truncate">{item.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
            <span className="font-bold text-orange-600">{'\u00A3'}{item.price.toFixed(2)}</span>
            <span className="text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" />{item.preparation_time_mins} min</span>
            <span className="text-gray-500 flex items-center gap-1"><ShoppingBag className="w-4 h-4" />{item.order_count} orders</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleAvailability(item.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {item.is_available ? <><Eye className="w-4 h-4" />Available</> : <><EyeOff className="w-4 h-4" />Hidden</>}
          </button>
          <button onClick={() => onEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Edit className="w-5 h-5" /></button>
          <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, categories, onSave, onClose }: { item: MenuItem | null; categories: Category[]; onSave: (item: Partial<MenuItem>) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || { name: '', description: '', price: 0, category_id: categories[0]?.id || '', image_url: '', dietary_tags: [], allergens: [], preparation_time_mins: 20, calories: undefined, is_available: true, is_featured: false }
  );

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

  const toggleTag = (tag: string, field: 'dietary_tags' | 'allergens') => {
    const current = formData[field] || [];
    setFormData({ ...formData, [field]: current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag] });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{item ? 'Edit Menu Item' : 'Add New Dish'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dish Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer">
              {formData.image_url ? <img src={formData.image_url} alt="" className="w-32 h-32 mx-auto rounded-xl object-cover" /> : <><Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Click or drag to upload image</p><p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p></>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Jerk Chicken Plate" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe your dish..." />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ({'\u00A3'}) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" required step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (mins)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" min="5" value={formData.preparation_time_mins} onChange={(e) => setFormData({ ...formData, preparation_time_mins: parseInt(e.target.value) })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories (optional)</label>
              <input type="number" min="0" value={formData.calories || ''} onChange={(e) => setFormData({ ...formData, calories: e.target.value ? parseInt(e.target.value) : undefined })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., 550" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Options</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag, 'dietary_tags')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.dietary_tags?.includes(tag) ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'}`}>
                  <Leaf className="w-3.5 h-3.5 inline mr-1" />{tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contains Allergens</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((allergen) => (
                <button key={allergen} type="button" onClick={() => toggleTag(allergen, 'allergens')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.allergens?.includes(allergen) ? 'bg-red-100 text-red-700 border-2 border-red-500' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'}`}>
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />{allergen}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
              <span className="text-sm text-gray-700">Available for order</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
              <span className="text-sm text-gray-700">Feature on homepage</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />{item ? 'Save Changes' : 'Add Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChefFoodManagement() {
  const [items, setItems] = useState<MenuItem[]>(MOCK_ITEMS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredItems = selectedCategory ? items.filter((item) => item.category_id === selectedCategory) : items;

  const handleToggleAvailability = (id: string) => {
    setItems(items.map((item) => item.id === id ? { ...item, is_available: !item.is_available } : item));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleSave = (data: Partial<MenuItem>) => {
    if (editingItem) {
      setItems(items.map((item) => item.id === editingItem.id ? { ...item, ...data } : item));
    } else {
      setItems([...items, { ...data, id: Date.now().toString(), order_count: 0, is_bestseller: false } as MenuItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const totalOrders = items.reduce((sum, item) => sum + item.order_count, 0);
  const totalRevenue = items.reduce((sum, item) => sum + (item.price * item.order_count), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">My Kitchen</h1>
              <p className="text-sm text-gray-500">Manage your menu & orders</p>
            </div>
          </div>
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 flex items-center gap-2">
            <Plus className="w-5 h-5" />Add Dish
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders.toLocaleString()} change="12%" positive />
          <StatCard icon={DollarSign} label="Revenue" value={`\u00A3${totalRevenue.toLocaleString()}`} change="8%" positive />
          <StatCard icon={Utensils} label="Menu Items" value={items.length.toString()} />
          <StatCard icon={Star} label="Avg Rating" value="4.8" change="0.2" positive />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full whitespace-nowrap font-medium ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full whitespace-nowrap font-medium ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
              {cat.name} ({items.filter((i) => i.category_id === cat.id).length})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <MenuItemRow key={item.id} item={item} onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }} onToggleAvailability={handleToggleAvailability} onDelete={handleDelete} />
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No items in this category</p>
              <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="text-orange-500 font-medium hover:text-orange-600">+ Add your first dish</button>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && <ItemModal item={editingItem} categories={categories} onSave={handleSave} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} />}
      <Footer />
    </div>
  );
}
