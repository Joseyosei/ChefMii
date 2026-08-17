'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
    MapPin,
    Search,
    Clock,
    DollarSign,
    Star,
    Zap,
    CheckCircle2,
    Leaf,
    SlidersHorizontal,
    ShoppingBag,
    ArrowRight,
    Bike,
    Sparkles,
    ShieldCheck,
    Navigation
} from 'lucide-react'

interface ChefKitchen {
    id: string
    chefId: string
    name: string
    chefName: string
    chefPhoto: string
    cuisine: string
    rating: number
    reviews: number
    distance: string
    time: string
    fee: string
    priceTier: string
    dishImage: string
    popularDish: string
    badge?: string
    isPromoted?: boolean
}

const CUISINES = [
    { emoji: '🍝', label: 'Italian', id: 'italian' },
    { emoji: '🍣', label: 'Japanese', id: 'japanese' },
    { emoji: '🥐', label: 'French', id: 'french' },
    { emoji: '🥩', label: 'American BBQ', id: 'american' },
    { emoji: '🥟', label: 'Chinese Dim Sum', id: 'chinese' },
    { emoji: '🥘', label: 'Korean BBQ', id: 'korean' },
    { emoji: '🍛', label: 'African Feast', id: 'african' },
    { emoji: '🥗', label: 'Nordic & Clean', id: 'nordic' },
    { emoji: '🌾', label: 'Farm Fresh', id: 'farm' },
]

const PROMO_BANNERS = [
    {
        title: 'Michelin-Grade Dinners Delivered',
        subtitle: 'Prepared hot by verified private chefs in your area',
        cta: 'Order Now',
        code: 'CHEFMII20',
        badge: '£10 OFF First Order',
        bg: 'from-amber-700/90 to-terracotta/90',
        image: '/images/orders/order_italian_pasta.png',
    },
    {
        title: 'Fresh Omakase & Sushi Boxes',
        subtitle: 'Direct from master sushi chefs within 30 minutes',
        cta: 'Explore Japanese',
        code: 'OMAKASE15',
        badge: 'Top Rated',
        bg: 'from-stone-900/95 to-slate-800/90',
        image: '/images/orders/order_japanese_sushi.png',
    },
]

const CHEF_KITCHENS: ChefKitchen[] = [
    {
        id: 'kitchen-marco',
        chefId: 'marco-rossi',
        name: 'Trattoria di Marco',
        chefName: 'Chef Marco Rossi',
        chefPhoto: '/images/chefs/chef_marco_rossi.png',
        cuisine: 'Italian Fine Dining',
        rating: 4.9,
        reviews: 342,
        distance: '0.8 mi',
        time: '20-30 min',
        fee: 'Free delivery',
        priceTier: '££',
        dishImage: '/images/orders/order_italian_pasta.png',
        popularDish: 'Handmade Black Truffle Tagliatelle',
        badge: '🔥 #1 Most Ordered',
        isPromoted: true,
    },
    {
        id: 'kitchen-yuki',
        chefId: 'yuki-tanaka',
        name: 'Tanaka Omakase Express',
        chefName: 'Chef Yuki Tanaka',
        chefPhoto: '/images/chefs/chef_yuki_tanaka.png',
        cuisine: 'Japanese Omakase',
        rating: 5.0,
        reviews: 298,
        distance: '1.2 mi',
        time: '25-35 min',
        fee: '£1.99',
        priceTier: '£££',
        dishImage: '/images/orders/order_japanese_sushi.png',
        popularDish: 'Otoro Nigiri & Uni Tasting Box',
        badge: '⭐ Michelin Trained',
        isPromoted: true,
    },
    {
        id: 'kitchen-pierre',
        chefId: 'pierre-dubois',
        name: 'Le Bistro Dubois',
        chefName: 'Chef Pierre Dubois',
        chefPhoto: '/images/chefs/chef_pierre_dubois.png',
        cuisine: 'French Haute Cuisine',
        rating: 4.8,
        reviews: 215,
        distance: '1.5 mi',
        time: '30-40 min',
        fee: '£2.49',
        priceTier: '£££',
        dishImage: '/images/orders/order_french_haute.png',
        popularDish: 'Pan-Seared Duck Breast with Spiced Figs',
        badge: '🍷 Wine Pairing Ready',
    },
    {
        id: 'kitchen-marcus',
        chefId: 'marcus-vance',
        name: 'Vance Smokehouse & Grill',
        chefName: 'Chef Marcus Vance',
        chefPhoto: '/images/chefs/chef_marcus_vance.png',
        cuisine: 'American Contemporary',
        rating: 4.9,
        reviews: 184,
        distance: '1.1 mi',
        time: '25-35 min',
        fee: 'Free delivery',
        priceTier: '££',
        dishImage: '/images/orders/order_italian_pasta.png',
        popularDish: 'Hudson Valley Prime Ribeye & Smoked Mash',
        badge: '🪵 Wood-Fired',
    },
    {
        id: 'kitchen-wei',
        chefId: 'wei-zhang',
        name: 'Imperial Dim Sum House',
        chefName: 'Chef Wei Zhang',
        chefPhoto: '/images/chefs/chef_wei_zhang.png',
        cuisine: 'Cantonese & Dim Sum',
        rating: 5.0,
        reviews: 267,
        distance: '0.9 mi',
        time: '20-30 min',
        fee: 'Free delivery',
        priceTier: '££',
        dishImage: '/images/orders/order_japanese_sushi.png',
        popularDish: 'Artisanal Xiao Long Bao & Truffle Siu Mai',
        badge: '🥟 Handmade Daily',
    },
    {
        id: 'kitchen-aisha',
        chefId: 'aisha-okafor',
        name: 'Okafor Spice Kitchen',
        chefName: 'Chef Aisha Okafor',
        chefPhoto: '/images/chefs/chef_aisha_okafor.png',
        cuisine: 'West African Gourmet',
        rating: 4.9,
        reviews: 310,
        distance: '1.4 mi',
        time: '25-35 min',
        fee: 'Free delivery',
        priceTier: '£',
        dishImage: '/images/orders/order_italian_pasta.png',
        popularDish: 'Smoky Firewood Jollof Rice with Jumbo Prawns',
        badge: '🌶️ Signature Blend',
    },
    {
        id: 'kitchen-henrik',
        chefId: 'henrik-lindqvist',
        name: 'Nordic Fjord Gastronomy',
        chefName: 'Chef Henrik Lindqvist',
        chefPhoto: '/images/chefs/chef_henrik_lindqvist.png',
        cuisine: 'New Nordic',
        rating: 4.9,
        reviews: 142,
        distance: '1.7 mi',
        time: '30-45 min',
        fee: '£2.99',
        priceTier: '£££',
        dishImage: '/images/orders/order_french_haute.png',
        popularDish: 'Cold-Smoked Arctic Salmon & Pickled Chanterelles',
        badge: '🌿 Wild Foraged',
    },
    {
        id: 'kitchen-minjun',
        chefId: 'min-jun-park',
        name: 'Hansik Modern Kitchen',
        chefName: 'Chef Min-Jun Park',
        chefPhoto: '/images/chefs/chef_min_jun_park.png',
        cuisine: 'Modern Korean',
        rating: 4.9,
        reviews: 195,
        distance: '1.3 mi',
        time: '25-35 min',
        fee: 'Free delivery',
        priceTier: '££',
        dishImage: '/images/orders/order_japanese_sushi.png',
        popularDish: 'Galbi Short Ribs with 10-Yr Aged Doenjang',
        badge: '🔥 Korean BBQ',
    },
]

const FARM_PRODUCE = [
    {
        id: 'farm-1',
        name: 'Green Valley Organic Estate',
        location: 'Hertfordshire, UK',
        specialty: 'Heritage Vegetables & Microgreens',
        deliveryTime: 'Tomorrow Morning',
        badge: '100% Organic',
        image: '/images/marketplace/marketplace_olive_oil.png',
    },
    {
        id: 'farm-2',
        name: 'Kent Artisanal Orchards',
        location: 'Kent, UK',
        specialty: 'Seasonal Truffles & Wild Mushrooms',
        deliveryTime: 'Same Day Delivery',
        badge: 'Locally Foraged',
        image: '/images/marketplace/marketplace_truffle_oil.png',
    },
    {
        id: 'farm-3',
        name: 'Highland Pure Dairy Co.',
        location: 'Surrey, UK',
        specialty: 'Grass-Fed Cheeses & Farm Butter',
        deliveryTime: 'Tomorrow Morning',
        badge: 'Pasture Raised',
        image: '/images/marketplace/marketplace_black_garlic.png',
    },
]

export default function OrderPage() {
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery')
    const [locationInput, setLocationInput] = useState('London, Mayfair W1K')
    const [activeFilter, setActiveFilter] = useState<string>('all')

    const filteredKitchens = CHEF_KITCHENS.filter((k) => {
        const matchesCuisine =
            !selectedCuisine ||
            k.cuisine.toLowerCase().includes(selectedCuisine) ||
            (selectedCuisine === 'farm' && k.badge?.includes('Organic'))
        const matchesSearch =
            !searchQuery ||
            k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.chefName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.popularDish.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'free' && k.fee.toLowerCase().includes('free')) ||
            (activeFilter === 'fast' && parseInt(k.time) <= 25) ||
            (activeFilter === 'top' && k.rating >= 4.9)
        return matchesCuisine && matchesSearch && matchesFilter
    })

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-20 pt-24 sm:pt-28">
                {/* Active Live Order Floating Banner */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
                    <div className="bg-stone-900 text-white px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between border border-stone-800 shadow-md">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live Order #CF892 is on its way with driver Ahmed (ETA 12 mins)</span>
                        </div>
                        <Link
                            href="/order/tracking/11111111-1111-1111-1111-111111111111"
                            className="inline-flex items-center gap-1 text-terracotta hover:text-terracotta/80 font-bold ml-2 underline underline-offset-2"
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            Live GPS Map Tracking →
                        </Link>
                    </div>
                </div>

                {/* Uber-Style Top Navigation & Address Bar */}
                <section className="bg-white dark:bg-stone-900 border-b border-border shadow-xs sticky top-20 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Delivery / Pickup Pill Toggle */}
                        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-full border border-border shrink-0">
                            <button
                                onClick={() => setDeliveryMode('delivery')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    deliveryMode === 'delivery'
                                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Bike className="w-4 h-4" />
                                Delivery
                            </button>
                            <button
                                onClick={() => setDeliveryMode('pickup')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    deliveryMode === 'pickup'
                                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Pickup
                            </button>
                        </div>

                        {/* Address & ETA Selector */}
                        <div className="flex-1 w-full max-w-lg flex items-center bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-3.5 py-2 border border-border">
                            <MapPin className="w-4 h-4 text-terracotta shrink-0 mr-2" />
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs sm:text-sm text-foreground font-medium flex-1 truncate"
                                placeholder="Enter your delivery address..."
                            />
                            <span className="hidden sm:inline-block px-2 py-0.5 bg-terracotta/10 text-terracotta rounded-md text-[11px] font-bold shrink-0 ml-2">
                                20-30 min
                            </span>
                        </div>

                        {/* Search bar */}
                        <div className="w-full md:w-72 flex items-center bg-stone-100 dark:bg-stone-800/80 rounded-2xl px-3.5 py-2 border border-border">
                            <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes, chefs..."
                                className="bg-transparent border-none outline-none text-xs sm:text-sm text-foreground flex-1"
                            />
                        </div>
                    </div>

                    {/* Uber-Style Category Ribbon */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-border/40">
                        <button
                            onClick={() => setSelectedCuisine(null)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                                selectedCuisine === null
                                    ? 'bg-terracotta text-white border-terracotta'
                                    : 'bg-white dark:bg-stone-800 border-border text-foreground hover:border-terracotta/50'
                            }`}
                        >
                            All Cuisines
                        </button>
                        {CUISINES.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedCuisine(selectedCuisine === item.id ? null : item.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${
                                    selectedCuisine === item.id
                                        ? 'bg-terracotta text-white border-terracotta'
                                        : 'bg-white dark:bg-stone-800 border-border text-foreground hover:border-terracotta/50'
                                }`}
                            >
                                <span>{item.emoji}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
                    {/* Uber Promo Hero Carousel */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PROMO_BANNERS.map((promo, idx) => (
                            <div
                                key={idx}
                                className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${promo.bg} text-white p-6 sm:p-8 flex items-center justify-between min-h-[190px] shadow-lg`}
                            >
                                <div className="relative z-10 max-w-[65%] space-y-2">
                                    <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wide">
                                        {promo.badge}
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight">
                                        {promo.title}
                                    </h2>
                                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2">
                                        {promo.subtitle}
                                    </p>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setSelectedCuisine(idx === 0 ? 'italian' : 'japanese')}
                                            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-white/90 shadow-sm transition-all"
                                        >
                                            {promo.cta} →
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full overflow-hidden opacity-90 border-4 border-white/20 translate-x-6 translate-y-4">
                                    <Image
                                        src={promo.image}
                                        alt={promo.title}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Quick Filters */}
                    <section className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1">
                                Filter:
                            </span>
                            {[
                                { id: 'all', label: 'All Places' },
                                { id: 'free', label: 'Free Delivery' },
                                { id: 'fast', label: '⚡ Under 25 mins' },
                                { id: 'top', label: '⭐ Top Rated (4.9+)' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                                        activeFilter === f.id
                                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                            : 'bg-white dark:bg-stone-800 border-border text-foreground hover:bg-stone-100'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                            {filteredKitchens.length} chef kitchens available
                        </span>
                    </section>

                    {/* Featured Chef Kitchens (Uber Eats Cards) */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    Featured Private Chef Kitchens
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Fresh gourmet dishes cooked on-demand by world-class culinary artists
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredKitchens.map((kitchen) => (
                                <Link
                                    key={kitchen.id}
                                    href={`/order/${kitchen.chefId}`}
                                    className="group flex flex-col bg-white dark:bg-stone-900 border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-terracotta/60 transition-all duration-300"
                                >
                                    {/* Dish Hero Image with Chef Floating Avatar */}
                                    <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                                        <Image
                                            src={kitchen.dishImage}
                                            alt={kitchen.name}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                        {/* Floating Badge */}
                                        {kitchen.badge && (
                                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                                                {kitchen.badge}
                                            </div>
                                        )}

                                        {/* Delivery Time & Fee Pills */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                                            <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                                {kitchen.time}
                                            </span>
                                            <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                                {kitchen.fee}
                                            </span>
                                        </div>

                                        {/* Floating Chef Portrait */}
                                        <div className="absolute -bottom-3 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-stone-900 shadow-md">
                                            <Image
                                                src={kitchen.chefPhoto}
                                                alt={kitchen.chefName}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <h3 className="font-bold text-base text-foreground group-hover:text-terracotta transition-colors truncate">
                                                    {kitchen.name}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md text-xs font-bold shrink-0">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    {kitchen.rating}
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground font-medium mb-1">
                                                {kitchen.chefName} • {kitchen.cuisine}
                                            </p>
                                            <p className="text-xs text-foreground/80 font-medium line-clamp-1 italic">
                                                &quot;{kitchen.popularDish}&quot;
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
                                            <span>{kitchen.distance} away</span>
                                            <span className="text-terracotta font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                                View Menu →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Fresh From Farmers Marketplace Section */}
                    <section className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-2">
                                    🌱 Farm-to-Table Marketplace
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                                    Order Fresh Organic Ingredients
                                </h2>
                                <p className="text-emerald-200/80 text-xs sm:text-sm">
                                    Direct harvest from certified local farmers and regenerative growers
                                </p>
                            </div>
                            <Link
                                href="/order/farmers"
                                className="px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-full hover:bg-emerald-50 transition-all shrink-0"
                            >
                                Explore All Farms →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {FARM_PRODUCE.map((farm) => (
                                <div
                                    key={farm.id}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 hover:bg-white/15 transition-all"
                                >
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/20 border border-white/20">
                                        <Image
                                            src={farm.image}
                                            alt={farm.name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                                            {farm.badge}
                                        </span>
                                        <h4 className="text-sm font-bold text-white truncate">{farm.name}</h4>
                                        <p className="text-xs text-emerald-100/70 truncate">{farm.specialty}</p>
                                        <span className="text-[11px] font-medium text-emerald-300">
                                            ⚡ {farm.deliveryTime}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
