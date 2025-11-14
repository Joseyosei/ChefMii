import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FAQ = () => {
  const faqs = {
    general: [
      {
        q: "How far in advance should I book a chef?",
        a: "We recommend booking at least 2-3 weeks in advance for the best selection of chefs. However, last-minute bookings are often possible depending on chef availability. For large events like weddings or corporate functions, booking 2-3 months ahead is ideal."
      },
      {
        q: "What areas do you serve?",
        a: "ChefMe operates globally in over 120 countries. Simply enter your location when searching, and we'll show you available chefs in your area. If you're in a remote location, we can arrange for chefs to travel to you."
      },
      {
        q: "How does pricing work?",
        a: "Pricing varies based on the chef's experience, cuisine type, number of guests, and menu complexity. All prices shown include ingredients, preparation, service, and cleanup. You'll see the full cost breakdown before booking, with no hidden fees."
      }
    ],
    payment: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, PayPal, and bank transfers. Payment is processed securely through our platform. A deposit is required to confirm your booking, with the balance due before your event."
      },
      {
        q: "What is your cancellation policy?",
        a: "You can cancel up to 7 days before your event for a full refund. Cancellations 3-7 days before receive a 50% refund. Within 3 days, the deposit is non-refundable. However, you can reschedule at no extra cost if done at least 48 hours in advance."
      },
      {
        q: "Do prices include ingredients?",
        a: "Yes, most packages include the cost of ingredients. Your chef will purchase fresh, high-quality ingredients as part of their service. Premium ingredients or special requests may incur additional costs, which will be discussed beforehand."
      }
    ],
    safety: [
      {
        q: "How are chefs vetted?",
        a: "All ChefMe chefs undergo a comprehensive vetting process including background checks, credential verification, food safety certifications, and reference checks. We also review their culinary training, experience, and customer feedback before approval."
      },
      {
        q: "What if I have food allergies?",
        a: "Absolutely inform your chef about any allergies or dietary restrictions during booking. All our chefs are trained in allergen awareness and will create menus that safely accommodate your needs. This includes cross-contamination prevention."
      },
      {
        q: "Are chefs insured?",
        a: "Yes, all ChefMe chefs carry professional liability insurance and food safety certifications. They're also covered by our platform guarantee, which protects you in the unlikely event of any issues."
      }
    ],
    booking: [
      {
        q: "Can I customize the menu?",
        a: "Absolutely! One of the main benefits of hiring a private chef is menu customization. You'll work directly with your chef to create a menu that matches your preferences, dietary needs, and occasion. Most chefs offer a consultation call before your event."
      },
      {
        q: "What happens if my chef cancels?",
        a: "In the rare event a chef must cancel, we'll immediately find you a replacement chef of equal or higher caliber at no additional cost. If we can't find a suitable replacement, you'll receive a full refund plus a discount on your next booking."
      },
      {
        q: "Can I book for outside the UK?",
        a: "Yes! ChefMe operates globally. We have chefs available in major cities worldwide. For international bookings, check the chef's travel availability and any additional travel costs, which will be clearly stated before booking."
      },
      {
        q: "Do I need to provide kitchen equipment?",
        a: "Chefs typically use your existing kitchen equipment. If specialized equipment is needed (like professional-grade blenders or specific cookware), your chef will either bring it or discuss equipment rental, which may be included in the package or added to the cost."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about booking chefs through ChefMe
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search FAQs..." className="pl-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">General Questions</h2>
              <Accordion type="single" collapsible>
                {faqs.general.map((faq, i) => (
                  <AccordionItem key={i} value={`general-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Payment & Pricing</h2>
              <Accordion type="single" collapsible>
                {faqs.payment.map((faq, i) => (
                  <AccordionItem key={i} value={`payment-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Safety & Quality</h2>
              <Accordion type="single" collapsible>
                {faqs.safety.map((faq, i) => (
                  <AccordionItem key={i} value={`safety-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Booking Process</h2>
              <Accordion type="single" collapsible>
                {faqs.booking.map((faq, i) => (
                  <AccordionItem key={i} value={`booking-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </a>
            <a href="mailto:support@chefme.com">
              <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Email Us
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
