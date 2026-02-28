import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Handshake, Globe, TrendingUp, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Partnerships = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Connect with culinary professionals and clients in over 50 countries."
    },
    {
      icon: Handshake,
      title: "Mutual Growth",
      desc: "Benefit from shared marketing resources and collaborative growth strategies."
    },
    {
      icon: TrendingUp,
      title: "Brand Elevation",
      desc: "Associate your brand with the world's most premium culinary network."
    },
    {
      icon: Users,
      title: "Network Access",
      desc: "Instant access to a community of elite chefs and high-value clients."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-foreground text-background overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EA580C]/10 skew-x-12 translate-x-1/4" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Grow Your Brand with ChefMii
              </h1>
              <p className="text-xl text-background/80 mb-10 max-w-xl">
                Join our ecosystem of culinary excellence. We partner with farmers, equipment manufacturers, and luxury brands to deliver unforgettable experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-8 rounded-full h-14 text-lg">
                  Become a Partner
                </Button>
                <Button size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground px-8 rounded-full h-14 text-lg">
                  View Our Partners
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with Us?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in creating synergies that provide value to both our partners and our community.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="p-8 rounded-2xl bg-accent/30 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#EA580C]/20">
                  <div className="w-12 h-12 rounded-xl bg-[#EA580C] flex items-center justify-center mb-6">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-20 bg-[#EA580C]/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Ways to Partner</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "For Farmers & Vendors",
                  desc: "Supply fresh, high-quality ingredients directly to our elite chefs and marketplace.",
                  items: ["Direct supply chain", "Automated ordering", "Market insights"]
                },
                {
                  title: "For Equipment Brands",
                  desc: "Feature your premium culinary tools and appliances in our academy and chef profiles.",
                  items: ["Product placement", "Educational content", "Affiliate program"]
                },
                {
                  title: "For Luxury Brands",
                  desc: "Co-host exclusive events and provide unique experiences for high-net-worth clients.",
                  items: ["VIP event hosting", "Brand activations", "Exclusive offers"]
                }
              ].map((type, i) => (
                <Card key={i} className="p-8 flex flex-col hover:border-[#EA580C] transition-colors">
                  <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                  <p className="text-muted-foreground mb-8 flex-grow">{type.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {type.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#EA580C]" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">Let's Build Something Together</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Ready to take your brand to the next level? Our partnership team is waiting to hear from you.
            </p>
            <form className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto bg-accent/30 p-8 rounded-3xl border border-border/50">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider opacity-60">Your Name</label>
                <input className="w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider opacity-60">Company Email</label>
                <input className="w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20" placeholder="john@company.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold uppercase tracking-wider opacity-60">Partnership Type</label>
                <select className="w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20">
                  <option>Vendor/Supplier</option>
                  <option>Equipment/Tech</option>
                  <option>Luxury/Experience</option>
                  <option>Affiliate/Media</option>
                </select>
              </div>
              <Button className="md:col-span-2 h-14 bg-[#EA580C] hover:bg-[#C2410C] text-lg font-bold rounded-xl mt-4">
                Submit Inquiry
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Partnerships;
