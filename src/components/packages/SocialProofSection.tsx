'use client';

import { Calendar, Star, TrendingUp, Users } from 'lucide-react';

const stats = [
  { label: 'Events Delivered', value: '2,500+', icon: Calendar },
  { label: 'Satisfaction Rate', value: '98.7%', icon: Star },
  { label: 'GMV Processed', value: '£2.3M', icon: TrendingUp },
  { label: 'Repeat Booking Rate', value: '45%', icon: Users },
];

const companies = [
  'Google', 'Meta', 'Barclays', 'BBC', 'Harrods', 'Selfridges', 'Deloitte'
];

export default function SocialProofSection() {
  return (
    <div className="bg-gray-50 py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logos */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            {companies.map((company) => (
              <span key={company} className="text-xl md:text-2xl font-bold text-gray-800">
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
