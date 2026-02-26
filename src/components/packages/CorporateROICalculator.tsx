'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Building2, Users, Calendar, PoundSterling, Percent, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';

interface ROIResults {
  currentAnnualSpend: number;
  chefMiiAnnualSpend: number;
  annualSavings: number;
  savingsPercent: number;
  monthlySavings: number;
  perEventSavings: number;
  projectedROI: number;
  employeeSatisfactionBoost: number;
}

export default function CorporateROICalculator() {
  const [currentSpend, setCurrentSpend] = useState(5000);
  const [eventsPerMonth, setEventsPerMonth] = useState(8);
  const [avgAttendees, setAvgAttendees] = useState(25);
  const [companySize, setCompanySize] = useState<'small' | 'medium' | 'large'>('medium');
  const [results, setResults] = useState<ROIResults | null>(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // ChefMii pricing advantages
  const CHEFMII_DISCOUNT_RATE = 0.23; // 23% average savings
  const SATISFACTION_BOOST = 87; // % of employees prefer fresh chef-cooked meals
  const EFFICIENCY_GAIN = 15; // % time saved in planning

  useEffect(() => {
    calculateROI();
  }, [currentSpend, eventsPerMonth, avgAttendees, companySize]);

  const calculateROI = () => {
    const currentAnnualSpend = currentSpend * 12;
    const chefMiiAnnualSpend = currentAnnualSpend * (1 - CHEFMII_DISCOUNT_RATE);
    const annualSavings = currentAnnualSpend - chefMiiAnnualSpend;
    const savingsPercent = CHEFMII_DISCOUNT_RATE * 100;
    const monthlySavings = annualSavings / 12;
    const perEventSavings = monthlySavings / eventsPerMonth;
    
    // Calculate ROI based on savings + productivity gains
    const productivityValue = (avgAttendees * eventsPerMonth * 12 * 50 * (EFFICIENCY_GAIN / 100)); // £50 avg hourly rate
    const projectedROI = ((annualSavings + productivityValue) / chefMiiAnnualSpend) * 100;

    setResults({
      currentAnnualSpend,
      chefMiiAnnualSpend,
      annualSavings,
      savingsPercent,
      monthlySavings,
      perEventSavings,
      projectedROI,
      employeeSatisfactionBoost: SATISFACTION_BOOST
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            ENTERPRISE ROI CALCULATOR
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">Calculate Your Savings</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how much your company could save by switching to ChefMii for corporate catering
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              Your Current Situation
            </h3>

            {/* Current Monthly Spend */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <PoundSterling className="w-4 h-4" />
                  Current Monthly Catering Spend
                </span>
                <span className="text-orange-600 font-bold">{formatCurrency(currentSpend)}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={currentSpend}
                onChange={(e) => setCurrentSpend(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>£1,000</span>
                <span>£25,000</span>
                <span>£50,000</span>
              </div>
            </div>

            {/* Events Per Month */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Events Per Month
                </span>
                <span className="text-orange-600 font-bold">{eventsPerMonth} events</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={eventsPerMonth}
                onChange={(e) => setEventsPerMonth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            {/* Average Attendees */}
            <div className="mb-6">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Average Attendees Per Event
                </span>
                <span className="text-orange-600 font-bold">{avgAttendees} people</span>
              </label>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={avgAttendees}
                onChange={(e) => setAvgAttendees(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>100</span>
                <span>200</span>
              </div>
            </div>

            {/* Company Size */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Company Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small', label: 'Small', desc: '< 50 employees' },
                  { value: 'medium', label: 'Medium', desc: '50-500' },
                  { value: 'large', label: 'Enterprise', desc: '500+' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setCompanySize(size.value as typeof companySize)}
                    className={`py-3 px-2 rounded-xl transition-all text-center ${
                      companySize === size.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{size.label}</div>
                    <div className={`text-xs ${companySize === size.value ? 'text-orange-100' : 'text-gray-500'}`}>
                      {size.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-3">What you get with ChefMii Business:</h4>
              <div className="space-y-2 text-sm">
                {[
                  'Dedicated account manager',
                  'Priority booking for last-minute events',
                  'Custom corporate menus',
                  'Consolidated monthly invoicing',
                  'Volume discounts (15-30%)',
                  'Dietary tracking per employee'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Main Savings Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6" />
                <span className="font-medium">Your Projected Savings</span>
              </div>
              
              {results && (
                <>
                  <div className="text-5xl font-bold mb-2">
                    {formatCurrency(results.annualSavings)}
                  </div>
                  <div className="text-orange-100 mb-6">per year</div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4">
                      <div className="text-orange-100 text-sm mb-1">Monthly Savings</div>
                      <div className="text-2xl font-bold">{formatCurrency(results.monthlySavings)}</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                      <div className="text-orange-100 text-sm mb-1">Per Event</div>
                      <div className="text-2xl font-bold">{formatCurrency(results.perEventSavings)}</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Additional Metrics */}
            {results && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Percent className="w-4 h-4" />
                    Savings Rate
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{results.savingsPercent}%</div>
                  <div className="text-gray-500 text-sm">vs traditional catering</div>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Users className="w-4 h-4" />
                    Satisfaction Boost
                  </div>
                  <div className="text-3xl font-bold text-green-600">{results.employeeSatisfactionBoost}%</div>
                  <div className="text-gray-500 text-sm">prefer fresh chef meals</div>
                </div>
              </div>
            )}

            {/* Comparison Table */}
            {results && (
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Annual Cost Comparison</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Current Annual Spend</span>
                    <span className="font-medium text-gray-900">{formatCurrency(results.currentAnnualSpend)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">With ChefMii Business</span>
                    <span className="font-medium text-orange-600">{formatCurrency(results.chefMiiAnnualSpend)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-green-50 -mx-2 px-2 rounded-lg">
                    <span className="font-medium text-green-700">Your Savings</span>
                    <span className="font-bold text-green-700">{formatCurrency(results.annualSavings)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">Ready to start saving?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Get a custom enterprise quote tailored to your company's needs
              </p>
              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                Get Enterprise Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full mt-3 text-orange-600 font-medium py-2 hover:text-orange-700 transition-colors">
                Schedule a Demo
              </button>
            </div>

            {/* Trust Logos */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">Trusted by leading companies</p>
              <div className="flex justify-center gap-8 opacity-50">
                {['Google', 'Meta', 'Barclays', 'BBC', 'Harrods'].map((company) => (
                  <span key={company} className="text-white font-bold text-sm">{company}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
