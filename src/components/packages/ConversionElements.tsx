'use client';

import { ShieldCheck, Clock, Zap, Award, Calendar } from 'lucide-react';

export function UrgencyBanner() {
  return (
    <div className="bg-orange-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>PEAK SEASON ALERT:</span>
        </div>
        <p className="text-sm font-medium">
          December is 85% booked! Secure your Christmas Party package before November 15th for a 10% early bird discount.
        </p>
        <button className="bg-white text-orange-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-orange-50 transition-colors">
          Claim Discount
        </button>
      </div>
    </div>
  );
}

export function GuaranteeBadges() {
  const badges = [
    { icon: ShieldCheck, text: 'Fully Insured' },
    { icon: Zap, text: 'Instant Quotes' },
    { icon: Award, text: 'Verified Chefs' },
    { icon: Calendar, text: 'Flexible Dates' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2 text-gray-500 font-medium text-sm">
          <badge.icon className="w-5 h-5 text-orange-500" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
