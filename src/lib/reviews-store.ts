export interface ChefReview {
    id: string
    authorName: string
    authorRole: string
    authorLocation: string
    chefId: string
    chefName: string
    chefPhoto: string
    cuisine: string
    rating: number
    eventType: string
    date: string
    comment: string
    verified: boolean
    dishHighlight?: string
    dishPhoto?: string
}

export const INITIAL_REVIEWS: ChefReview[] = [
    {
        id: 'rev-1',
        authorName: 'Lady Eleanor Vance',
        authorRole: 'Private Dinner Host',
        authorLocation: 'Mayfair, London',
        chefId: 'marco-rossi',
        chefName: 'Chef Marco Rossi',
        chefPhoto: '/images/chefs/chef_marco_rossi.png',
        cuisine: 'Italian Fine Dining',
        rating: 5,
        eventType: '20th Wedding Anniversary Dinner',
        date: 'August 14, 2026',
        comment: 'Chef Marco turned our home into a 3-Michelin star dining room. The hand-rolled black truffle tagliatelle and aged parmigiano broth had all eight of our guests in awe. The kitchen was left completely spotless.',
        verified: true,
        dishHighlight: 'Handmade Black Truffle Tagliatelle',
        dishPhoto: '/images/orders/order_italian_pasta.png'
    },
    {
        id: 'rev-2',
        authorName: 'Jonathan Sterling',
        authorRole: 'Managing Partner, Apex Capital Partners',
        authorLocation: 'Manhattan, New York',
        chefId: 'yuki-tanaka',
        chefName: 'Chef Yuki Tanaka',
        chefPhoto: '/images/chefs/chef_yuki_tanaka.png',
        cuisine: 'Japanese Omakase',
        rating: 5,
        eventType: 'Executive Board Dinner (12 Guests)',
        date: 'August 10, 2026',
        comment: 'Chef Yuki flew in direct bluefin tuna and Hokkaido uni for our partner closing celebration. The precision, knife work, and sake pairings were world-class. Stripe escrow billing was completely effortless.',
        verified: true,
        dishHighlight: 'Otoro Fatty Tuna & Hokkaido Uni Grand Box',
        dishPhoto: '/images/orders/order_japanese_sushi.png'
    },
    {
        id: 'rev-3',
        authorName: 'Amara & Tunde Balogun',
        authorRole: 'Wedding Banquet Hosts',
        authorLocation: 'Victoria Island, Lagos',
        chefId: 'aisha-okafor',
        chefName: 'Chef Aisha Okafor',
        chefPhoto: '/images/chefs/chef_aisha_okafor.png',
        cuisine: 'West African Gourmet',
        rating: 5,
        eventType: 'VIP Engagement Banquet (45 Guests)',
        date: 'August 5, 2026',
        comment: 'Chef Aisha elevated our traditional celebratory dinner beyond belief. Her signature firewood smoky Jollof paired with giant tiger prawns and honey plantain purée received endless compliments from every guest.',
        verified: true,
        dishHighlight: 'Smoky Firewood Jollof & Jumbo Tiger Prawns',
        dishPhoto: '/images/orders/order_west_african_jollof.png'
    },
    {
        id: 'rev-4',
        authorName: 'Henrik & Clara Van Der Berg',
        authorRole: 'Private Yacht Charter Host',
        authorLocation: 'French Riviera / Monaco',
        chefId: 'pierre-dubois',
        chefName: 'Chef Pierre Dubois',
        chefPhoto: '/images/chefs/chef_pierre_dubois.png',
        cuisine: 'French Haute Cuisine',
        rating: 5,
        eventType: 'Summer Yacht Cruise Dinner',
        date: 'July 29, 2026',
        comment: 'Pierre’s pan-seared duck breast with spiced figs and rich Bordeaux reduction was exquisite. From table setting to course pacing, everything felt like a grand Parisian salon.',
        verified: true,
        dishHighlight: 'Duck Breast with Spiced Figs & Demi-Glace',
        dishPhoto: '/images/orders/order_french_haute.png'
    },
    {
        id: 'rev-5',
        authorName: 'Sophie Beaumont',
        authorRole: 'Head of People & Culture, CloudSync',
        authorLocation: 'Austin, Texas',
        chefId: 'marcus-vance',
        chefName: 'Chef Marcus Vance',
        chefPhoto: '/images/chefs/chef_marcus_vance.png',
        cuisine: 'American Contemporary BBQ',
        rating: 5,
        eventType: 'Company Summer Retreat Banquet',
        date: 'July 24, 2026',
        comment: 'Chef Marcus cooked for our entire 35-person engineering team. His 18-hour hickory-smoked prime brisket fell apart with a fork, and the farm-fresh sides were outstanding. Booking via the Business Dashboard was seamless.',
        verified: true,
        dishHighlight: '18-Hour Hickory Smoked Prime Brisket',
        dishPhoto: '/images/orders/order_american_bbq.png'
    },
    {
        id: 'rev-6',
        authorName: 'Daisuke & Mei Takahashi',
        authorRole: 'Food Critics & Private Hosts',
        authorLocation: 'Kyoto, Japan',
        chefId: 'kenji-sato',
        chefName: 'Chef Kenji Sato',
        chefPhoto: '/images/chefs/chef_kenji_sato.png',
        cuisine: 'Kyoto Kaiseki',
        rating: 5,
        eventType: 'Seasonal Kaiseki Gathering (8 Guests)',
        date: 'July 18, 2026',
        comment: 'Master Kenji’s 9-course Kaiseki captured the essence of summer in Kyoto. The dashi broth and A5 Wagyu preparations were transcendent.',
        verified: true,
        dishHighlight: 'Wagyu A5 & Truffle Kaiseki Course',
        dishPhoto: '/images/orders/order_japanese_sushi.png'
    }
]

export const STORAGE_KEY = 'chefmii_user_reviews'

export function getAllReviews(): ChefReview[] {
    if (typeof window === 'undefined') return INITIAL_REVIEWS
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            return [...parsed, ...INITIAL_REVIEWS]
        }
    } catch {}
    return INITIAL_REVIEWS
}

export function saveNewReview(review: Omit<ChefReview, 'id' | 'date' | 'verified'>): ChefReview {
    const newRev: ChefReview = {
        ...review,
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        verified: true
    }

    if (typeof window !== 'undefined') {
        try {
            const current = localStorage.getItem(STORAGE_KEY)
            const list = current ? JSON.parse(current) : []
            list.unshift(newRev)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        } catch (e) {
            console.error('Failed to store review:', e)
        }
    }
    return newRev
}
