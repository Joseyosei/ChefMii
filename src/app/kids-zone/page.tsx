'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import {
    Sparkles,
    Star,
    Award,
    ShieldCheck,
    Play,
    Calendar,
    ChefHat,
    Smile,
    Heart,
    Flame,
    CheckCircle2,
    Lock
} from 'lucide-react'

const KIDS_CLASSES = [
    {
        id: 'class-1',
        title: 'Artisanal Pizza & Dough Chemistry',
        emoji: '🍕',
        age: 'Ages 6–12',
        level: 'Beginner',
        duration: '60 mins',
        chef: 'Chef Marco Rossi',
        chefPhoto: '/images/chefs/chef_marco_rossi.png',
        badge: 'Top Rated',
        price: '£25',
        schedule: 'Every Saturday at 11:00 AM',
        skills: ['Dough kneading', 'Sauce balancing', 'Oven safety'],
    },
    {
        id: 'class-2',
        title: 'Master Cupcake Decorating & Piping',
        emoji: '🧁',
        age: 'Ages 5–10',
        level: 'All Levels',
        duration: '45 mins',
        chef: 'Chef Éléna Beauchamp',
        chefPhoto: '/images/chefs/chef_elena_beauchamp.png',
        badge: 'Fun & Creative',
        price: '£20',
        schedule: 'Every Sunday at 2:00 PM',
        skills: ['Pastry bag piping', 'Natural coloring', 'Sugar artistry'],
    },
    {
        id: 'class-3',
        title: 'Rainbow Bento & Kid-Friendly Sushi',
        emoji: '🍣',
        age: 'Ages 7–14',
        level: 'Intermediate',
        duration: '75 mins',
        chef: 'Chef Kenji Sato',
        chefPhoto: '/images/chefs/chef_kenji_sato.png',
        badge: 'Healthy Eating',
        price: '£30',
        schedule: 'Wednesdays at 4:30 PM',
        skills: ['Bamboo rolling', 'Vegetable carving', 'Rice seasoning'],
    },
    {
        id: 'class-4',
        title: 'Junior Chef Healthy Lunchbox Studio',
        emoji: '🥪',
        age: 'Ages 8–15',
        level: 'Beginner',
        duration: '60 mins',
        chef: 'Chef Aisha Okafor',
        chefPhoto: '/images/chefs/chef_aisha_okafor.png',
        badge: 'Life Skills',
        price: '£22',
        schedule: 'Fridays at 5:00 PM',
        skills: ['Knife safety grips', 'Nutrition balance', 'Meal prep'],
    },
]

const BADGES = [
    { name: 'Pasta Prodigy', emoji: '🍝', level: 'Unlocked', desc: 'Completed first homemade tagliatelle session' },
    { name: 'Knife Safety Guard', emoji: '🛡️', level: 'Unlocked', desc: 'Passed certified claw grip safety assessment' },
    { name: 'Master Baker', emoji: '🥐', level: 'Unlocked', desc: 'Baked perfect golden croissants' },
    { name: 'Flavour Explorer', emoji: '🌍', level: 'In Progress (3/5)', desc: 'Cooked dishes from 5 different continents' },
]

export default function KidsZonePage() {
    const [selectedTab, setSelectedTab] = useState<'classes' | 'challenges' | 'badges'>('classes')
    const [activeKidName, setActiveKidName] = useState('Leo')
    const [xp, setXp] = useState(650)

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24 font-sans text-foreground">
                {/* Playful Colorful Header Banner */}
                <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white py-12 px-4 sm:px-6 relative overflow-hidden shadow-lg">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3 text-center md:text-left">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                ChefMii Junior Academy
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight">
                                Little Chefs, Big Flavours! 🍕✨
                            </h1>
                            <p className="text-white/90 text-sm sm:text-base max-w-xl">
                                Fun, safe, child-friendly live cooking workshops and self-paced culinary masterclasses taught by certified background-checked private chefs.
                            </p>
                        </div>

                        {/* Junior Chef Avatar & XP Card */}
                        <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-5 text-white w-full sm:w-80 shadow-2xl space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-white text-3xl flex items-center justify-center shadow-md">
                                    👨‍🍳
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">{activeKidName}’s Chef Passport</h3>
                                    <p className="text-xs text-white/80">Rank: Level 3 Junior Apprentice</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>Experience Points</span>
                                    <span>{xp} / 1,000 XP</span>
                                </div>
                                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(xp / 1000) * 100}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Toggle */}
                <div className="bg-white dark:bg-stone-900 border-b border-border sticky top-0 z-20 shadow-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'classes', label: '🍕 Live Kids Classes', icon: Calendar },
                            { id: 'challenges', label: '🎯 Weekly Kitchen Quests', icon: Star },
                            { id: 'badges', label: '🏆 Badges & Achievements', icon: Award },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTab(t.id as any)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                    selectedTab === t.id
                                        ? 'bg-terracotta text-white border-terracotta shadow-xs'
                                        : 'bg-stone-100 dark:bg-stone-800 text-foreground border-border hover:border-terracotta/50'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
                    {/* Classes Grid */}
                    {selectedTab === 'classes' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    Upcoming Junior Cooking Workshops
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    100% DBS-verified child-friendly chefs with guided live instruction and ingredient kits
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {KIDS_CLASSES.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-terracotta/50 transition-all duration-300 flex flex-col justify-between group"
                                    >
                                        <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-b border-border text-center relative">
                                            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                                {cls.emoji}
                                            </div>
                                            <span className="inline-block px-2.5 py-0.5 bg-terracotta text-white rounded-full text-[10px] font-bold">
                                                {cls.badge}
                                            </span>
                                            <div className="absolute top-3 right-3 text-xs font-bold text-muted-foreground">
                                                {cls.duration}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs font-bold text-terracotta mb-1">
                                                    <span>{cls.age}</span>
                                                    <span>{cls.level}</span>
                                                </div>
                                                <h3 className="font-bold text-base text-foreground mb-2 leading-snug">
                                                    {cls.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {cls.schedule}
                                                </p>
                                                {/* Skills tags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {cls.skills.map((s, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-foreground text-[10px] font-medium rounded-md">
                                                            ✓ {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Class Fee</span>
                                                    <span className="text-terracotta font-black text-lg">{cls.price}</span>
                                                </div>
                                                <Link
                                                    href="/register"
                                                    className="px-4 py-2.5 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-xs transition-opacity"
                                                >
                                                    Enrol Little Chef →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Weekly Quests Tab */}
                    {selectedTab === 'challenges' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    Weekly Kitchen Quests (+100 XP Each)
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Complete real safe cooking challenges with your parents to level up your Junior Chef rank
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { title: 'The Great Egg Crack Challenge', desc: 'Crack 3 eggs cleanly without any shell in the bowl!', reward: '+100 XP', emoji: '🥚' },
                                    { title: 'Taste Rainbow Salad', desc: 'Make a bowl with 5 different colored fruits or veggies!', reward: '+150 XP', emoji: '🥗' },
                                    { title: 'Pancake Flip Master', desc: 'Successfully flip a golden pancake with adult supervision!', reward: '+200 XP', emoji: '🥞' },
                                ].map((q, i) => (
                                    <div key={i} className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 shadow-sm space-y-3">
                                        <div className="text-4xl">{q.emoji}</div>
                                        <h3 className="font-bold text-base text-foreground">{q.title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{q.desc}</p>
                                        <div className="pt-2 flex justify-between items-center text-xs font-bold">
                                            <span className="text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                                                Reward: {q.reward}
                                            </span>
                                            <button
                                                onClick={() => setXp((x) => Math.min(1000, x + 100))}
                                                className="px-3 py-1.5 gradient-brand text-white rounded-lg"
                                            >
                                                Mark Completed
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Badges Tab */}
                    {selectedTab === 'badges' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {BADGES.map((b, i) => (
                                <div key={i} className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 text-center shadow-xs space-y-2">
                                    <div className="text-5xl mb-2">{b.emoji}</div>
                                    <h4 className="font-bold text-base text-foreground">{b.name}</h4>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        b.level.includes('Unlocked') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                    }`}>
                                        {b.level}
                                    </span>
                                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Safety Guarantee Box */}
                    <div className="bg-emerald-900/90 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-12 h-12 text-emerald-300 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold">100% Child Safety & Background Checks</h3>
                                <p className="text-xs text-emerald-100/80">
                                    Every junior chef instructor is DBS-checked, certified in pediatric first aid, and vetted for allergy-safe cooking environments.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/find-chefs"
                            className="px-5 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-full hover:bg-emerald-50 transition-all shrink-0"
                        >
                            Browse Certified Chefs →
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
