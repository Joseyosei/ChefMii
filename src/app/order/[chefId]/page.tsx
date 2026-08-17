'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
    ArrowLeft,
    Heart,
    Share2,
    Search,
    ShoppingBag,
    Plus,
    Minus,
    Star,
    Clock,
    ShieldCheck,
    Navigation,
    CheckCircle2
} from 'lucide-react'

export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    image: string
    badge?: string
    likes?: number
    reviews?: number
}

export interface MenuSection {
    id: string
    category: string
    items: MenuItem[]
}

export interface ChefDetail {
    name: string
    chefPhoto: string
    cuisine: string
    rating: number
    reviews: number
    distance: string
    time: string
    image: string
    tagline: string
    badge: string
    deliveryFee: string
    menu: MenuSection[]
}

const DEFAULT_CHEF_DATA: Record<string, ChefDetail> = {
    'marco-rossi': {
        name: 'Trattoria di Marco',
        chefPhoto: '/images/chefs/chef_marco_rossi.png',
        cuisine: 'Italian Fine Dining',
        rating: 4.9,
        reviews: 342,
        distance: '0.8 mi',
        time: '20-30 mins',
        image: '/images/orders/order_italian_pasta.png',
        tagline: 'Handmade pasta crafted daily with shaved Umbrian truffles',
        badge: '🔥 #1 Most Ordered in Mayfair',
        deliveryFee: 'Free delivery',
        menu: [
            {
                id: '1',
                category: 'Signature Pasta & Risotto',
                items: [
                    {
                        id: 'item-1',
                        name: 'Handmade Black Truffle Tagliatelle',
                        description: 'Fresh egg pasta tossed in 24-month Parmigiano-Reggiano and generous shavings of black truffle.',
                        price: 18.50,
                        image: '/images/orders/order_italian_pasta.png',
                        badge: 'Chef Choice',
                        likes: 124,
                    },
                    {
                        id: 'item-2',
                        name: 'Carnaroli Truffle Risotto',
                        description: 'Slow-simmered Carnaroli rice with wild porcini mushrooms, black truffle butter, and aged cheese.',
                        price: 22.00,
                        image: '/images/orders/order_italian_pasta.png',
                        badge: 'Popular',
                        likes: 98,
                    },
                    {
                        id: 'item-3',
                        name: 'Wild Boar Pappardelle Ragù',
                        description: 'Wide Tuscan ribbon pasta with 12-hour braised wild boar ragù and juniper berries.',
                        price: 20.00,
                        image: '/images/orders/order_italian_pasta.png',
                        likes: 76,
                    },
                ],
            },
            {
                id: '2',
                category: 'Artisanal Mains & Dolci',
                items: [
                    {
                        id: 'item-4',
                        name: 'Wood-Fired Branzino al Forno',
                        description: 'Whole Mediterranean sea bass baked with Amalfi lemons, caperberries, and fresh rosemary.',
                        price: 28.00,
                        image: '/images/orders/order_french_haute.png',
                        likes: 82,
                    },
                    {
                        id: 'item-5',
                        name: 'Classic Venetian Tiramisù',
                        description: 'Savoiardi ladyfingers soaked in espresso & Marsala, layered with whipped mascarpone cream.',
                        price: 9.50,
                        image: '/images/marketplace/marketplace_chocolate.png',
                        badge: 'Serves 2',
                        likes: 145,
                    },
                ],
            },
        ],
    },
    'yuki-tanaka': {
        name: 'Tanaka Omakase Express',
        chefPhoto: '/images/chefs/chef_yuki_tanaka.png',
        cuisine: 'Japanese Omakase',
        rating: 5.0,
        reviews: 298,
        distance: '1.2 mi',
        time: '25-35 mins',
        image: '/images/orders/order_japanese_sushi.png',
        tagline: 'Premium Edomae sushi imported fresh from Tokyo Toyosu Market',
        badge: '⭐ Michelin Trained Master',
        deliveryFee: '£1.99',
        menu: [
            {
                id: '1',
                category: 'Omakase Tasting Sets',
                items: [
                    {
                        id: 'item-y1',
                        name: '10-Piece Grand Omakase Box',
                        description: 'Otoro fatty tuna, Hokkaido uni, botan ebi, A5 wagyu nigiri, and truffle soy glaze.',
                        price: 45.00,
                        image: '/images/orders/order_japanese_sushi.png',
                        badge: 'Signature',
                        likes: 210,
                    },
                    {
                        id: 'item-y2',
                        name: 'Torched Wagyu A5 Nigiri (4pcs)',
                        description: 'Kagoshima A5 wagyu beef gently torched with sea salt, caviar, and fresh wasabi.',
                        price: 28.00,
                        image: '/images/orders/order_japanese_sushi.png',
                        badge: 'Top Pick',
                        likes: 184,
                    },
                ],
            },
        ],
    },
}

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

export default function ChefMenuPage() {
    const params = useParams()
    const router = useRouter()
    const rawChefId = typeof params.chefId === 'string' ? params.chefId : 'marco-rossi'
    const chef = DEFAULT_CHEF_DATA[rawChefId] || DEFAULT_CHEF_DATA['marco-rossi']

    const [cart, setCart] = useState<CartItem[]>([
        {
            id: 'item-1',
            name: 'Handmade Black Truffle Tagliatelle',
            price: 18.50,
            quantity: 2,
            image: '/images/orders/order_italian_pasta.png',
        },
        {
            id: 'item-2',
            name: 'Carnaroli Truffle Risotto',
            price: 22.00,
            quantity: 1,
            image: '/images/orders/order_italian_pasta.png',
        }
    ])

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id)
            if (existing) {
                return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
            }
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }]
        })
    }

    const updateQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((i) => {
                    if (i.id === id) {
                        const newQty = i.quantity + delta
                        return newQty > 0 ? { ...i, quantity: newQty } : null
                    }
                    return i
                })
                .filter(Boolean) as CartItem[]
        )
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const handlePlaceOrder = () => {
        router.push(`/order/tracking/${rawChefId}`)
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-32">
                {/* Hero Dish Banner with Chef Avatar */}
                <div className="relative h-64 sm:h-80 w-full bg-stone-900 overflow-hidden">
                    <Image
                        src={chef.image}
                        alt={chef.name}
                        fill
                        unoptimized
                        className="object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between">
                        <Link
                            href="/order"
                            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex gap-2">
                            <button className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto text-white flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="px-3 py-1 bg-terracotta text-white rounded-full text-xs font-bold shadow-md">
                                {chef.badge}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold pt-2">{chef.name}</h1>
                            <p className="text-white/80 text-xs sm:text-sm">{chef.tagline}</p>
                        </div>
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl shrink-0 hidden sm:block">
                            <Image
                                src={chef.chefPhoto}
                                alt={chef.name}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content & Menu */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Menu Sections (8 Cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {chef.menu.map((sec) => (
                            <section key={sec.id} className="space-y-4">
                                <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                                    {sec.category}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {sec.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white dark:bg-stone-900 border border-border/80 rounded-2xl p-4 flex gap-4 hover:border-terracotta/50 transition-all shadow-xs"
                                        >
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
                                                        {item.badge && (
                                                            <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[10px] font-bold">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="pt-3 flex items-center justify-between">
                                                    <span className="font-bold text-sm text-foreground">
                                                        £{item.price.toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-terracotta hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Cart & Live Checkout Drawer (4 Cols) */}
                    <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 shadow-md space-y-6 sticky top-24">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-terracotta" />
                                Your Gourmet Cart
                            </h3>
                            <span className="text-xs text-muted-foreground font-bold">{cart.length} items</span>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-6">Your cart is empty. Add a dish to get started!</p>
                        ) : (
                            <div className="space-y-3 divide-y divide-border/40">
                                {cart.map((item) => (
                                    <div key={item.id} className="pt-3 flex items-center justify-between text-xs">
                                        <div className="flex-1 pr-2">
                                            <p className="font-bold text-foreground truncate">{item.name}</p>
                                            <p className="text-muted-foreground">£{item.price.toFixed(2)} each</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="w-6 h-6 rounded bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2 pt-4 border-t border-border text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-bold text-foreground">£{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-600 font-bold">FREE</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                                <span>Total</span>
                                <span className="text-terracotta text-base">£{subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0}
                            className="w-full py-3.5 gradient-brand text-white font-bold text-sm rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            <Navigation className="w-4 h-4" />
                            Place Order & Track Live on Map →
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
