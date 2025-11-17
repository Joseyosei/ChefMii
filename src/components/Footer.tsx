import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Footer = () => {
  return <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 inline-block">
              ChefMe
            </span>
            <p className="text-background/80 text-sm">
              Connecting you with exceptional chefs for every occasion, anywhere in the world.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-background/80 hover:text-background text-sm">About Us</Link></li>
              <li><Link to="/packages" className="text-background/80 hover:text-background text-sm">Packages</Link></li>
              <li><Link to="/chefs" className="text-background/80 hover:text-background text-sm">Find Chefs</Link></li>
              <li><Link to="/faq" className="text-background/80 hover:text-background text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-background/80 hover:text-background text-sm">Contact Us</Link></li>
              <li><a href="#" className="text-background/80 hover:text-background text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-background/80 hover:text-background text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-background/80 hover:text-background text-sm">Become a Chef</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-background/80 text-sm mb-4">
              Get the latest updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background/10 border-background/20 text-background placeholder:text-background/50" />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2026ChefMe. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/60 hover:text-background transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;