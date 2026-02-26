'use client';

import { useState, useEffect } from 'react';
import { Calculator, Users, Utensils, Clock, MapPin, Briefcase, Info, ArrowRight } from 'lucide-react';

export default function PriceCalculator() {
  const [guests, setGuests] = useState(20);
  const [courses, setCourses] = useState(3);
  const [hours, setHours] = useState(4);
  const [chefTier, setChefTier] = useState('senior');
  const [includeEquipment, setIncludeEquipment] = useState(true);
  const [staffCount, setStaffCount] = useState(1);
  const [distance, setDistance] = useState(10);
  
  const [quote, setQuote] = useState({
    chefFee: 0,
    ingredientsCost: 0,
    equipmentCost: 0,
    travelCost: 0,
    staffCost: 0,
    subtotal: 0,
    total: 0,
    perPerson: 0
  });

  const CHEF_RATES: Record<string, number> = {
    certified: 75,
    senior: 120,
    michelin: 200
  };

  useEffect(() => {
    const chefFee = CHEF_RATES[chefTier] * hours;
    const ingredientsCost = 12 * guests * courses;
    const equipmentCost = includeEquipment ? (80 + (3 * guests)) : 0;
    const travelCost = Math.max(15, distance * 0.45);
    const staffCost = staffCount * 18 * hours;
    
    const subtotal = chefFee + ingredientsCost + equipmentCost + travelCost + staffCost;
    const total = subtotal; // Simplified for calculator
    
    setQuote({
      chefFee,
      ingredientsCost,
      equipmentCost,
      travelCost,
      staffCost,
      subtotal,
      total,
      perPerson: total / guests
    });
  }, [guests, courses, hours, chefTier, includeEquipment, staffCount, distance]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  return (
    <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
      {/* Input Panel */}
      <div className="flex-1 p-8 lg:p-12 text-white border-r border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Price Calculator</h3>
            <p className="text-gray-400 text-sm">Get an instant estimate for your event</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Guests */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium mb-3">
              <span className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                Number of Guests
              </span>
              <span className="text-orange-500 font-bold">{guests}</span>
            </label>
            <input
              type="range"
              min="2"
              max="200"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Courses & Hours */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Utensils className="w-4 h-4" />
                Courses
              </label>
              <select 
                value={courses}
                onChange={(e) => setCourses(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {[3, 4, 5, 7, 10].map(c => (
                  <option key={c} value={c} className="bg-gray-900">{c} Courses</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Clock className="w-4 h-4" />
                Service Hours
              </label>
              <select 
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {[2, 3, 4, 6, 8, 12].map(h => (
                  <option key={h} value={h} className="bg-gray-900">{h} Hours</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chef Tier */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Briefcase className="w-4 h-4" />
              Chef Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['certified', 'senior', 'michelin'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setChefTier(tier)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                    chefTier === tier
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tier.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Staff & Equipment */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs text-gray-400">Full Equipment</span>
              <button 
                onClick={() => setIncludeEquipment(!includeEquipment)}
                className={`w-10 h-6 rounded-full transition-colors relative ${includeEquipment ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${includeEquipment ? 'translate-x-4' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs text-gray-400">Extra Staff</span>
              <input 
                type="number"
                min="0"
                max="10"
                value={staffCount}
                onChange={(e) => setStaffCount(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-right font-bold outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="w-full lg:w-[400px] p-8 lg:p-12 bg-white/5 flex flex-col justify-between">
        <div>
          <h4 className="text-gray-400 font-medium uppercase tracking-widest text-xs mb-8">Estimated Investment</h4>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Chef Fee ({chefTier})</span>
              <span className="text-white font-medium">{formatCurrency(quote.chefFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Ingredients ({guests} guests)</span>
              <span className="text-white font-medium">{formatCurrency(quote.ingredientsCost)}</span>
            </div>
            {includeEquipment && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Equipment Rental</span>
                <span className="text-white font-medium">{formatCurrency(quote.equipmentCost)}</span>
              </div>
            )}
            {staffCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Service Staff ({staffCount})</span>
                <span className="text-white font-medium">{formatCurrency(quote.staffCost)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 mb-8">
            <div className="flex items-end justify-between mb-2">
              <span className="text-gray-400 font-bold text-lg">Total Quote</span>
              <span className="text-4xl font-black text-white">{formatCurrency(quote.total)}</span>
            </div>
            <div className="text-right text-orange-500 font-medium">
              Only {formatCurrency(quote.perPerson)} per person
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20">
            Book with this Estimate
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            *This is an automated estimate. Final price may vary based on specific menu choices and seasonal availability. Travel fees included for up to {distance} miles.
          </p>
        </div>
      </div>
    </div>
  );
}
