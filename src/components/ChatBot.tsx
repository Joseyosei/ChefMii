import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const responses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm ChefMii Assistant. How can I help you today?",
    "Hi there! Welcome to ChefMii. What can I assist you with?",
    "Welcome! I'm here to help you find the perfect chef or answer any questions.",
  ],
  chefs: [
    "We have over 500 professional chefs from around the world! You can browse them at /chefs. Filter by cuisine type (Italian, Japanese, Nigerian, Mexican, etc.), dietary requirements, and location. Each chef has their own profile with reviews, specialties, and pricing.",
  ],
  booking: [
    "Booking a chef is easy! 1) Browse our chefs at /chefs, 2) Select a chef you like, 3) Choose a package (Intimate Dinner, Family Feast, Party Package, or Corporate Event), 4) Pick your date and time, 5) Complete payment. Your chef will arrive with fresh ingredients and equipment!",
  ],
  pricing: [
    "Our pricing varies by package:\n• Intimate Dinner (2-4 guests): from £150\n• Family Feast (5-8 guests): from £300\n• Party Package (10-15 guests): from £500\n• Corporate Event (15+ guests): from £800\n\nAll prices include chef service, ingredients, and cleanup!",
  ],
  packages: [
    "We offer several packages:\n• Student Survival Meals: £50-£100/week\n• Family Chef Plans: Perfect for busy families\n• Event Chef Services: For parties and celebrations\n• VIP Chef Experiences: Premium dining at home\n\nVisit /packages for more details!",
  ],
  academy: [
    "ChefMii Academy offers professional chef training, culinary certifications, and masterclasses taught by expert chefs. Whether you're a beginner or looking to enhance your skills, we have courses for everyone. Visit /academy to explore!",
  ],
  marketplace: [
    "Our Marketplace features chef-created products including artisan sauces, premium spices, recipe books, meal kits, and professional cookware. All products are curated by our verified chefs. Browse at /marketplace!",
  ],
  shop: [
    "The ChefMii Shop has premium chefwear, stylish aprons, kitchen accessories, and gourmet gift sets. Perfect for aspiring chefs or as gifts! Check it out at /shop.",
  ],
  kids: [
    "Kids' Zone is our Mini Chefs Academy! We offer fun cooking lessons for children, interactive games, cooking videos, and birthday party bookings. A great way to get kids excited about cooking! Visit /kids-zone.",
  ],
  dietary: [
    "We cater to all dietary requirements! Our chefs can prepare:\n• Vegan & Vegetarian meals\n• Halal & Kosher options\n• Gluten-free dishes\n• Dairy-free menus\n• Nut-free preparations\n\nJust filter by dietary requirements when browsing chefs!",
  ],
  cuisines: [
    "We have chefs specializing in cuisines from around the world:\n• European: Italian, French, British, Spanish, Portuguese, Dutch, Irish\n• Asian: Japanese, Chinese, South Korean, Vietnamese, Indian\n• African: Nigerian, South African, Ivorian\n• Americas: Mexican, Brazilian, Canadian\n• Middle Eastern: Arab cuisines\n\nAnd many more! Use the cuisine filter at /chefs to find your perfect match.",
  ],
  account: [
    "You can manage your account in the dashboard. Here you can:\n• View and manage bookings\n• Update your profile and photo\n• Chat with chefs\n• Track loyalty rewards\n• Change notification settings\n\nLog in to access your dashboard!",
  ],
  contact: [
    "Need help? You can:\n• Email us at support@chefmii.com\n• Chat with me anytime!\n• Visit /contact for our contact form\n• Check /faq for frequently asked questions",
  ],
  default: [
    "I'd be happy to help! You can ask me about:\n• Finding and booking chefs\n• Our packages and pricing\n• ChefMii Academy courses\n• Marketplace products\n• Dietary requirements\n• Kids' Zone activities\n\nWhat would you like to know?",
  ],
};

const getKeywords = (text: string): string[] => {
  const lower = text.toLowerCase();
  const keywords: string[] = [];
  
  if (lower.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) keywords.push("greeting");
  if (lower.match(/\b(chef|chefs|cook|cooks|find|browse|search)\b/)) keywords.push("chefs");
  if (lower.match(/\b(book|booking|reserve|reservation|how to book)\b/)) keywords.push("booking");
  if (lower.match(/\b(price|pricing|cost|how much|rates|fee|fees)\b/)) keywords.push("pricing");
  if (lower.match(/\b(package|packages|plan|plans|tier|tiers)\b/)) keywords.push("packages");
  if (lower.match(/\b(academy|training|course|courses|learn|certification|class|classes)\b/)) keywords.push("academy");
  if (lower.match(/\b(marketplace|products|sauce|spice|recipe|meal kit|cookware)\b/)) keywords.push("marketplace");
  if (lower.match(/\b(shop|merchandise|apron|gift|chefwear|accessory|accessories)\b/)) keywords.push("shop");
  if (lower.match(/\b(kid|kids|children|child|mini chef|birthday|party for kids)\b/)) keywords.push("kids");
  if (lower.match(/\b(dietary|vegan|vegetarian|halal|kosher|gluten|dairy|nut|allergy|allergies)\b/)) keywords.push("dietary");
  if (lower.match(/\b(cuisine|cuisines|italian|japanese|indian|mexican|nigerian|french|chinese|korean)\b/)) keywords.push("cuisines");
  if (lower.match(/\b(account|profile|dashboard|settings|password|login)\b/)) keywords.push("account");
  if (lower.match(/\b(contact|support|help|email|phone)\b/)) keywords.push("contact");
  
  return keywords;
};

const getResponse = (userMessage: string): string => {
  const keywords = getKeywords(userMessage);
  
  if (keywords.length === 0) {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
  
  const responseTexts: string[] = [];
  keywords.slice(0, 2).forEach(keyword => {
    const possibleResponses = responses[keyword];
    if (possibleResponses) {
      responseTexts.push(possibleResponses[Math.floor(Math.random() * possibleResponses.length)]);
    }
  });
  
  return responseTexts.join("\n\n") || responses.default[0];
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm ChefMii Assistant. How can I help you today? I can assist you with finding the perfect chef, exploring our services (Academy, Marketplace, Shop, Kids' Zone), pricing information, or answering any questions about ChefMii's global platform.",
    },
  ]);

  // Hide on packages page where AI Event Concierge is present
  if (location.pathname === "/packages") {
    return null;
  }
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const response = getResponse(input);
    
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="icon"
          data-chat-trigger
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50 fade-in">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">ChefMii Assistant</h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isTyping || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
