import React, { useState } from 'react';
import { Check, X, ChefHat, Users, Clock, Utensils, Wine, Sparkles, ArrowRight } from 'lucide-react';

interface PackageFeature {
  name: string;
  essential: boolean | string;
  premium: boolean | string;
  luxury: boolean | string;
}

interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  pricePerHead: string;
  priceRange: string;
  popular?: boolean;
  features: {
    courses: string;
    chefLevel: string;
    serviceStaff: string;
    tableware: string;
    menuConsultation: string;
    tasting: string;
    dietaryAccommodations: boolean;
    cleanup: boolean;
    sommelier: boolean | string;
    liveStation: boolean | string;
    photographyAdd: boolean;
  };
}

const packages: PackageTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Perfect for casual gatherings',
    pricePerHead: 'From £35',
    priceRange: '£400 - £2,000',
    features: {
      courses: '3 courses',
      chefLevel: 'Certified Chef',
      serviceStaff: 'Optional (+£18/hr)',
      tableware: 'Bring your own',
      menuConsultation: '1 session',
      tasting: 'Not included',
      dietaryAccommodations: true,
      cleanup: true,
      sommelier: false,
      liveStation: false,
      photographyAdd: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Our most popular choice',
    pricePerHead: 'From £65',
    priceRange: '£1,500 - £5,000',
    popular: true,
    features: {
      courses: '5 courses',
      chefLevel: 'Senior Chef',
      serviceStaff: '1 included',
      tableware: 'Standard set included',
      menuConsultation: '2 sessions',
      tasting: 'For 2 people',
      dietaryAccommodations: true,
      cleanup: true,
      sommelier: 'Optional',
      liveStation: 'Optional',
      photographyAdd: true
    }
  },
  {
    id: 'luxury',
    name: 'Luxury',
    tagline: 'The ultimate experience',
    pricePerHead: 'From £120',
    priceRange: '£3,000 - £15,000+',
    features: {
      courses: '7+ tasting menu',
      chefLevel: 'Michelin-trained',
      serviceStaff: '2 included',
      tableware: 'Premium china & crystal',
      menuConsultation: 'Unlimited',
      tasting: 'For 4 people',
      dietaryAccommodations: true,
      cleanup: true,
      sommelier: 'Included',
      liveStation: 'Included',
      photographyAdd: true
    }
  }
];

const featureCategories = [
  {
    name: 'Dining Experience',
    features: [
      { key: 'courses', label: 'Number of Courses', icon: Utensils },
      { key: 'chefLevel', label: 'Chef Experience', icon: ChefHat },
      { key: 'serviceStaff', label: 'Service Staff', icon: Users },
      { key: 'tableware', label: 'Tableware & Linens', icon: Sparkles }
    ]
  },
  {
    name: 'Planning & Preparation',
    features: [
      { key: 'menuConsultation', label: 'Menu Consultation' },
      { key: 'tasting', label: 'Menu Tasting' },
      { key: 'dietaryAccommodations', label: 'Dietary Accommodations' }
    ]
  },
  {
    name: 'Premium Add-ons',
    features: [
      { key: 'sommelier', label: 'Sommelier Service', icon: Wine },
      { key: 'liveStation', label: 'Live Cooking Station' },
      { key: 'cleanup', label: 'Full Kitchen Cleanup' }
    ]
  }
];

export default function ComparePackages() {
  const [selectedPackages, setSelectedPackages] = useState<string[]>(['essential', 'premium', 'luxury']);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
          <Check className="w-4 h-4 text-green-600" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
          <X className="w-4 h-4 text-gray-400" />
        </span>
      );
    }
    return <span className="text-gray-900 font-medium">{value}</span>;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            COMPARE PACKAGES
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Package</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare features side-by-side to choose the package that best fits your event
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header with Package Cards */}
            <thead>
              <tr>
                <th className="p-4 text-left w-64"></th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 min-w-[240px]">
                    <div className={`rounded-2xl p-6 text-center transition-all ${
                      pkg.popular 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl scale-105' 
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      {pkg.popular && (
                        <span className="inline-block bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          MOST POPULAR
                        </span>
                      )}
                      <h3 className={`text-2xl font-bold mb-1 ${pkg.popular ? 'text-white' : 'text-gray-900'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-sm mb-4 ${pkg.popular ? 'text-orange-100' : 'text-gray-500'}`}>
                        {pkg.tagline}
                      </p>
                      <div className={`text-3xl font-bold mb-1 ${pkg.popular ? 'text-white' : 'text-orange-600'}`}>
                        {pkg.pricePerHead}
                      </div>
                      <div className={`text-sm mb-4 ${pkg.popular ? 'text-orange-100' : 'text-gray-500'}`}>
                        per person
                      </div>
                      <button className={`w-full py-3 rounded-xl font-medium transition-colors ${
                        pkg.popular 
                          ? 'bg-white text-orange-600 hover:bg-orange-50' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}>
                        Select Package
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

              {/* Feature Rows */}
            <tbody>
              {featureCategories.map((category) => (
                <React.Fragment key={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {/* Category Header */}
                  <tr>
                    <td colSpan={4} className="pt-8 pb-4">
                      <h4 className="text-lg font-bold text-gray-900">{category.name}</h4>
                    </td>
                  </tr>
                  
                  {/* Features */}
                  {category.features.map((feature) => (
                    <tr 
                      key={`feature-${feature.key}`}
                      className={`border-b border-gray-100 transition-colors ${
                        highlightedFeature === feature.key ? 'bg-orange-50' : 'hover:bg-gray-50'
                      }`}
                      onMouseEnter={() => setHighlightedFeature(feature.key)}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {feature.icon && <feature.icon className="w-5 h-5 text-gray-400" />}
                          <span className="text-gray-700">{feature.label}</span>
                        </div>
                      </td>
                      {packages.map((pkg) => (
                        <td key={`${pkg.id}-${feature.key}`} className="p-4 text-center">
                          {renderFeatureValue(pkg.features[feature.key as keyof typeof pkg.features])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Summary Bar */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-6 text-white">
          <div className="grid md:grid-cols-4 gap-6 items-center">
            <div>
              <h4 className="text-lg font-bold mb-1">Not sure which to choose?</h4>
              <p className="text-gray-400 text-sm">Our AI can help you find the perfect match</p>
            </div>
            {packages.map((pkg) => (
              <div key={`summary-${pkg.id}`} className="text-center">
                <div className="text-orange-400 font-bold">{pkg.name}</div>
                <div className="text-gray-400 text-sm">{pkg.priceRange}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Decision Helper */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-4xl mb-3">🎂</div>
            <h4 className="font-bold text-gray-900 mb-2">Birthday or Casual Event?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Essential package is perfect for relaxed celebrations where the focus is on great food and company.
            </p>
            <button className="text-orange-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Choose Essential <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="text-4xl mb-3">💍</div>
            <h4 className="font-bold text-gray-900 mb-2">Wedding or Special Occasion?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Premium package offers the balance of elegance and value that most celebrations need.
            </p>
            <button className="text-orange-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Choose Premium <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-4xl mb-3">👑</div>
            <h4 className="font-bold text-gray-900 mb-2">VIP or Corporate Event?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Luxury package delivers an unforgettable Michelin-level experience for discerning guests.
            </p>
            <button className="text-orange-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Choose Luxury <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
