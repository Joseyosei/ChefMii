import { useState } from 'react';
import { 
  Check, X, ChefHat, Calendar, GraduationCap, 
  Baby, Building2, Sparkles,
  Clock, Gift, CreditCard, Shield, Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CHEF_HOURLY_RATES = [
  {
    tier: 'Certified Chef',
    rate: 75,
    description: 'Food safety certified, 2+ years experience',
    features: ['Background checked', 'Food safety Level 2', 'Insurance included', 'Basic menu options'],
    popular: false,
  },
  {
    tier: 'Senior Chef',
    rate: 120,
    description: '5+ years experience, specialized cuisines',
    features: ['All Certified features', 'Specialized cuisines', 'Custom menu creation', 'Wine pairing knowledge'],
    popular: true,
  },
  {
    tier: 'Michelin-Trained Chef',
    rate: 200,
    description: 'Fine dining experience, Michelin background',
    features: ['All Senior features', 'Michelin restaurant experience', 'Tasting menus', 'Premium ingredients expertise'],
    popular: false,
  },
];

const EVENT_PACKAGES = {
  celebrations: [
    { name: 'Birthday Bash', priceRange: '\u00A3400 - \u00A32,000', guests: '2-50', icon: '\uD83C\uDF82' },
    { name: 'Wedding Feast', priceRange: '\u00A33,000 - \u00A315,000', guests: '20-300', icon: '\uD83D\uDC92', popular: true },
    { name: 'Bridal Shower / Bachelor', priceRange: '\u00A3700 - \u00A32,500', guests: '10-40', icon: '\uD83D\uDC8D' },
    { name: 'Funeral / Remembrance', priceRange: '\u00A31,000 - \u00A34,000', guests: '20-100', icon: '\uD83D\uDD6F\uFE0F' },
    { name: 'Baby Shower Brunch', priceRange: '\u00A3500 - \u00A31,500', guests: '10-30', icon: '\uD83D\uDC76' },
    { name: 'Anniversary Dinner', priceRange: '\u00A3600 - \u00A32,000', guests: '2-30', icon: '\u2764\uFE0F' },
    { name: 'Graduation Celebration', priceRange: '\u00A3500 - \u00A31,800', guests: '10-50', icon: '\uD83C\uDF93' },
    { name: 'Engagement Party', priceRange: '\u00A3800 - \u00A33,000', guests: '20-60', icon: '\uD83D\uDC8E' },
    { name: 'Holiday Feasts', priceRange: '\u00A3600 - \u00A32,500', guests: '8-40', icon: '\uD83C\uDF84' },
  ],
  business: [
    { name: 'Office Lunch Subscription', priceRange: '\u00A31,000 - \u00A34,500/month', guests: '10-100', icon: '\uD83C\uDFE2' },
    { name: 'Conference Chef Services', priceRange: '\u00A32,000 - \u00A310,000', guests: '50-500', icon: '\uD83C\uDF99\uFE0F' },
    { name: 'School Meal Chefs', priceRange: '\u00A3700 - \u00A32,500/week', guests: '50-300', icon: '\uD83C\uDFEB' },
    { name: 'Military Mess Hall', priceRange: '\u00A34,000 - \u00A315,000/month', guests: '100-500', icon: '\uD83C\uDF96\uFE0F' },
    { name: 'Flight Chef Experience', priceRange: '\u00A32,000 - \u00A37,000/flight', guests: '2-20', icon: '\u2708\uFE0F' },
    { name: 'Corporate Team Building', priceRange: '\u00A31,500 - \u00A35,000', guests: '10-50', icon: '\uD83E\uDD1D' },
    { name: 'Executive Dining', priceRange: '\u00A33,000 - \u00A312,000', guests: '5-30', icon: '\uD83D\uDC54' },
  ],
  luxury: [
    { name: 'Royalty-In-Residence', priceRange: '\u00A315,000 - \u00A350,000/month', guests: 'Variable', icon: '\uD83D\uDC51', premium: true },
    { name: 'Global Travel Chef', priceRange: '\u00A33,000 - \u00A315,000/trip', guests: '1-10', icon: '\uD83C\uDF0D' },
    { name: 'Michelin-at-Home', priceRange: '\u00A31,500 - \u00A37,000/night', guests: '2-12', icon: '\u2B50', popular: true },
    { name: 'Celebrity Wellness Meals', priceRange: '\u00A33,000 - \u00A310,000/month', guests: '1-5', icon: '\uD83E\uDD57' },
    { name: 'Presidential Chef Detail', priceRange: '\u00A320,000 - \u00A370,000/month', guests: 'Variable', icon: '\uD83C\uDFDB\uFE0F', premium: true },
    { name: 'Yacht Chef Services', priceRange: '\u00A35,000 - \u00A320,000/trip', guests: '2-20', icon: '\uD83D\uDEE5\uFE0F' },
    { name: 'Private Island Chef', priceRange: '\u00A310,000 - \u00A340,000/week', guests: '2-30', icon: '\uD83C\uDFDD\uFE0F' },
  ],
};

const SUBSCRIPTION_PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Explore the platform',
    features: [
      { text: 'Browse all chefs', included: true },
      { text: 'Public chef profiles', included: true },
      { text: 'Basic search', included: true },
      { text: 'Help center access', included: true },
      { text: 'Direct messaging', included: false },
      { text: 'Priority matching', included: false },
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Essential booking tools',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Direct messaging', included: true },
      { text: 'Priority chef matching', included: true },
      { text: 'Calendar sync', included: true },
      { text: 'Secure payments', included: true },
      { text: 'Custom menu planning', included: false },
    ],
    cta: 'Start Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 75,
    period: 'month',
    description: 'For serious foodies',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: '2 hrs video consultation', included: true },
      { text: 'Premium menu options', included: true },
      { text: 'Custom menu planning', included: true },
      { text: 'Priority support', included: true },
      { text: '10% booking discount', included: true },
    ],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Influencer',
    price: 109,
    period: 'month',
    description: 'For content creators',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Social media promotion', included: true },
      { text: 'Social media audit', included: true },
      { text: 'Personal brand consultation', included: true },
      { text: 'Verified creator badge', included: true },
      { text: '15% booking discount', included: true },
    ],
    cta: 'Join Creators',
    highlighted: false,
  },
  {
    name: 'Business',
    price: 749,
    period: 'month',
    description: 'For teams & enterprises',
    features: [
      { text: 'Everything in Influencer', included: true },
      { text: 'Corporate catering access', included: true },
      { text: 'Multi-user accounts (10)', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom billing & invoicing', included: true },
      { text: '20% booking discount', included: true },
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const BUSINESS_SUBSCRIPTIONS = [
  {
    name: 'Starter',
    price: 1500,
    events: '2 events/month',
    guests: 'Up to 25 guests/event',
    chef: 'Certified Chef',
    features: ['Email support', '10% off additional events', 'Standard menus'],
    popular: false,
  },
  {
    name: 'Growth',
    price: 2800,
    events: '4 events/month',
    guests: 'Up to 50 guests/event',
    chef: 'Senior Chef',
    features: ['Priority booking', 'Dedicated account manager', '15% off additional events', 'Quarterly menu refresh'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom' as string | number,
    events: 'Unlimited events',
    guests: 'Unlimited guests',
    chef: 'Michelin-trained available',
    features: ['24/7 priority support', 'Dedicated success team', 'Custom integrations', 'Up to 30% volume discounts'],
    popular: false,
  },
];

const ACADEMY_COURSES = [
  { name: 'Home Cook Weekend Intensive', price: '\u00A3199', duration: '2 days' },
  { name: 'Cuisine Masterclass (Italian, French, etc.)', price: '\u00A3350 - \u00A3500', duration: '1-2 weeks' },
  { name: 'Food Safety Level 2', price: '\u00A3150', duration: '1 day' },
  { name: 'Food Safety Level 3', price: '\u00A3350', duration: '3 days' },
  { name: 'Wine Pairing Certificate', price: '\u00A3450', duration: '1 week' },
  { name: 'Pastry & Baking Specialization', price: '\u00A3800', duration: '4 weeks' },
  { name: 'Professional Chef Training', price: '\u00A32,500 - \u00A35,000', duration: '6-12 months' },
];

const KIDS_ZONE_PRICING = [
  { name: 'Single Cooking Class (ages 5-12)', price: '\u00A325 - \u00A345', duration: '2 hours' },
  { name: 'Teen Chef Program (ages 13-17)', price: '\u00A345 - \u00A375', duration: '3 hours' },
  { name: 'Birthday Party Package', price: '\u00A3150 - \u00A3400', duration: '3-4 hours' },
  { name: 'Family Workshop', price: '\u00A380 - \u00A3150', duration: '3 hours' },
  { name: 'Holiday Camp (per day)', price: '\u00A350 - \u00A375', duration: 'Full day' },
  { name: 'Holiday Camp (full week)', price: '\u00A3200 - \u00A3300', duration: '5 days' },
];

const ADDITIONAL_COSTS = [
  { item: 'Ingredients (per person)', price: '\u00A315 - \u00A350', note: 'Depends on menu' },
  { item: 'Travel (within 50 miles)', price: 'Included', note: 'Standard' },
  { item: 'Travel (beyond 50 miles)', price: '\u00A30.45/mile', note: 'Round trip' },
  { item: 'Service Staff', price: '\u00A318/hour per server', note: 'Optional' },
  { item: 'Equipment Rental', price: '\u00A380 + \u00A33/guest', note: 'If needed' },
  { item: 'Specialty Ingredients', price: 'Variable', note: 'Premium add-on' },
];

type TabId = 'all' | 'subscriptions' | 'events' | 'chefs' | 'academy' | 'kids' | 'business';

export default function ComprehensivePricingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const tabs = [
    { id: 'all' as TabId, label: 'All Pricing', icon: Sparkles },
    { id: 'subscriptions' as TabId, label: 'Subscriptions', icon: CreditCard },
    { id: 'chefs' as TabId, label: 'Chef Rates', icon: ChefHat },
    { id: 'events' as TabId, label: 'Event Packages', icon: Calendar },
    { id: 'business' as TabId, label: 'Business', icon: Building2 },
    { id: 'academy' as TabId, label: 'Academy', icon: GraduationCap },
    { id: 'kids' as TabId, label: "Kids' Zone", icon: Baby },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transparent Pricing for Every Occasion
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            From intimate dinners to presidential banquets. Find the perfect plan for your culinary journey.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5" />
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Award className="w-5 h-5" />
              <span>Verified Chefs Only</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <CreditCard className="w-5 h-5" />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {(activeTab === 'all' || activeTab === 'chefs') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Chef Hourly Rates</h2>
              <p className="text-gray-600">Book by the hour for any occasion</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {CHEF_HOURLY_RATES.map((chef) => (
                <div
                  key={chef.tier}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${
                    chef.popular ? 'border-orange-500 shadow-orange-100' : 'border-gray-200'
                  }`}
                >
                  {chef.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <ChefHat className={`w-12 h-12 mx-auto mb-3 ${chef.popular ? 'text-orange-500' : 'text-gray-400'}`} />
                    <h3 className="text-xl font-bold text-gray-900">{chef.tier}</h3>
                    <p className="text-gray-500 text-sm mt-1">{chef.description}</p>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">{'\u00A3'}{chef.rate}</span>
                    <span className="text-gray-500">/hour</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {chef.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      chef.popular
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'subscriptions') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Platform Subscriptions</h2>
              <p className="text-gray-600 mb-6">Choose a plan that fits your culinary lifestyle</p>
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    billingPeriod === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    billingPeriod === 'annual' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
                >
                  Annual <span className="text-green-600 text-sm ml-1">Save 20%</span>
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const displayPrice = billingPeriod === 'annual' && plan.price > 0
                  ? Math.round(plan.price * 0.8)
                  : plan.price;
                return (
                  <div
                    key={plan.name}
                    className={`relative bg-white rounded-2xl p-5 border-2 transition-all hover:shadow-lg ${
                      plan.highlighted ? 'border-orange-500 shadow-lg scale-105' : 'border-gray-200'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500 text-sm">{plan.description}</p>
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : `\u00A3${displayPrice}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 text-sm">/{plan.period}</span>
                      )}
                    </div>
                    <ul className="space-y-2 mb-4 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-gray-600' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                        plan.highlighted
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'events') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Event Packages</h2>
              <p className="text-gray-600">All-inclusive packages for every occasion</p>
            </div>
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">{'\uD83C\uDF89'}</span> Events & Celebrations
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVENT_PACKAGES.celebrations.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`bg-white rounded-xl p-4 border-2 hover:shadow-md transition-all ${
                      pkg.popular ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full mb-2">
                        POPULAR
                      </span>
                    )}
                    <div>
                      <span className="text-2xl mr-2">{pkg.icon}</span>
                      <h4 className="font-semibold text-gray-900 inline">{pkg.name}</h4>
                      <p className="text-orange-600 font-bold mt-1">{pkg.priceRange}</p>
                      <p className="text-gray-500 text-sm">{pkg.guests} guests</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">{'\uD83C\uDFE2'}</span> Business & Institutions
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVENT_PACKAGES.business.map((pkg) => (
                  <div key={pkg.name} className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:shadow-md transition-all">
                    <div>
                      <span className="text-2xl mr-2">{pkg.icon}</span>
                      <h4 className="font-semibold text-gray-900 inline">{pkg.name}</h4>
                      <p className="text-orange-600 font-bold mt-1">{pkg.priceRange}</p>
                      <p className="text-gray-500 text-sm">{pkg.guests} guests</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">{'\uD83D\uDC51'}</span> Luxury, Custom & VIP
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVENT_PACKAGES.luxury.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`bg-white rounded-xl p-4 border-2 hover:shadow-md transition-all ${
                      pkg.premium ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50' :
                      pkg.popular ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    {pkg.premium && (
                      <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full mb-2">
                        ULTRA PREMIUM
                      </span>
                    )}
                    {pkg.popular && !pkg.premium && (
                      <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full mb-2">
                        POPULAR
                      </span>
                    )}
                    <div>
                      <span className="text-2xl mr-2">{pkg.icon}</span>
                      <h4 className="font-semibold text-gray-900 inline">{pkg.name}</h4>
                      <p className="text-orange-600 font-bold mt-1">{pkg.priceRange}</p>
                      <p className="text-gray-500 text-sm">{pkg.guests} guests</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'business') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Business Subscriptions</h2>
              <p className="text-gray-600">Chef-as-a-Service for your organization</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {BUSINESS_SUBSCRIPTIONS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${
                    plan.popular ? 'border-orange-500 shadow-orange-100' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <Building2 className={`w-12 h-12 mx-auto mb-3 ${plan.popular ? 'text-orange-500' : 'text-gray-400'}`} />
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="text-center mb-4">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">{'\u00A3'}{plan.price.toLocaleString()}</span>
                        <span className="text-gray-500">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    )}
                  </div>
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Events</span>
                      <span className="font-medium">{plan.events}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium">{plan.guests}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Chef Level</span>
                      <span className="font-medium">{plan.chef}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {typeof plan.price === 'number' ? 'Get Started' : 'Contact Sales'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'academy') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Academy Courses</h2>
              <p className="text-gray-600">Level up your culinary skills</p>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Course</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Duration</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Price</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ACADEMY_COURSES.map((course, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-orange-500" />
                          <span className="font-medium text-gray-900">{course.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{course.duration}</td>
                      <td className="py-4 px-6 text-right font-bold text-orange-600">{course.price}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                          Enroll &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'kids') && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Kids' Zone Pricing</h2>
              <p className="text-gray-600">Fun culinary experiences for young chefs</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KIDS_ZONE_PRICING.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Baby className="w-5 h-5 text-orange-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{item.duration}</span>
                    <span className="text-xl font-bold text-orange-600">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'all' && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Costs</h2>
              <p className="text-gray-600">Transparent pricing with no hidden fees</p>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Item</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Cost</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ADDITIONAL_COSTS.map((cost, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{cost.item}</td>
                      <td className="py-4 px-6 text-right font-bold text-orange-600">{cost.price}</td>
                      <td className="py-4 px-6 text-right text-gray-500 text-sm">{cost.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'all' && (
          <section className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Flexible Payment Options</h2>
              <p className="text-gray-600">Choose how you want to pay</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Pay in Full</h3>
                <p className="text-green-600 font-semibold mb-2">Get 3% discount</p>
                <p className="text-gray-500 text-sm">Best value when you pay upfront</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">50/50 Split</h3>
                <p className="text-blue-600 font-semibold mb-2">50% deposit, 50% on event day</p>
                <p className="text-gray-500 text-sm">Spread your payment easily</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Klarna</h3>
                <p className="text-purple-600 font-semibold mb-2">3 interest-free instalments</p>
                <p className="text-gray-500 text-sm">Pay over time with no extra cost</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                <Shield className="w-4 h-4 inline mr-1" />
                All payments secured with 256-bit SSL encryption
              </p>
            </div>
          </section>
        )}

        {activeTab === 'all' && (
          <section className="bg-gray-900 text-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Our Guarantees</h2>
              <p className="text-gray-400">Book with confidence</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold mb-2">Satisfaction Guaranteed</h3>
                <p className="text-gray-400 text-sm">Full refund if not happy</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Free Cancellation</h3>
                <p className="text-gray-400 text-sm">Up to 7 days before event</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold mb-2">Verified Chefs</h3>
                <p className="text-gray-400 text-sm">Background checked & certified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Fully Insured</h3>
                <p className="text-gray-400 text-sm">{'\u00A3'}5M public liability coverage</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'all' && (
          <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 text-center">
            <Gift className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Book Early & Save 10%</h2>
            <p className="text-orange-100 mb-6">
              Get 10% off when you book 30+ days in advance. Applies to all event packages.
            </p>
            <button className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors">
              Browse Event Packages
            </button>
          </section>
        )}

        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've found their perfect chef with ChefMii.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors">
              Get Started Free
            </button>
            <button className="border-2 border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors">
              Talk to Sales
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
