import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import chefMiiIcon from "@/assets/chefmii-icon.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Cuisines</h3>
              <ul className="space-y-2">
                <li><Link to="/chefs?q=Italian" className="text-background/80 hover:text-primary text-sm transition-colors">Italian</Link></li>
                <li><Link to="/chefs?q=French" className="text-background/80 hover:text-primary text-sm transition-colors">French</Link></li>
                <li><Link to="/chefs?q=Japanese" className="text-background/80 hover:text-primary text-sm transition-colors">Japanese</Link></li>
                <li><Link to="/chefs?q=Vegan" className="text-background/80 hover:text-primary text-sm transition-colors">Vegan & Plant-Based</Link></li>
                <li><Link to="/chefs?q=Pastry" className="text-background/80 hover:text-primary text-sm transition-colors">Desserts & Pastry</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Areas</h3>
              <ul className="space-y-2">
                <li><Link to="/chefs?q=London" className="text-background/80 hover:text-primary text-sm transition-colors">London</Link></li>
                <li><Link to="/chefs?q=New York" className="text-background/80 hover:text-primary text-sm transition-colors">New York</Link></li>
                <li><Link to="/chefs?q=Paris" className="text-background/80 hover:text-primary text-sm transition-colors">Paris</Link></li>
                <li><Link to="/chefs?q=Dubai" className="text-background/80 hover:text-primary text-sm transition-colors">Dubai</Link></li>
                <li><Link to="/chefs?q=Sydney" className="text-background/80 hover:text-primary text-sm transition-colors">Sydney</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-background/80 hover:text-primary text-sm transition-colors">About ChefMii</Link></li>
                  <li><Link to="/careers" className="text-background/80 hover:text-primary text-sm transition-colors">Careers</Link></li>
                  <li><Link to="/newsroom" className="text-background/80 hover:text-primary text-sm transition-colors">Newsroom</Link></li>
                  <li><Link to="/impact" className="text-background/80 hover:text-primary text-sm transition-colors">Social Impact</Link></li>
                  <li><Link to="/partnerships" className="text-background/80 hover:text-primary text-sm transition-colors">Partnerships</Link></li>
                </ul>
              </div>
  
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/help-center" className="text-background/80 hover:text-primary text-sm transition-colors">Help Center</Link></li>
                  <li><Link to="/trust-and-safety" className="text-background/80 hover:text-primary text-sm transition-colors">Trust & Safety</Link></li>
                <li><Link to="/terms-of-service" className="text-background/80 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-background/80 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/contact" className="text-background/80 hover:text-primary text-sm transition-colors">Contact Support</Link></li>
              </ul>
            </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-primary">Download the ChefMii App</h3>
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store" 
                  className="h-10 w-auto"
                />
              </a>
              <a href="#" className="inline-block transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-primary">
              ChefMii
            </Link>
            <p className="text-background/40 text-xs">
              © 2026 ChefMii. All rights reserved. Made for food lovers worldwide.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-background/40 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
