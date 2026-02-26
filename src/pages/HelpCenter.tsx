import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Book, Shield, CreditCard, User, HelpCircle, MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HelpCenter = () => {
  const categories = [
    { 
      icon: Book, 
      title: "Booking & Cancellations", 
      desc: "Learn how to manage your chef reservations and understand our flexible cancellation policies.",
      links: ["How to book a chef", "Modifying a booking", "Cancellation & refunds"]
    },
    { 
      icon: Shield, 
      title: "Safety & Security", 
      desc: "Details on our multi-layered vetting process, DBS checks, and the ChefMii Shield guarantee.",
      links: ["Our vetting process", "Insurance coverage", "Reporting a concern"]
    },
    { 
      icon: CreditCard, 
      title: "Payments & Pricing", 
      desc: "Information about service fees, deposits, and how our secure payment system works.",
      links: ["Pricing breakdown", "Payment methods", "When you get charged"]
    },
    { 
      icon: User, 
      title: "Account & Profile", 
      desc: "Everything you need to know about managing your personal details and chef preferences.",
      links: ["Updating profile", "Password security", "Notification settings"]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-[#EA580C] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">How can we help you today?</h1>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EA580C] h-6 w-6" />
              <Input 
                className="h-16 pl-14 pr-6 rounded-full text-lg shadow-xl border-none text-black focus-visible:ring-white" 
                placeholder="Search for articles, guides, or questions..." 
              />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((cat, i) => (
                <div key={i} className="flex flex-col group">
                  <div className="w-14 h-14 rounded-2xl bg-[#EA580C]/10 flex items-center justify-center mb-6 group-hover:bg-[#EA580C] transition-colors duration-300">
                    <cat.icon className="h-7 w-7 text-[#EA580C] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{cat.desc}</p>
                  <ul className="space-y-3">
                    {cat.links.map((link, j) => (
                      <li key={j}>
                        <a href="#" className="text-sm font-medium text-[#EA580C] hover:underline flex items-center gap-2">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Questions */}
        <section className="py-20 bg-[#EA580C]/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Popular Questions</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {[
                "How do I become a verified chef on ChefMii?",
                "What's included in the ingredient sourcing service?",
                "Can I book a chef for a destination event?",
                "How do I apply a promotional code?",
                "What happens if my chef is unwell?",
                "How do I leave a review for my chef?"
              ].map((q, i) => (
                <Card key={i} className="p-6 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group">
                  <span className="font-medium">{q}</span>
                  <HelpCircle className="h-5 w-5 text-muted-foreground group-hover:text-[#EA580C] transition-colors" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help? */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-xl text-muted-foreground mb-12">Our support team is available 24/7 to assist you.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button variant="outline" size="lg" className="h-16 px-8 rounded-full gap-2 border-2 hover:bg-[#EA580C] hover:text-white hover:border-[#EA580C] transition-all">
                <MessageCircle className="h-5 w-5" /> Live Chat
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-8 rounded-full gap-2 border-2 hover:bg-[#EA580C] hover:text-white hover:border-[#EA580C] transition-all">
                <Phone className="h-5 w-5" /> Request a Call
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-8 rounded-full gap-2 border-2 hover:bg-[#EA580C] hover:text-white hover:border-[#EA580C] transition-all">
                <HelpCircle className="h-5 w-5" /> Email Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
