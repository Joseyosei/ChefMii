'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Zap, Award, Calendar, Flame, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function UrgencyBanner({ 
  availableChefs = 3, 
  discountEndDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  popularMonth = "December 2026",
  slotsLeft = 4 
}: { 
  availableChefs?: number;
  discountEndDate?: Date;
  popularMonth?: string;
  slotsLeft?: number;
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = discountEndDate.getTime() - now;
      
      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [discountEndDate]);

  return (
    <div className="bg-orange-600 text-white py-2 px-4 sticky top-0 z-[60] shadow-lg border-b border-orange-500/30 backdrop-blur-md bg-orange-600/95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-lg animate-pulse hidden sm:block">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className="text-[11px] md:text-xs font-black uppercase tracking-wider">
            PEAK SEASON ALERT: <span className="text-orange-100 italic">{popularMonth} is 90% booked!</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-orange-200">Ends in:</span>
            <span className="tabular-nums font-mono">{timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-orange-300 animate-bounce" />
            <span>ONLY {slotsLeft} SLOTS LEFT</span>
          </div>

          <button className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 shadow-sm uppercase tracking-widest">
            CLAIM 10% OFF
          </button>
        </div>
      </div>
    </div>
  );
}

export function GuaranteeBadges() {
  const badges = [
    { 
      icon: ShieldCheck, 
      title: 'Fully Insured', 
      desc: '£10M Public Liability' 
    },
    { 
      icon: Zap, 
      title: 'Instant Quotes', 
      desc: 'Real-time pricing engine' 
    },
    { 
      icon: Award, 
      title: 'Verified Chefs', 
      desc: 'Top 1% culinary talent' 
    },
    { 
      icon: Calendar, 
      title: 'Flexible Dates', 
      desc: 'Free rescheduling' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-50 transition-all duration-300">
            <badge.icon className="w-8 h-8 text-orange-500" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-1">{badge.title}</h4>
          <p className="text-gray-500 text-xs">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function GuaranteeBadgesInline() {
  const badges = [
    { icon: ShieldCheck, text: 'INSURED' },
    { icon: Award, text: 'VERIFIED' },
    { icon: Zap, text: 'INSTANT' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mt-auto">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-1.5 bg-orange-50/50 px-2 py-1 rounded-full border border-orange-100/50 shadow-sm transition-all hover:bg-orange-50">
          <badge.icon className="w-3 h-3 text-orange-500" />
          <span className="text-[9px] font-black text-orange-700 tracking-tight leading-none">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export function SeasonalPackages() {
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

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center md:text-left">
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              LIMITED TIME OFFERS
            </span>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">Seasonal Special Packages</h2>
          </div>
          <p className="text-gray-500 font-bold max-w-md">
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
              <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">{deal.title}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed font-medium">
                {deal.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto bg-white/40 p-4 rounded-2xl border border-black/5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Starting Price</div>
                  <div className="text-xl font-black text-gray-900">{deal.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Availability</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900 justify-end">
                    <Calendar className="w-4 h-4" />
                    {deal.period}
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-white text-gray-900 font-black py-4 rounded-2xl transition-all border border-black/5 flex items-center justify-center gap-2 hover:bg-black hover:text-white group">
                SECURE DATE
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PaymentOptions() {
  const options = [
    { name: 'Credit Card', icon: CreditCard, desc: 'Secure payment' },
    { name: 'Direct Debit', icon: Zap, desc: 'For subscriptions' },
    { name: 'Klarna', icon: Clock, desc: 'Pay in 3' },
    { name: 'Apple Pay', icon: Award, desc: 'Instant checkout' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl">
          <option.icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-600">{option.name}</span>
        </div>
      ))}
    </div>
  );
}

export function LowAvailabilityAlert({ slots = 3 }: { slots?: number }) {
  return (
    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4">
      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h5 className="font-bold text-red-900">Limited Availability</h5>
        <p className="text-red-700 text-sm">Only {slots} booking slots remaining for this package this month.</p>
      </div>
    </div>
  );
}
