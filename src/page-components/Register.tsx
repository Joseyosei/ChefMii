import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Apple, QrCode } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { emailSchema, passwordSchema, rateLimiter } from "@/lib/security";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user");
  const { signUp, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

    useEffect(() => {
    if (!loading && user && profile) {
        let redirectPath = "/user-dashboard";
        if (profile.role === "chef") {
          redirectPath = "/chef-dashboard";
        } else if (profile.role === "influencer") {
          redirectPath = "/influencer-dashboard";
        } else if (profile.role === "kid") {
          redirectPath = "/kids-dashboard";
        } else if (profile.role === "admin") {
          redirectPath = "/admin";
        } else if (profile.role === "business") {
          redirectPath = "/business-dashboard";
        } else if (profile.role === "institution") {
          redirectPath = "/institution-dashboard";
        } else if (profile.role === "vendor") {
          redirectPath = "/vendor-dashboard";
        }
        navigate(redirectPath);

    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast({
        title: "Invalid Email",
        description: emailValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast({
        title: "Weak Password",
        description: passwordValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (!rateLimiter.check(`register:${email}`, 3, 600000)) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait 10 minutes before trying again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      rateLimiter.reset(`register:${email}`);
      toast({
        title: "Welcome to ChefMii!",
        description: "Your account has been created successfully.",
      });
        let redirectPath = "/user-dashboard";
        if (role === "chef") {
          redirectPath = "/chef-dashboard";
        } else if (role === "influencer") {
          redirectPath = "/influencer-dashboard";
        } else if (role === "kid") {
          redirectPath = "/kids-dashboard";
        }
        navigate(redirectPath);
    }
  };

  const socialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `Connecting to ${provider}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[450px] mx-auto">
          <h1 className="text-[32px] font-medium mb-8">Create your account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full h-[54px] text-lg border-2 border-black focus:ring-0 rounded-lg">
                  <SelectValue placeholder="I am a..." />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="kid">Kid</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="vendor">Vendor (Farmer/Livestock)</SelectItem>
                    </SelectContent>
                </Select>

              <Input 
                type="text" 
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="h-[54px] text-lg border-2 border-black focus:ring-0 rounded-lg"
              />

              <Input 
                type="text" 
                placeholder="Enter phone number or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-[54px] text-lg border-2 border-black focus:ring-0 rounded-lg"
              />

              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-[54px] text-lg border-2 border-black focus:ring-0 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-[54px] text-lg font-medium bg-black text-white hover:bg-black/90 rounded-lg mt-4" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Continue"}
            </Button>
            </form>

            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to calls, including by autodialler, WhatsApp or texts from ChefMii and its affiliates.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-black font-medium hover:underline">
                  Log In
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
