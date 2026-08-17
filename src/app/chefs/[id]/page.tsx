'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { Star, MapPin, Clock, Users, ChefHat, Heart, Share2, MessageCircle, ShoppingBag } from 'lucide-react'

// Mock chef data
interface ChefProfile {
    name: string
    cuisine: string
    rate: number
    rating: number
    reviews: number
    location: string
    badge: string
    bio: string
    photo: string
    description: string
    specialties: string[]
    availability: string
    minHours: number
    maxGuests: number
    portfolio: string[]
    reviews_list: Array<{ author: string; rating: number; text: string }>
}

const CHEFS_DATA: Record<string, ChefProfile> = {
    'marco-rossi': {
        name: 'Chef Marco Rossi',
        cuisine: 'Italian',
        rate: 150,
        rating: 4.9,
        reviews: 128,
        location: 'London, UK',
        badge: 'Fine Dining',
        bio: 'Award-winning Italian chef with 15 years experience in Michelin-starred restaurants.',
        photo: '/images/chefs/chef_marco_rossi.png',
        description: 'I specialize in authentic Italian cuisine with a modern twist. My menus are crafted using the finest ingredients, many imported directly from Italy. I have cooked for celebrities, politicians, and royalty.',
        specialties: ['Italian', 'Mediterranean', 'Fine Dining', 'Pasta', 'Risotto'],
        availability: 'Available weekends and select weekdays',
        minHours: 4,
        maxGuests: 50,
        portfolio: [
            '/images/orders/order_italian_pasta.png',
            '/images/orders/order_french_haute.png',
        ],
        reviews_list: [
            { author: 'Sarah M.', rating: 5, text: 'Absolutely incredible! Marco transformed our dinner party into an unforgettable experience.' },
            { author: 'James P.', rating: 5, text: 'Professional, creative, and delicious. Highly recommend!' },
            { author: 'Emma L.', rating: 4.8, text: 'Amazing food and great communication throughout the process.' },
        ]
    },
    'yuki-tanaka': {
        name: 'Chef Yuki Tanaka',
        cuisine: 'Japanese',
        rate: 200,
        rating: 5.0,
        reviews: 67,
        location: 'Dubai, UAE',
        badge: 'Omakase Master',
        bio: 'Japanese cuisine expert trained in Tokyo. Specialising in omakase and sushi.',
        photo: '/images/chefs/chef_yuki_tanaka.png',
        description: 'Trained at 3-Michelin-star restaurants in Tokyo, I bring authentic Japanese culinary traditions to your table. Specializing in omakase experiences and contemporary Japanese cuisine.',
        specialties: ['Japanese', 'Sushi', 'Omakase', 'Kaiseki', 'Tempura'],
        availability: 'Available year-round',
        minHours: 3,
        maxGuests: 30,
        portfolio: [
            '/images/orders/order_japanese_sushi.png',
        ],
        reviews_list: [
            { author: 'Michael T.', rating: 5, text: 'Best omakase experience outside of Tokyo!' },
            { author: 'Lisa W.', rating: 5, text: 'Yuki is a true artist. Every dish was perfection.' },
        ]
    },
    'pierre-dubois': {
        name: 'Chef Pierre Dubois',
        cuisine: 'French',
        rate: 180,
        rating: 4.7,
        reviews: 212,
        location: 'Paris, France',
        badge: 'Haute Cuisine',
        bio: 'Former executive chef at Hôtel de Crillon, Paris.',
        photo: '/images/chefs/chef_pierre_dubois.png',
        description: 'Classic French haute cuisine elevated with contemporary molecular gastronomy techniques and vintage wine pairings.',
        specialties: ['French Haute Cuisine', 'Wine Pairing', 'Duck Confit', 'Soufflé'],
        availability: 'Available by advance booking',
        minHours: 4,
        maxGuests: 40,
        portfolio: [
            '/images/orders/order_french_haute.png',
        ],
        reviews_list: [
            { author: 'Jean-Luc R.', rating: 5, text: 'Extraordinaire! The pan-seared duck was Michelin caliber.' },
        ]
    },
    'marcus-vance': {
        name: 'Chef Marcus Vance',
        cuisine: 'American Contemporary',
        rate: 160,
        rating: 4.9,
        reviews: 142,
        location: 'New York, USA',
        badge: 'Farm-to-Table',
        bio: 'James Beard nominee specializing in modern American farm-to-table tasting menus and wood-fired gastronomy.',
        photo: '/images/chefs/chef_marcus_vance.png',
        description: 'Pioneering artisanal smokehouse techniques with 18-hour hickory smoked brisket, heirloom vegetables, and farm-to-table tasting menus.',
        specialties: ['Wood-Fired BBQ', 'Prime Brisket', 'Farm-to-Table', 'Modern American'],
        availability: 'Available 5 days a week',
        minHours: 3,
        maxGuests: 60,
        portfolio: [
            '/images/orders/order_american_bbq.png',
        ],
        reviews_list: [
            { author: 'David K.', rating: 5, text: 'The brisket was pure perfection. Smoked to tender melt-in-the-mouth perfection.' },
        ]
    },
    'wei-zhang': {
        name: 'Chef Wei Zhang',
        cuisine: 'Chinese',
        rate: 175,
        rating: 5.0,
        reviews: 184,
        location: 'Shanghai, China',
        badge: 'Dim Sum & Wok Master',
        bio: '20 years mastering imperial Cantonese banquet dining, handmade dim sum, and precision wok artistry.',
        photo: '/images/chefs/chef_wei_zhang.png',
        description: 'Master of imperial dim sum folding, Cantonese broth extraction, and live wok hei banqueting.',
        specialties: ['Xiao Long Bao', 'Har Gow', 'Cantonese Banquet', 'Dim Sum'],
        availability: 'Available globally for summits',
        minHours: 4,
        maxGuests: 80,
        portfolio: [
            '/images/orders/order_chinese_dimsum.png',
        ],
        reviews_list: [
            { author: 'Lin W.', rating: 5, text: 'The most authentic Xiao Long Bao outside of Shanghai. Extraordinary technique.' },
        ]
    },
    'aisha-okafor': {
        name: 'Chef Aisha Okafor',
        cuisine: 'West African',
        rate: 80,
        rating: 4.8,
        reviews: 94,
        location: 'Lagos, Nigeria',
        badge: 'Traditional',
        bio: 'Bringing authentic West African flavours and smoky firewood jollof to private dining.',
        photo: '/images/chefs/chef_aisha_okafor.png',
        description: 'Authentic Nigerian and West African cuisine prepared with traditional firewood smoke infusions and fresh Atlantic seafood.',
        specialties: ['Firewood Jollof', 'Jumbo Tiger Prawns', 'Egusi Soup', 'Sweet Plantains'],
        availability: 'Available for private banquets',
        minHours: 3,
        maxGuests: 100,
        portfolio: [
            '/images/orders/order_west_african_jollof.png',
        ],
        reviews_list: [
            { author: 'Tunde B.', rating: 5, text: 'The smoky firewood jollof is the real deal! Everyone at the party was raving.' },
        ]
    },
    'henrik-lindqvist': {
        name: 'Chef Henrik Lindqvist',
        cuisine: 'Nordic',
        rate: 190,
        rating: 4.9,
        reviews: 87,
        location: 'Oslo, Norway',
        badge: 'Michelin Nordic',
        bio: 'Former head chef at leading Scandinavian fine dining establishments; specialized in cold-smoked fjord salmon.',
        photo: '/images/chefs/chef_henrik_lindqvist.png',
        description: 'New Nordic culinary philosophy utilizing cold-smoked Arctic seafood, wild foraged herbs, and Scandinavian fermentation.',
        specialties: ['Cold-Smoked Salmon', 'Wild Foraged Herbs', 'New Nordic', 'Fermentation'],
        availability: 'Available for private events',
        minHours: 4,
        maxGuests: 35,
        portfolio: [
            '/images/orders/order_nordic_salmon.png',
        ],
        reviews_list: [
            { author: 'Astrid N.', rating: 5, text: 'Pure art on a plate. The cold-smoked salmon and dill cream were heavenly.' },
        ]
    },
    'min-jun-park': {
        name: 'Chef Min-Jun Park',
        cuisine: 'Korean',
        rate: 165,
        rating: 4.9,
        reviews: 126,
        location: 'Seoul, South Korea',
        badge: 'K-Fine Dining',
        bio: 'Pioneering modernist Korean fine dining with 10-year aged jang sauces and Hanwoo beef pairing.',
        photo: '/images/chefs/chef_min_jun_park.png',
        description: 'Elevated modern Korean gastronomy combining heritage fermentation, aged jang marinades, and charcoal grilled Galbi.',
        specialties: ['Galbi Short Ribs', 'Modern Korean', 'Aged Kimchi', 'Hanwoo Beef'],
        availability: 'Available internationally',
        minHours: 3,
        maxGuests: 40,
        portfolio: [
            '/images/orders/order_korean_bbq.png',
        ],
        reviews_list: [
            { author: 'Chloe S.', rating: 5, text: 'Unbelievable Korean fine dining! The Galbi short ribs were unmatched.' },
        ]
    },
    'sofia-mendez': {
        name: 'Chef Sofía Mendez',
        cuisine: 'Spanish',
        rate: 120,
        rating: 4.9,
        reviews: 89,
        location: 'Barcelona, Spain',
        badge: 'Tapas & Paella',
        bio: 'Expert in traditional Catalan cuisine and giant seafood paella.',
        photo: '/images/chefs/chef_sofia_mendez.png',
        description: 'Master of Valencian paella cooked over orange wood embers with wild Carabineros prawns and delicate socarrat crust.',
        specialties: ['Seafood Paella', 'Carabineros Prawns', 'Catalan Tapas', 'Socarrat'],
        availability: 'Available for villa dining',
        minHours: 3,
        maxGuests: 60,
        portfolio: [
            '/images/orders/order_spanish_paella.png',
        ],
        reviews_list: [
            { author: 'Mateo C.', rating: 5, text: 'Best paella I have ever tasted outside of Valencia. The socarrat was crispy gold.' },
        ]
    },
    'meera-patel': {
        name: 'Chef Meera Patel',
        cuisine: 'Indian',
        rate: 95,
        rating: 4.9,
        reviews: 203,
        location: 'Birmingham, UK',
        badge: 'Ayurvedic Chef',
        bio: 'Specialising in Ayurvedic nutrition, royal Awadhi dum cooking, and South Asian banquets.',
        photo: '/images/chefs/chef_meera_patel.png',
        description: 'Royal Awadhi and Mughal culinary heritage, sealed dum biryani in brass handi, and artisanal spice roasts.',
        specialties: ['Awadhi Dum Biryani', 'Ayurvedic Spices', 'Royal Mughal', 'Slow-Cooked Handi'],
        availability: 'Available nationwide UK',
        minHours: 3,
        maxGuests: 75,
        portfolio: [
            '/images/orders/order_indian_biryani.png',
        ],
        reviews_list: [
            { author: 'Priya R.', rating: 5, text: 'The dum biryani was pure poetry. The aroma filled the whole house!' },
        ]
    },
    'tariq-al-ghamdi': {
        name: 'Chef Tariq Al-Ghamdi',
        cuisine: 'Middle Eastern',
        rate: 195,
        rating: 4.9,
        reviews: 109,
        location: 'Riyadh, Saudi Arabia',
        badge: 'Royal Banquet',
        bio: 'Specializes in royal banquet hospitality, slow-cooked Najdi lamb, and saffron infusions.',
        photo: '/images/chefs/chef_tariq_al_ghamdi.png',
        description: 'Opulent Middle Eastern royal banquet feasts, 6-hour braised Najdi lamb shank, and saffron kabsa platters.',
        specialties: ['Royal Najdi Lamb', 'Saffron Kabsa', 'Middle Eastern Hospitality', 'Majlis Banquets'],
        availability: 'Available worldwide for VIP events',
        minHours: 4,
        maxGuests: 120,
        portfolio: [
            '/images/orders/order_middle_eastern_lamb.png',
        ],
        reviews_list: [
            { author: 'Sultan A.', rating: 5, text: 'A truly royal feast. The lamb shank was meltingly tender and flavorful.' },
        ]
    },
    'elena-beauchamp': {
        name: 'Chef Éléna Beauchamp',
        cuisine: 'French-Canadian',
        rate: 140,
        rating: 4.8,
        reviews: 98,
        location: 'Montreal, Canada',
        badge: 'Nordic-French',
        bio: 'Crafts refined Quebecois-French fusion menus featuring wild foraged herbs, artisanal cheeses, and Atlantic seafood.',
        photo: '/images/chefs/chef_elena_beauchamp.png',
        description: 'Quebecois-French culinary mastery with pan-seared duck breast, wild blueberry reductions, and foraged forest mushrooms.',
        specialties: ['Quebec Duck', 'Maple Demi-Glace', 'French-Canadian', 'Foraged Herbs'],
        availability: 'Available for private bookings',
        minHours: 3,
        maxGuests: 40,
        portfolio: [
            '/images/orders/order_canadian_duck.png',
        ],
        reviews_list: [
            { author: 'Marc D.', rating: 5, text: 'Superb flavors and plating. The duck breast paired with wild berries was unforgettable.' },
        ]
    },
    'olena-kovalenko': {
        name: 'Chef Olena Kovalenko',
        cuisine: 'Ukrainian',
        rate: 110,
        rating: 4.9,
        reviews: 115,
        location: 'Kyiv, Ukraine',
        badge: 'Heritage Cuisine',
        bio: 'Reimagining Eastern European heritage cooking with modern fermentation techniques, delicate borscht reductions, and smoked delicacies.',
        photo: '/images/chefs/chef_olena_kovalenko.png',
        description: 'Handmade heritage Ukrainian varenyky dumplings, delicate ruby borscht reductions, and artisanal smoked forest mushrooms.',
        specialties: ['Varenyky Dumplings', 'Borscht Reduction', 'Eastern European', 'Fermentation'],
        availability: 'Available across Europe and UK',
        minHours: 3,
        maxGuests: 50,
        portfolio: [
            '/images/orders/order_ukrainian_varenyky.png',
        ],
        reviews_list: [
            { author: 'Kateryna S.', rating: 5, text: 'Tears of joy at the dinner table. The varenyky were so delicate and flavorful.' },
        ]
    },
    'carlos-garcia': {
        name: 'Chef Carlos Garcia',
        cuisine: 'Mexican',
        rate: 85,
        rating: 4.7,
        reviews: 71,
        location: 'Mexico City',
        badge: 'Street Food Expert',
        bio: 'Elevating traditional Mexican street food and Jalisco birria to fine dining.',
        photo: '/images/chefs/chef_carlos_garcia.png',
        description: 'Slow-braised Jalisco beef birria, handmade heirloom corn tortillas, roasted chili salsas, and rich consome reductions.',
        specialties: ['Jalisco Birria', 'Heirloom Tortillas', 'Mole Artistry', 'Modern Mexican'],
        availability: 'Available for private dinner parties',
        minHours: 3,
        maxGuests: 60,
        portfolio: [
            '/images/orders/order_mexican_birria.png',
        ],
        reviews_list: [
            { author: 'Alejandro G.', rating: 5, text: 'Incredible birria and authentic flavors presented like a 5-star restaurant dish.' },
        ]
    },
    'james-osei': {
        name: 'Chef James Osei',
        cuisine: 'Pan-African',
        rate: 70,
        rating: 4.8,
        reviews: 156,
        location: 'Accra, Ghana',
        badge: 'Events Specialist',
        bio: 'Creates vibrant Pan-African feasts, suya spiced grills, and festive banquets for weddings and parties.',
        photo: '/images/chefs/chef_james_osei.png',
        description: 'Charcoal-grilled suya-spiced French lamb chops, sweet plantain purée, and festive Pan-African banqueting.',
        specialties: ['Suya Lamb Chops', 'Pan-African Banquets', 'Plantain Purée', 'Charcoal Grills'],
        availability: 'Available for events and private dinners',
        minHours: 4,
        maxGuests: 150,
        portfolio: [
            '/images/orders/order_pan_african_suya.png',
        ],
        reviews_list: [
            { author: 'Kwame A.', rating: 5, text: 'James catered our 50-person anniversary dinner. The suya lamb chops stole the show!' },
        ]
    },
    'kenji-sato': {
        name: 'Chef Kenji Sato',
        cuisine: 'Japanese',
        rate: 220,
        rating: 5.0,
        reviews: 153,
        location: 'Kyoto, Japan',
        badge: 'Kaiseki Master',
        bio: 'Trained in Gion Kyoto, specializing in traditional seasonal Kaiseki multicourse banquets and Wagyu A5 preparations.',
        photo: '/images/chefs/chef_kenji_sato.png',
        description: 'Authentic Kyoto Kaiseki multi-course master dining, seasonal dashi harmony, and Kagoshima Wagyu A5.',
        specialties: ['Kyoto Kaiseki', 'Wagyu A5', 'Dashi Mastery', 'Seasonal Banquet'],
        availability: 'Available for private luxury dinners',
        minHours: 4,
        maxGuests: 20,
        portfolio: [
            '/images/orders/order_japanese_sushi.png',
        ],
        reviews_list: [
            { author: 'Kenichi M.', rating: 5, text: 'A true Kyoto Kaiseki master. The harmony of flavours and seasonal aesthetic is unmatched.' },
        ]
    },
}

export default function ChefProfilePage() {
    const params = useParams()
    const chefId = params.id as string
    const chef = CHEFS_DATA[chefId]
    const [liked, setLiked] = useState(false)

    if (!chef) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-5xl mb-4">👨‍🍳</p>
                        <h1 className="text-2xl font-bold mb-2">Chef not found</h1>
                        <p className="text-muted-foreground mb-6">The chef profile you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/find-chefs" className="px-6 py-2.5 gradient-brand text-white rounded-xl font-semibold hover:opacity-90">
                            Back to Chefs
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero section with photo */}
                <div className="relative h-96 bg-muted overflow-hidden">
                    <Image
                        src={chef.photo}
                        alt={chef.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Header with actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 -mt-20 relative z-10">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-2">{chef.name}&apos;s Profile</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold">{chef.rating}</span>
                                    <span className="text-muted-foreground">({chef.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />{chef.location}
                                </div>
                                <span className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-xs font-semibold">
                                    {chef.badge}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLiked(!liked)}
                                className="p-3 border border-border rounded-xl hover:bg-muted transition-colors"
                                aria-label="Like"
                            >
                                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
                            </button>
                            <button className="p-3 border border-border rounded-xl hover:bg-muted transition-colors" aria-label="Share">
                                <Share2 className="w-5 h-5 text-foreground/60" />
                            </button>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column */}
                        <div className="lg:col-span-2">
                            {/* About */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
                                <p className="text-muted-foreground leading-relaxed mb-6">{chef.description}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <Clock className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Min Hours</p>
                                        <p className="font-bold text-lg">{chef.minHours}h</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <Users className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Max Guests</p>
                                        <p className="font-bold text-lg">{chef.maxGuests}</p>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                                        <ChefHat className="w-5 h-5 mx-auto mb-2 text-terracotta" />
                                        <p className="text-xs text-muted-foreground">Rate</p>
                                        <p className="font-bold text-lg">£{chef.rate}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Specialties */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">Specialties</h2>
                                <div className="flex flex-wrap gap-2">
                                    {chef.specialties.map((spec) => (
                                        <span key={spec} className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Portfolio */}
                            <section className="mb-12">
                                <h2 className="text-2xl font-serif font-bold mb-4">Portfolio</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {chef.portfolio.map((image, i) => (
                                        <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Portfolio ${i + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Reviews */}
                            <section>
                                <h2 className="text-2xl font-serif font-bold mb-4">Reviews</h2>
                                <div className="space-y-4">
                                    {chef.reviews_list.map((review, i) => (
                                        <div key={i} className="bg-card border border-border rounded-xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold">{review.author}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star
                                                            key={j}
                                                            className={`w-4 h-4 ${j < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right sidebar */}
                        <div>
                            <div className="sticky top-20 bg-card border border-border rounded-2xl p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                                    <p className="text-4xl font-black text-terracotta">£{chef.rate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Availability</p>
                                    <p className="font-semibold">{chef.availability}</p>
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href={`/book/${chefId}`}
                                        className="w-full py-3 gradient-brand text-white font-bold rounded-xl text-center hover:opacity-90 transition-opacity block"
                                    >
                                        📅 Book for Event
                                    </Link>
                                    <Link
                                        href={`/order/${chefId}`}
                                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl text-center hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        🍽️ Order Food
                                    </Link>
                                </div>
                                <button className="w-full py-3 border border-border rounded-xl font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Message Chef
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
