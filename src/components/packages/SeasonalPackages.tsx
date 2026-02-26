'use client';

import { Calendar, ArrowRight, Flame } from 'lucide-react';

const seasonalDeals = [
  {
    title: 'Christmas Party Packages',
    description: 'Festive feasts for office parties & family gatherings.',
    price: 'From £45/head',
    period: 'Nov - Dec',
    icon: '🎄',
    color: 'bg-red-50 border-red-100 text-red-600',
    tag: 'Popular'
  },
  {
    title: 'Valentine\'s Romantic Dinner',
    description: 'Intimate candlelit dining experience for two.',
    price: 'From £150/couple',
    period: 'Feb',
    icon: '💕',
    color: 'bg-pink-50 border-pink-100 text-pink-600',
    tag: 'Booking Fast'
  },
  {
    title: 'Summer Garden Party',
    description: 'BBQ & al fresco dining for outdoor celebrations.',
    price: 'From £35/head',
    period: 'Jun - Aug',
    icon: '☀️',
    color: 'bg-yellow-50 border-yellow-100 text-yellow-600'
  }
];

export default function SeasonalPackages() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              LIMITED TIME OFFERS
            </span>
            <h2 className="text-4xl font-bold text-gray-900">Seasonal Special Packages</h2>
          </div>
          <p className="text-gray-600 max-w-md">
            Exclusive curated menus and experiences available for a limited time during festive periods.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {seasonalDeals.map((deal, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-3xl p-8 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${deal.color}`}
            >
              {deal.tag && (
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {deal.tag}
                </div>
              )}
              
              <div className="text-5xl mb-6">{deal.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{deal.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {deal.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Price</div>
                  <div className="text-xl font-black text-gray-900">{deal.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Availability</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                    <Calendar className="w-4 h-4" />
                    {deal.period}
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 bg-white/50 hover:bg-white text-gray-900 font-bold py-4 rounded-2xl transition-all border border-black/5 flex items-center justify-center gap-2">
                Check Dates
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
