import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Maximize2, ChefHat, Bot, User, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'assistant' | 'user';
  content: string;
  isStreaming?: boolean;
}

const SYSTEM_PROMPT = `You are ChefMii Assistant, a friendly and knowledgeable AI assistant for ChefMii - a global platform that connects people with professional chefs for any occasion.

## About ChefMii
ChefMii is a premium chef booking marketplace that connects clients with top chefs globally. From home dinners to presidential banquets, we provide exceptional culinary experiences.

## Our Services

### 1. Find Chefs (Chef Marketplace)
- Search by location, cuisine type, or chef name
- Filter by specialty: Italian, French, Asian, Indian, Mediterranean, British, Fusion, African, Caribbean, Japanese, Thai, Mexican, Middle Eastern, Vegan/Vegetarian
- Chef levels: Certified Chefs (£75/hr), Senior Chefs (£120/hr), Michelin-trained Chefs (£200/hr)
- All chefs are verified, background-checked, and food-safety certified
- Browse chef profiles with reviews, ratings, photos, and sample menus

### 2. Marketplace (Chef Shop)
- Exclusive chef merchandise and kitchen equipment
- Chef-curated ingredient boxes
- Recipe books and cooking guides
- Professional-grade cookware
- Gift cards and vouchers (£25 - £500)

### 3. Event Packages

**Events & Celebrations:**
- Birthday Bash Packages: £400 - £2,000
- Wedding Feast Packages: £3,000 - £15,000 (Most Popular)
- Bridal Shower / Bachelor Party: £700 - £2,500
- Funeral / Remembrance Catering: £1,000 - £4,000
- Baby Shower Brunch: £500 - £1,500
- Anniversary Dinners: £600 - £2,000

**Business & Institutions:**
- Office Lunch Subscriptions: £1,000 - £4,500/month
- Conference Chef Services: £2,000 - £10,000/conference
- School Meal Chefs: £700 - £2,500/week
- Military Mess Hall Chefs: £4,000 - £15,000/month
- Flight Chef Experiences: £2,000 - £7,000/flight

**Luxury, Custom & VIP:**
- Royalty-In-Residence Service: £15,000 - £50,000/month
- Global Travel Chef Companion: £3,000 - £15,000/trip
- Michelin-at-Home Experience: £1,500 - £7,000/night
- Celebrity Wellness Meal Plans: £3,000 - £10,000/month
- Presidential Chef Detail: £20,000 - £70,000/month

### 4. Pricing
- Price per person: £35 - £200+
- Includes: Chef fee, ingredients, travel, cleanup
- Early bird discount: 10% off (30+ days advance)
- Payment: Full (3% off), 50/50 split, Klarna installments

### 5. Chef Media
- Chef videos, recipes, tutorials
- Live streams and cooking demos
- Chef interviews and behind-the-scenes

### 6. Academy
- Professional chef training (6-12 months)
- Home cook courses
- Cuisine masterclasses
- Food safety certifications
- Prices: £199 - £5,000

### 7. Kids' Zone
- Cooking classes (ages 5-17)
- Birthday party packages
- Family workshops
- Holiday camps
- Prices: £25 - £150/session

## Business Subscriptions
- Starter: £1,500/month - 2 events, 25 guests
- Growth: £2,800/month - 4 events, 50 guests (Popular)
- Enterprise: Custom - Unlimited events

## Guarantees
- Satisfaction Guaranteed
- Free Cancellation (7+ days)
- Verified & Insured Chefs

## Stats
- 2,500+ events, 98.7% satisfaction, 500+ chefs, 4.9 rating

Be helpful, friendly, professional. Answer all questions about ChefMii services.`;

const QUICK_REPLIES = [
  { label: '🍽️ Find a Chef', message: 'How can I find a chef for my event?' },
  { label: '💰 Pricing', message: 'What are your pricing options?' },
  { label: '🎉 Event Packages', message: 'Tell me about your event packages' },
  { label: '📅 How to Book', message: 'How do I book a chef?' },
  { label: '🏢 Business Plans', message: 'Tell me about business subscriptions' }
];

import { useLocation } from 'react-router-dom';

export default function ChefMiiAssistant({ apiKey = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide on packages page where AI Event Concierge is present
  if (location.pathname === "/packages") {
    return null;
  }
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm ChefMii Assistant. How can I help you today? I can assist you with finding the perfect chef, exploring our services (Academy, Marketplace, Shop, Kids' Zone), pricing information, or answering any questions about ChefMii's global platform. 🍽️"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    const messageText = text.trim();
    if (!messageText || isTyping) return;

    if (!apiKey || apiKey === "YOUR_HF_API_KEY") {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: messageText },
        { role: 'assistant', content: "I'm currently in demo mode. To enable my full AI capabilities, please configure a Hugging Face API key. I can still help you with basic questions about ChefMii services!" }
      ]);
      setInput('');
      return;
    }
    setInput('');
    setIsTyping(true);

    const newAssistantMessage: Message = { role: 'assistant', content: '', isStreaming: true };
    setMessages(prev => [...prev, newAssistantMessage]);

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'mistralai/Mistral-7B-Instruct-v0.3',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: messageText }
            ],
            max_tokens: 1024,
            temperature: 0.7,
            stream: true
          }),
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) {
                  setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last.role === 'assistant' && last.isStreaming) {
                      return [...prev.slice(0, -1), { ...last, content: last.content + token }];
                    }
                    return prev;
                  });
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Chat Error:', err);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }
        ]);
      }
    } finally {
      setIsTyping(false);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, isStreaming: false }];
        }
        return prev;
      });
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all group flex items-center gap-3"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        <span className="font-bold hidden group-hover:block whitespace-nowrap pr-2">ChefMii Assistant</span>
      </button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-96 flex flex-col shadow-2xl overflow-hidden transition-all ${isMinimized ? 'h-16' : 'h-[600px] max-h-[80vh]'}`}>
      <div 
        className="bg-orange-500 p-4 flex items-center justify-between cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">ChefMii Assistant</h3>
            {!isMinimized && (
              <p className="text-orange-100 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Online • AI Expert
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 bg-gray-50 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-orange-100'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                  }`}>
                    {msg.content}
                    {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-orange-300 animate-pulse align-middle rounded-sm" />}
                  </div>
                </div>
              ))}
              {isTyping && !messages[messages.length-1].isStreaming && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length <= 2 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-gray-50 no-scrollbar">
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(reply.message)}
                  className="whitespace-nowrap bg-white border border-orange-200 text-orange-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-orange-50 transition-colors shadow-sm"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping && !messages[messages.length-1].isStreaming}
              />
              <Button 
                size="icon" 
                onClick={() => isTyping ? handleStop() : sendMessage(input)}
                className={isTyping ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}
              >
                {isTyping ? <X className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by ChefMii AI
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
