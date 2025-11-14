import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Globe, Users, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About ChefMe</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're on a mission to democratize exceptional dining experiences and make 
              world-class culinary talent accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why We Built ChefMe</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                ChefMe was born from a simple belief: exceptional food should be accessible to everyone, 
                not just the wealthy or those in major cities. We saw a gap between talented chefs looking 
                for opportunities and people wanting memorable dining experiences.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Whether you're a college student craving home-cooked meals, a family celebrating a milestone, 
                or an organization hosting a presidential banquet, ChefMe connects you with the perfect 
                culinary professional for your occasion.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've created a platform that empowers chefs to build their businesses while giving clients 
                unprecedented access to culinary talent across budgets, cuisines, and locations worldwide.
              </p>
            </div>
            <Card className="p-8 bg-primary/5 border-primary/20">
              <blockquote className="text-2xl font-semibold mb-4 text-foreground/90 leading-relaxed">
                "Every occasion deserves a chef. Every chef deserves opportunity."
              </blockquote>
              <p className="text-muted-foreground">— The ChefMe Team</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Passion for Food",
                desc: "We celebrate culinary excellence and the art of creating memorable dining experiences"
              },
              {
                icon: Globe,
                title: "Global Access",
                desc: "Breaking down barriers to connect chefs and clients across borders and budgets"
              },
              {
                icon: Users,
                title: "Community First",
                desc: "Building a trusted community of chefs and clients who value quality and authenticity"
              },
              {
                icon: TrendingUp,
                title: "Chef Empowerment",
                desc: "Providing chefs with tools and opportunities to grow their careers and businesses"
              },
            ].map((value, i) => (
              <Card key={i} className="p-6 text-center hover-lift">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">By the Numbers</h2>
              <p className="text-xl text-muted-foreground">Our impact in the culinary community</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "5,000+", label: "Professional Chefs" },
                { number: "50,000+", label: "Happy Clients" },
                { number: "120+", label: "Countries Served" },
                { number: "4.9/5", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the ChefMe Family</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you're looking to hire a chef or become one, we'd love to have you with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary">Find a Chef</Button>
            </Link>
            <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Become a Chef
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
