import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceCalculator from '@/components/packages/PriceCalculator';
import PackageDetailModal, { samplePackageData } from '@/components/packages/PackageDetailModal';
import AIEventConcierge from '@/components/packages/AIEventConcierge';
import ComparePackages from '@/components/packages/ComparePackages';
import CorporateROICalculator from '@/components/packages/CorporateROICalculator';
import SocialProofSection from '@/components/packages/SocialProofSection';
import EventQuiz from '@/components/packages/EventQuiz';
import SubscriptionPackages from '@/components/packages/SubscriptionPackages';
import { 
  UrgencyBanner, 
  GuaranteeBadges, 
  GuaranteeBadgesInline,
  SeasonalPackages, 
  PaymentOptions,
  LowAvailabilityAlert 
} from '@/components/packages/UrgencyAndExtras';
import { 
  ChefHat, 
  Sparkles, 
  Users, 
  Building2, 
  Crown, 
  PartyPopper,
  Utensils,
  Play,
  ArrowRight,
  Star
} from 'lucide-react';

// Package data for cards
const eventPackages = [
  {
    id: 'birthday-bash',
    category: 'celebrations',
    name: 'Birthday Bash Packages',
    priceRange: '£400 - £2,000',
    pricePer: 'per event',
    description: 'Perfect for celebrations with friends and family',
    icon: '🎂',
    popular: false
  },
  {
    id: 'wedding-feast',
    category: 'celebrations',
    name: 'Wedding Feast Packages',
    priceRange: '£3,000 - £15,000',
    pricePer: 'per event',
    description: 'Elegant multi-course dining for your special day',
    icon: '💍',
    popular: true
  },
  {
    id: 'bridal-shower',
    category: 'celebrations',
    name: 'Bridal Shower / Bachelor Party',
    priceRange: '£700 - £2,500',
    pricePer: 'per event',
    description: 'Pre-wedding celebrations done right',
    icon: '🥂',
    popular: false
  },
  {
    id: 'funeral-remembrance',
    category: 'celebrations',
    name: 'Funeral/Remembrance Catering',
    priceRange: '£1,000 - £4,000',
    pricePer: 'per event',
    description: 'Dignified catering for memorial gatherings',
    icon: '🕯️',
    popular: false
  },
  {
    id: 'baby-shower',
    category: 'celebrations',
    name: 'Baby Shower Brunch',
    priceRange: '£500 - £1,500',
    pricePer: 'per event',
    description: 'Celebrate new arrivals in style',
    icon: '👶',
    popular: false
  }
];

const businessPackages = [
  {
    id: 'office-lunch',
    category: 'business',
    name: 'Office Lunch Subscriptions',
    priceRange: '£1,000 - £4,500',
    pricePer: 'per month',
    description: 'Regular team meals that boost morale',
    icon: '🏢',
    popular: false
  },
  {
    id: 'conference-chef',
    category: 'business',
    name: 'Conference Chef Services',
    priceRange: '£2,000 - £10,000',
    pricePer: 'per conference',
    description: 'Impress delegates with exceptional catering',
    icon: '📊',
    popular: true
  },
  {
    id: 'school-meals',
    category: 'business',
    name: 'School Meal Chefs',
    priceRange: '£700 - £2,500',
    pricePer: 'per week',
    description: 'Nutritious meals for educational institutions',
    icon: '🏫',
    popular: false
  },
  {
    id: 'military-mess',
    category: 'business',
    name: 'Military Mess Hall Chefs',
    priceRange: '£4,000 - £15,000',
    pricePer: 'per month',
    description: 'High-volume catering for military installations',
    icon: '🎖️',
    popular: false
  },
  {
    id: 'flight-chef',
    category: 'business',
    name: 'Flight Chef Experiences',
    priceRange: '£2,000 - £7,000',
    pricePer: 'per flight',
    description: 'Private aviation culinary services',
    icon: '✈️',
    popular: false
  }
];

const luxuryPackages = [
  {
    id: 'royalty-residence',
    category: 'luxury',
    name: 'Royalty-In-Residence Service',
    priceRange: '£15,000 - £50,000',
    pricePer: 'per month',
    description: 'Full-time private chef for your household',
    icon: '👑',
    popular: false
  },
  {
    id: 'global-travel',
    category: 'luxury',
    name: 'Global Travel Chef Companion',
    priceRange: '£3,000 - £15,000',
    pricePer: 'per trip',
    description: 'Your personal chef, anywhere in the world',
    icon: '🌍',
    popular: true
  },
  {
    id: 'michelin-home',
    category: 'luxury',
    name: 'Michelin-at-Home Experience',
    priceRange: '£1,500 - £7,000',
    pricePer: 'per night',
    description: 'Restaurant-quality tasting menus at home',
    icon: '⭐',
    popular: false
  },
  {
    id: 'celebrity-wellness',
    category: 'luxury',
    name: 'Celebrity Wellness Meal Plans',
    priceRange: '£3,000 - £10,000',
    pricePer: 'per month',
    description: 'Customized nutrition from celebrity chefs',
    icon: '🥗',
    popular: false
  },
  {
    id: 'presidential-detail',
    category: 'luxury',
    name: 'Presidential Chef Detail',
    priceRange: '£20,000 - £70,000',
    pricePer: 'per month',
    description: 'Executive-level culinary security and service',
    icon: '🎩',
    popular: false
  }
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePackageClick = (pkg: any) => {
    setSelectedPackage(samplePackageData);
    setIsModalOpen(true);
  };

  const handleStartBuilding = () => {
    navigate('/find-chefs?mode=building');
  };

  const PackageCard = ({ pkg }: { pkg: any }) => (
    <div 
      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group relative"
      onClick={() => handlePackageClick(pkg)}
    >
      {pkg.popular && (
        <span className="absolute -top-3 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          POPULAR
        </span>
      )}
      
      <div className="text-3xl mb-4">{pkg.icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
        {pkg.name}
      </h3>
      <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
      
      <div className="mb-4">
        <span className="text-2xl font-bold text-orange-600">{pkg.priceRange}</span>
        <span className="text-gray-400 text-sm ml-1">{pkg.pricePer}</span>
      </div>

      <GuaranteeBadgesInline />

      <button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-orange-600">
        View Details
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <UrgencyBanner 
        availableChefs={3}
        discountEndDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
        popularMonth="December 2026"
        slotsLeft={4}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1920"
            alt="Chef cooking"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              EVENT EXCELLENCE
            </span>
            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              DESIGN YOUR<br />
              <span className="text-orange-500">EXPERIENCE</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              From intimate dinners to global summits. Real-time pricing, VR previews, 
              and world-class culinary talent at your fingertips.
            </p>
            
            {/* Quick Navigation Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#celebrations" className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/10">
                CELEBRATIONS
              </a>
              <a href="#business" className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/10">
                BUSINESS
              </a>
              <a href="#luxury" className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/10">
                LUXURY
              </a>
              <a href="#compare" className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/10">
                COMPARE ALL
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleStartBuilding}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors flex items-center gap-2"
              >
                START BUILDING
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl transition-colors flex items-center gap-2 backdrop-blur-sm">
                <Play className="w-5 h-5" />
                VIEW SHOWREEL
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-gray-400 text-sm">Events Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold flex items-center gap-1">
                  4.9 <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                </div>
                <div className="text-gray-400 text-sm">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-gray-400 text-sm">Verified Chefs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Discovery First: Event Quiz */}
      <div id="quiz">
        <EventQuiz />
      </div>

      {/* 2. Core Package Categories: Grouped Catalog */}
      
      {/* Events & Celebrations Section */}
      <section id="celebrations" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-orange-100 rounded-xl">
              <PartyPopper className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">EVENTS & CELEBRATIONS</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Business & Institutions Section */}
      <section id="business" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">BUSINESS & INSTITUTIONS</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businessPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Section */}
      <section id="luxury" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">LUXURY, CUSTOM & VIP</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {luxuryPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Recurring Value: Subscription Packages */}
      <div id="subscriptions" className="scroll-mt-20">
        <SubscriptionPackages />
      </div>

      {/* 4. Refinement: Comparison & Calculators */}
      <div id="compare" className="scroll-mt-20">
        <ComparePackages />
      </div>

      <div id="calculator" className="scroll-mt-20">
        <PriceCalculator />
      </div>

      <CorporateROICalculator />

      {/* 5. Validation: Social Proof & Trust */}
      <SocialProofSection />
      
      <SeasonalPackages />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <GuaranteeBadges />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920"
            alt="Fine dining"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-white mb-6">BEYOND THE MENU?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We architect custom culinary experiences for state visits, 
            festivals, and major corporate launches.
          </p>
          <button className="bg-white text-gray-900 font-bold px-10 py-5 rounded-xl hover:bg-gray-100 transition-colors text-lg">
            CONTACT THE ELITE TEAM
          </button>
        </div>
      </section>

      <Footer />

      <PackageDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageData={selectedPackage}
      />

      <AIEventConcierge />
    </main>
  );
}
