import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalLiveMap from "@/components/GlobalLiveMap";
import { Navigation, ShieldCheck, Zap } from "lucide-react";

export default function GlobalLiveMapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Live Chef Network</h1>
            <p className="text-muted-foreground max-w-lg">
              Track active chefs in real-time as they bring culinary excellence to your doorstep.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">24/7</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Availability</span>
            </div>
            <div className="h-10 w-[1px] bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">LIVE</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Tracking</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 h-[600px]">
            <GlobalLiveMap />
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Real-time Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Chef on the way</p>
                    <p className="text-xs text-muted-foreground">In-transit to client</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Verified Professional</p>
                    <p className="text-xs text-muted-foreground">Vetted and insured</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground italic">
                  "See exactly when your private chef will arrive. No more guessing."
                </p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-primary text-primary-foreground space-y-4 shadow-xl">
              <h3 className="text-lg font-bold">Ready to cook?</h3>
              <p className="text-sm opacity-90">
                Book a world-class chef for your next dinner party or meal prep.
              </p>
              <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all">
                Find a Chef
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
