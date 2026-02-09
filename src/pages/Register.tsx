import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
const chefMiiIcon = "/placeholder.svg?height=64&width=64";
import { emailSchema, passwordSchema, nameSchema, rateLimiter } from "@/lib/security";

const Register = () => {
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"user" | "chef" | "kid">("user");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plan = searchParams.get("plan");
  
  useEffect(() => {
    if (!loading && user && profile) {
      let redirectPath = "/user-dashboard";
      if (profile.role === "chef") {
        redirectPath = "/chef-dashboard";
      } else if (profile.role === "kid") {
        redirectPath = "/minichef-dashboard";
      }
      navigate(redirectPath);
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const nameValidation = nameSchema.safeParse(fullName);
    if (!nameValidation.success) {
      toast({
        title: "Invalid Name",
        description: nameValidation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast({
        title: "Invalid Email",
        description: emailValidation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      toast({
        title: "Weak Password",
        description: passwordValidation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!rateLimiter.check(`register:${email}`, 3, 300000)) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait 5 minutes before trying again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      rateLimiter.reset(`register:${email}`);
      toast({
        title: "Welcome to ChefMii!",
        description: "Your account has been created successfully."
      });
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-terracotta/20 via-ivory to-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto fade-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <img src={chefMiiIcon} alt="ChefMii" className="h-16 w-auto mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Get Started</h1>
              <p className="text-muted-foreground">
                {plan ? `Sign up for the ${plan} plan` : "Create an account to find your personal chef"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">I am a...</label>
                <div className="grid grid-cols-3 gap-3">
                  <Button type="button" variant={role === "user" ? "default" : "outline"} onClick={() => setRole("user")} disabled={isLoading} className="w-full">
                    User
                  </Button>
                  <Button type="button" variant={role === "chef" ? "default" : "outline"} onClick={() => setRole("chef")} disabled={isLoading} className="w-full text-black bg-white">
                    Chef
                  </Button>
                  <Button type="button" variant={role === "kid" ? "default" : "outline"} onClick={() => setRole("kid")} disabled={isLoading} className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500">
                    Kids
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {role === "chef" 
                    ? "Join as a chef to offer your culinary services" 
                    : role === "kid"
                    ? "Perfect for children and teenagers who love cooking!"
                    : "Sign up to book amazing chefs for any occasion"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Register;
