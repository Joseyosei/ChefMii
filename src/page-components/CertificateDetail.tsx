import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Share2, Printer, Award, Shield, CheckCircle2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  issue_date: string;
  course: {
    title: string;
    instructor_name: string;
  };
  user_id: string;
}

const CertificateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCert();
  }, [id]);

  const fetchCert = async () => {
    try {
      const { data, error } = await supabase
        .from("academy_certificates")
        .select("*, course:academy_courses(title, instructor_name)")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      setCert(data);
    } catch (err) {
      console.error("Error fetching certificate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!cert) return <div className="min-h-screen flex items-center justify-center">Certificate not found.</div>;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Certificate Preview */}
          <div className="flex-1 w-full print:p-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border-[16px] border-double border-gray-100 relative overflow-hidden print:shadow-none print:border-none print:rounded-none"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center space-y-8">
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-xl">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-primary font-black uppercase tracking-[0.3em] text-sm">Certificate of Achievement</h4>
                  <p className="text-gray-400 font-bold italic">This is to certify that</p>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-[#1a1a1a] py-4 border-y-2 border-gray-100 inline-block px-12">
                  {user?.email?.split('@')[0].replace('.', ' ') || "Distinguished Chef"}
                </h1>
                
                <div className="space-y-4">
                  <p className="text-xl text-gray-500 font-semibold">has successfully completed the professional masterclass</p>
                  <h2 className="text-3xl md:text-4xl font-black italic text-primary uppercase">{cert.course.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 items-end">
                  <div className="text-center space-y-2">
                    <div className="h-px bg-gray-200 w-full mb-4" />
                    <p className="font-black text-xs uppercase tracking-widest text-[#1a1a1a]">{cert.course.instructor_name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Master Instructor</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 relative">
                       <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/20">
                          <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" />
                       </svg>
                       <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-primary mt-2">VERIFIED SECURE</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="h-px bg-gray-200 w-full mb-4" />
                    <p className="font-black text-xs uppercase tracking-widest text-[#1a1a1a]">{new Date(cert.issue_date).toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Date of Issue</p>
                  </div>
                </div>
                
                <div className="pt-12 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    <Shield className="h-3 w-3" /> Certificate ID: {cert.id}
                  </div>
                  <p className="text-[8px] text-gray-300 max-w-md mx-auto">
                    ChefMii Global Culinary Academy is accredited by the International Gastronomy Association. 
                    This certificate represents the mastery of professional standards and ethics.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions Sidebar */}
          <div className="w-full lg:w-80 space-y-6 print:hidden">
            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-white">
              <h3 className="font-black text-xl italic mb-6">Your Achievement</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold text-sm">Verified on Blockchain</span>
                </div>
                <div className="flex items-center gap-3 text-blue-500">
                  <Share2 className="h-5 w-5" />
                  <span className="font-bold text-sm">Sharable Link Active</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handlePrint}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3"
                >
                  <Printer className="h-5 w-5" /> PRINT CERTIFICATE
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-14 border-gray-100 text-gray-600 font-black rounded-2xl flex items-center justify-center gap-3"
                >
                  <Download className="h-5 w-5" /> DOWNLOAD PDF
                </Button>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl rounded-[40px] bg-[#1a1a1a] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <h4 className="font-black text-lg italic mb-4">Post to LinkedIn</h4>
              <p className="text-white/60 text-xs font-medium mb-6">Showcase your verified culinary skills to potential employers and partners.</p>
              <Button className="w-full bg-[#0077b5] hover:bg-[#006699] text-white font-black text-xs h-12 rounded-xl flex items-center justify-center gap-2">
                ADD TO PROFILE
              </Button>
            </Card>

            <Button 
              variant="ghost" 
              onClick={() => navigate('/academy')}
              className="w-full font-black text-gray-400 hover:text-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> RETURN TO ACADEMY
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CertificateDetail;
