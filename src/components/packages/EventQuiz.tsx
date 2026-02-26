'use client';

import { useState } from 'react';
import { PartyPopper, Users, Sparkles, PoundSterling, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const questions = [
  {
    id: 'occasion',
    text: "What's the occasion?",
    subtitle: "This helps us recommend the right experience level",
    icon: PartyPopper,
    options: [
      { label: 'Wedding Reception', value: 'wedding', icon: '💍' },
      { label: 'Birthday Celebration', value: 'birthday', icon: '🎂' },
      { label: 'Corporate Event', value: 'corporate', icon: '📊' },
      { label: 'Private Dinner Party', value: 'dinner', icon: '🍽️' }
    ]
  },
  {
    id: 'guests',
    text: "How many guests?",
    subtitle: "Include yourself in the count",
    icon: Users,
    options: [
      { label: 'Intimate (2-10)', value: 'small', icon: '🏠' },
      { label: 'Medium (10-50)', value: 'medium', icon: '🏢' },
      { label: 'Large (50-150)', value: 'large', icon: '🏛️' },
      { label: 'Grand (150+)', value: 'grand', icon: '🏰' }
    ]
  },
  {
    id: 'vibe',
    text: "What's the vibe?",
    subtitle: "Set the tone for your event",
    icon: Sparkles,
    options: [
      { label: 'Relaxed & Casual', value: 'casual', icon: '👕' },
      { label: 'Elegant & Professional', value: 'elegant', icon: '👔' },
      { label: 'Luxury & VIP', value: 'luxury', icon: '👑' },
      { label: 'Fun & High Energy', value: 'fun', icon: '🎈' }
    ]
  },
  {
    id: 'budget',
    text: "Budget per person?",
    subtitle: "This includes food, chef, and service",
    icon: PoundSterling,
    options: [
      { label: 'Under £50', value: 'budget', icon: '💰' },
      { label: '£50 - £100', value: 'standard', icon: '💵' },
      { label: '£100 - £200', value: 'premium', icon: '💳' },
      { label: '£200+', value: 'luxury', icon: '💎' }
    ]
  }
];

export default function EventQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendation = () => {
    if (answers.vibe === 'luxury' || answers.budget === 'luxury') return 'Luxury';
    if (answers.occasion === 'wedding' || answers.budget === 'premium') return 'Premium';
    return 'Essential';
  };

  if (isFinished) {
    const recommendation = getRecommendation();
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-100 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">We found your match!</h3>
        <p className="text-gray-600 mb-8">Based on your preferences, we recommend the:</p>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-sm font-medium uppercase tracking-widest mb-2">Recommended Package</div>
          <div className="text-4xl font-bold mb-4">{recommendation} Package</div>
          <p className="text-orange-100 text-sm">Perfect for your upcoming {answers.occasion} celebration.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
            View Package Details
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setAnswers({});
              setCurrentStep(0);
              setIsFinished(false);
            }}
            className="text-gray-500 font-medium px-8 py-4 hover:text-gray-900 transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-100 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mb-6">
            <question.icon className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{question.text}</h3>
          <p className="text-gray-600">{question.subtitle}</p>
          
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="mt-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Question
            </button>
          )}
        </div>

        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="group p-6 text-left border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{option.icon}</div>
              <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
