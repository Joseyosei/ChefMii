import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustAndSafety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trust & Safety</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your safety and security are our top priorities. We've built a multi-layered verification system to ensure every culinary experience is safe and professional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Verification Status */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Verification Status</h2>
            </div>
            <p className="text-lg mb-8">
              At ChefMii, your safety is our top priority. All chefs undergo a rigorous vetting process before being allowed to list their services.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 rounded-2xl border bg-blue-50/30 border-blue-100">
                <div className="p-2 rounded-full bg-blue-100/50">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Identity Verified</h3>
                  <p className="text-muted-foreground">Passport and proof of address verified</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl border bg-green-50/30 border-green-100">
                <div className="p-2 rounded-full bg-green-100/50">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Enhanced DBS Checked</h3>
                  <p className="text-muted-foreground">Clear criminal record background check</p>
                </div>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold">Certifications</h2>
            </div>
            
            <div className="space-y-3">
              {[
                "Level 2 Food Safety & Hygiene",
                "Public Liability Insurance (£5M)",
                "Professional Culinary Diploma",
                "Enhanced DBS (Background Check) Verified"
              ].map((cert, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border bg-white/50 border-orange-100 hover:border-orange-200 transition-colors">
                  <Award className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Trust Guarantee */}
        <section className="relative overflow-hidden rounded-3xl bg-orange-50 p-8 md:p-12 border border-orange-100">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground text-orange-950">Our Trust Guarantee</h2>
                <p className="text-lg text-orange-900/70 max-w-xl">
                  Every booking is protected by our ChefMii Shield. We handle all payments securely and offer comprehensive insurance coverage for your peace of mind.
                </p>
              </div>
            </div>
            </div>
          </section>
        </main>

      <Footer />
    </div>
  );
};

export default TrustAndSafety;
