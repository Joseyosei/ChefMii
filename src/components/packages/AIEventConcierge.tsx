import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, ChefHat, Calendar, Users, MapPin, Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  packageRecommendation?: {
    name: string;
    price: string;
    description: string;
    chefMatch?: string;
  };
}

interface EventDetails {
  eventType?: string;
  guests?: number;
  date?: string;
  location?: string;
  budget?: string;
  cuisine?: string;
  dietary?: string[];
}

export default function AIEventConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Event Concierge 🍽️ Tell me about your event and I'll recommend the perfect package and chef for you. What kind of occasion are you planning?",
      timestamp: new Date(),
      suggestions: ['Wedding reception', 'Birthday dinner', 'Corporate event', 'Intimate dinner party']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();
    let response: Partial<Message> = { role: 'assistant', timestamp: new Date(), id: Date.now().toString() };

    // Parse user input and update event details
    const updatedDetails = { ...eventDetails };
    
    // Detect event type
    if (lowerMessage.includes('wedding')) {
      updatedDetails.eventType = 'wedding';
    } else if (lowerMessage.includes('birthday')) {
      updatedDetails.eventType = 'birthday';
    } else if (lowerMessage.includes('corporate') || lowerMessage.includes('office') || lowerMessage.includes('conference')) {
      updatedDetails.eventType = 'corporate';
    } else if (lowerMessage.includes('dinner party') || lowerMessage.includes('intimate')) {
      updatedDetails.eventType = 'dinner_party';
    }

    // Detect guest count
    const guestMatch = lowerMessage.match(/(\d+)\s*(guests?|people|persons?)/);
    if (guestMatch) {
      updatedDetails.guests = parseInt(guestMatch[1]);
    }

    // Detect budget
    const budgetMatch = lowerMessage.match(/£(\d+[,\d]*)/);
    if (budgetMatch) {
      updatedDetails.budget = budgetMatch[1].replace(',', '');
    }

    // Detect cuisine preferences
    const cuisines = ['italian', 'french', 'mediterranean', 'asian', 'indian', 'british', 'fusion'];
    cuisines.forEach(cuisine => {
      if (lowerMessage.includes(cuisine)) {
        updatedDetails.cuisine = cuisine;
      }
    });

    // Detect location
    const locations = ['london', 'surrey', 'kent', 'essex', 'hampshire', 'oxford', 'cambridge'];
    locations.forEach(location => {
      if (lowerMessage.includes(location)) {
        updatedDetails.location = location.charAt(0).toUpperCase() + location.slice(1);
      }
    });

    setEventDetails(updatedDetails);

    // Generate contextual response
    if (!updatedDetails.eventType) {
      response.content = "That sounds exciting! What type of event are you planning? Is it a wedding, birthday celebration, corporate event, or something else?";
      response.suggestions = ['Wedding reception', 'Birthday party', 'Corporate lunch', 'Private dinner party', 'Anniversary celebration'];
    } else if (!updatedDetails.guests) {
      response.content = `A ${updatedDetails.eventType.replace('_', ' ')}! Wonderful choice. How many guests are you expecting?`;
      response.suggestions = ['10-20 guests', '20-50 guests', '50-100 guests', '100+ guests'];
    } else if (!updatedDetails.budget) {
      response.content = `Perfect, ${updatedDetails.guests} guests. What's your approximate budget for the catering? This helps me recommend the right package.`;
      response.suggestions = ['Under £1,000', '£1,000 - £3,000', '£3,000 - £5,000', '£5,000 - £10,000', '£10,000+'];
    } else if (!updatedDetails.cuisine) {
      response.content = "Great! Any cuisine preferences? Or would you like me to suggest some options based on your event?";
      response.suggestions = ['Modern British', 'Italian', 'French fine dining', 'Mediterranean', 'Fusion', 'No preference'];
    } else {
      // We have enough info - make a recommendation
      const budget = parseInt(updatedDetails.budget);
      let recommendedPackage = {
        name: 'Birthday Bash Package',
        price: '£400 - £2,000',
        description: 'Perfect for celebrations with friends and family',
        chefMatch: 'Chef Maria Santos (Italian Specialist)'
      };

      if (updatedDetails.eventType === 'wedding') {
        recommendedPackage = {
          name: 'Wedding Feast Package',
          price: '£3,000 - £15,000',
          description: 'Elegant multi-course dining for your special day',
          chefMatch: 'Chef Marcus Thompson (Fine Dining Expert)'
        };
      } else if (updatedDetails.eventType === 'corporate') {
        recommendedPackage = {
          name: 'Conference Chef Services',
          price: '£2,000 - £10,000',
          description: 'Professional catering that impresses clients and teams',
          chefMatch: 'Chef Alexandra Chen (Corporate Events Specialist)'
        };
      } else if (budget > 5000) {
        recommendedPackage = {
          name: 'Michelin-at-Home Experience',
          price: '£1,500 - £7,000 per night',
          description: 'Luxury dining experience with tasting menus',
          chefMatch: 'Chef Jean-Pierre Dubois (Michelin-trained)'
        };
      }

      response.content = `Based on your ${updatedDetails.eventType?.replace('_', ' ')} for ${updatedDetails.guests} guests in ${updatedDetails.location || 'your area'} with a budget around £${parseInt(updatedDetails.budget).toLocaleString()}, I recommend:`;
      response.packageRecommendation = recommendedPackage;
      response.suggestions = ['Book this package', 'See alternative options', 'Get a detailed quote', 'View chef profile'];
    }

    return response as Message;
  };

  const handleSend = async (message?: string) => {
    const text = message || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const response = await generateResponse(text);
    setIsTyping(false);
    setMessages(prev => [...prev, response]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Book this package' || suggestion === 'View chef profile') {
      const pkgId = messages.find(m => m.packageRecommendation)?.packageRecommendation?.name.toLowerCase().replace(/ /g, '-');
      navigate(`/find-chefs?package=${pkgId}`);
      setIsOpen(false);
      return;
    }
    handleSend(suggestion);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:px-6 md:py-4 rounded-full shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transition-all ${isOpen ? 'hidden' : 'flex'} items-center gap-3 group`}
      >
        <div className="relative flex-shrink-0">
          <MessageCircle className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <span className="font-bold whitespace-nowrap hidden md:block group-hover:block transition-all duration-300 overflow-hidden">
          AI Event Concierge
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '600px', maxHeight: 'calc(100vh - 100px)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">AI Event Concierge</h3>
                <p className="text-orange-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online • Powered by AI
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Event Details Summary (if any) */}
          {Object.keys(eventDetails).length > 0 && (
            <div className="bg-orange-50 px-4 py-2 flex flex-wrap gap-2 text-xs border-b">
              {eventDetails.eventType && (
                <span className="bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-orange-500" />
                  {eventDetails.eventType.replace('_', ' ')}
                </span>
              )}
              {eventDetails.guests && (
                <span className="bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Users className="w-3 h-3 text-orange-500" />
                  {eventDetails.guests} guests
                </span>
              )}
              {eventDetails.location && (
                <span className="bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {eventDetails.location}
                </span>
              )}
              {eventDetails.budget && (
                <span className="bg-white px-2 py-1 rounded-full">
                  £{parseInt(eventDetails.budget).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex items-end gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-gray-200' : 'bg-orange-100'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>

                  {/* Package Recommendation Card */}
                  {message.packageRecommendation && (
                    <div className="mt-3 ml-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <ChefHat className="w-5 h-5 text-orange-400" />
                        <span className="font-bold">{message.packageRecommendation.name}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{message.packageRecommendation.description}</p>
                      <div className="text-orange-400 font-bold text-lg mb-2">{message.packageRecommendation.price}</div>
                      {message.packageRecommendation.chefMatch && (
                        <div className="bg-white/10 rounded-lg px-3 py-2 text-sm">
                          <span className="text-gray-400">Recommended chef: </span>
                          <span className="text-white">{message.packageRecommendation.chefMatch}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.role === 'assistant' && (
                    <div className="mt-3 ml-10 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-orange-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-orange-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your event..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors"
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • Your data is secure
            </p>
          </div>
        </div>
      )}
    </>
  );
}
