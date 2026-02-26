import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Building2, Rocket, Globe, Star, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams and startups',
    monthlyPrice: 999,
    annualPrice: 799,
    features: [
      '1 Event per month',
      'Up to 20 guests',
      'Standard Chef level',
      '3-Course Menu',
      'Email support',
      'Basic equipment rental'
    ],
    icon: Rocket,
    color: 'blue'
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Most popular for scaling businesses',
    monthlyPrice: 2499,
    annualPrice: 1999,
    popular: true,
    features: [
      '4 Events per month',
      'Up to 50 guests',
      'Senior Chef level',
      '4-Course Menu',
      'Priority support',
      'Premium equipment included',
      'Dedicated account manager',
      'Custom branding options'
    ],
    icon: Star,
    color: 'orange'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full culinary outsourcing for large orgs',
    monthlyPrice: 5999,
    annualPrice: 4799,
    features: [
      'Unlimited Events',
      'Unlimited guests',
      'Michelin level available',
      'Bespoke Menu design',
      '24/7 concierge support',
      'Full kitchen installation',
      'International availability',
      'Quarterly ROI reporting'
    ],
    icon: Building2,
    color: 'purple'
  }
];

export default function SubscriptionPackages() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    navigate(`/find-chefs?subscription=${planId}&cycle=${billingCycle}`);
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            CHEF-AS-A-SERVICE
          </span>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 mb-6">Business Subscriptions</h2>
          <p className="text-gray-500 font-bold max-w-2xl mx-auto mb-10">
            Scale your corporate catering with a predictable monthly cost. Save up to 20% with annual billing.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-16 h-8 bg-gray-200 rounded-full relative transition-colors p-1"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${billingCycle === 'annual' ? 'translate-x-8' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>Annual</span>
              <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Save 20%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/5 blur-[120px] -z-10 pointer-events-none" />

          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-orange-500 shadow-xl' : 'border-gray-100'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${plan.color === 'blue' ? 'bg-blue-100 text-blue-600' : plan.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-xs font-medium">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">£{billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</span>
                  <span className="text-gray-400 font-bold text-sm">/month</span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="text-green-600 text-xs font-bold mt-1 italic">
                    Billed annually (£{(plan.annualPrice * 12).toLocaleString()}/year)
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-orange-500' : 'text-green-500'}`} />
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

                <button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  GET STARTED
                  <ArrowRight className="w-5 h-5" />
                </button>

            </div>
          ))}
        </div>

        {/* Bonus Perks Section */}
        <div className="mt-20 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Global Network</h4>
              <p className="text-gray-500 text-xs">Chefs in 50+ cities</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Priority Booking</h4>
              <p className="text-gray-500 text-xs">Skip the queue</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Elite Chefs</h4>
              <p className="text-gray-500 text-xs">Top 1% vetted talent</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">White-Label</h4>
              <p className="text-gray-500 text-xs">Your brand, our food</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
