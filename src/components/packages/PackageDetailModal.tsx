import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Check, ChefHat, Users, Clock, Utensils, Info, 
  Star, Image as ImageIcon, MessageSquare, ShieldCheck, 
  Zap, Calendar, ArrowRight, Play, Heart, Share2
} from 'lucide-react';

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: any;
}

export const samplePackageData = {
  id: 'wedding-feast',
  name: 'Wedding Feast Package',
  tagline: 'Elegant multi-course dining for your special day',
  priceRange: '£3,000 - £15,000',
  pricePerHead: 'From £75',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  description: 'Our flagship wedding experience, designed to impress. We handle everything from menu design to kitchen clean-up, allowing you to focus on your celebration.',
  features: {
    chefLevel: 'Senior / Michelin',
    courses: '4-7 Courses',
    serviceStaff: 'Included',
    equipment: 'Professional Grade'
  },
  whatsIncluded: [
    'Professional Chef Service',
    'Custom Menu Design',
    'All Ingredients & Preparation',
    'Tableware & Premium Linen',
    'Kitchen Setup & Deep Clean',
    'Dietary Requirements Handling',
    'Wait Staff (1 per 10 guests)',
    'Event Coordinator Support'
  ],
  sampleMenu: [
    {
      course: 'Amuse-Bouche',
      dish: 'Truffle-Infused Wild Mushroom Arancini with Garlic Aioli',
      desc: 'A bite-sized explosion of earthy flavors'
    },
    {
      course: 'Starter',
      dish: 'Oak-Smoked Scottish Salmon',
      desc: 'With pickled cucumber, dill oil, and pumpernickel soil'
    },
    {
      course: 'Main',
      dish: 'Herb-Crusted Rack of Lamb',
      desc: 'Dauphinoise potatoes, mint pea purée, and red wine jus'
    },
    {
      course: 'Dessert',
      dish: 'Deconstructed Lemon Meringue Pie',
      desc: 'Lemon curd, charred meringue, and basil shortbread'
    }
  ],
  reviews: [
    { name: 'Sarah J.', rating: 5, text: 'The food was the highlight of our wedding! Exceptional service.' },
    { name: 'Michael R.', rating: 5, text: 'Chef Marco was professional and the presentation was michelin-star quality.' }
  ],
  faqs: [
    { q: 'Can you cater for vegan guests?', a: 'Absolutely. We provide bespoke alternatives for all dietary needs.' },
    { q: 'What equipment do you need?', a: 'We typically use your kitchen but bring all specialized culinary tools.' }
  ]
};

export default function PackageDetailModal({ isOpen, onClose, packageData }: PackageDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const data = packageData || samplePackageData;

  if (!isOpen) return null;

  const handleBookNow = () => {
    navigate(`/find-chefs?package=${data.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left Side: Hero & Quick Info */}
        <div className="md:w-2/5 relative overflow-hidden flex flex-col">
          <img 
            src={data.heroImage} 
            alt={data.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="relative z-10 p-8 mt-auto text-white">
            <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4">
              <Star className="w-3 h-3 fill-white" />
              TOP RATED EXPERIENCE
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-tight">{data.name}</h2>
            <p className="text-white/80 font-bold mb-6 italic">{data.tagline}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <ChefHat className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-[10px] uppercase font-black tracking-widest text-white/60">Chef Level</div>
                <div className="text-sm font-bold">{data.features.chefLevel}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <Utensils className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-[10px] uppercase font-black tracking-widest text-white/60">Courses</div>
                <div className="text-sm font-bold">{data.features.courses}</div>
              </div>
            </div>

              <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimate Price</div>
                  <div className="text-2xl font-black text-gray-900">{data.pricePerHead}</div>
                  <div className="text-gray-400 text-[10px] font-bold">per person</div>
                </div>
                <button 
                  onClick={handleBookNow}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl transition-all shadow-lg shadow-orange-500/30"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>


          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors z-20 md:hidden"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Right Side: Details & Tabs */}
        <div className="md:w-3/5 flex flex-col bg-white">
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
              {['overview', 'menus', 'reviews', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all shrink-0 ${
                    activeTab === tab ? 'border-orange-500 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden md:block"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-6">The Experience</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                  {data.description}
                </p>

                <div className="mb-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                    <Check className="w-5 h-5 text-orange-500" />
                    What's Included
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {data.whatsIncluded.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                    <ShieldCheck className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-[10px] font-black uppercase text-gray-400">Insured</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                    <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-[10px] font-black uppercase text-gray-400">Instant</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                    <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-[10px] font-black uppercase text-gray-400">Flexible</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'menus' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Sample Menu</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 border border-orange-500 px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                    Download Full Menu
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.sampleMenu.map((item: any, i: number) => (
                    <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-orange-200 transition-all">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm font-black text-orange-500">
                        0{i + 1}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">{item.course}</div>
                        <h5 className="font-black text-gray-900 mb-1">{item.dish}</h5>
                        <p className="text-gray-500 text-xs font-medium italic">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-8">Client Feedback</h3>
                <div className="space-y-6">
                  {data.reviews.map((review: any, i: number) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-900 font-bold mb-4 italic">"{review.text}"</p>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">- {review.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-8">Frequently Asked</h3>
                <div className="space-y-4">
                  {data.faqs.map((faq: any, i: number) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <h5 className="font-black text-gray-900 mb-2">{faq.q}</h5>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleBookNow}
                className="flex-1 bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 text-lg group"
              >
                BUILD YOUR QUOTE
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex-1 bg-white text-gray-900 border border-gray-200 font-black py-5 rounded-2xl hover:bg-gray-50 transition-all text-lg">
                REQUEST CALLBACK
              </button>
            </div>

        </div>
      </div>
    </div>
  );
}
