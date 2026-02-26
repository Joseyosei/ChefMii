import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { emailSchema, rateLimiter } from "@/lib/security";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const { signIn, resetPassword, user, profile, loading } = useAuth();
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
      } else if (profile.role === "employee") {
        redirectPath = "/employee";
      }
      navigate(redirectPath);
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
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

    if (!rateLimiter.check(`login:${email}`, 5, 300000)) {
      toast({
        title: "Too Many Attempts",
        description: "Please wait 5 minutes before trying again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      rateLimiter.reset(`login:${email}`);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const emailValidation = emailSchema.safeParse(resetEmail);
    if (!emailValidation.success) {
      toast({
        title: "Invalid Email",
        description: emailValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSendingReset(true);
    const { error } = await resetPassword(resetEmail);
    setSendingReset(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
      });
      setForgotPasswordOpen(false);
      setResetEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[450px] mx-auto">
          <h1 className="text-[32px] font-medium mb-8">What's your phone number or email?</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full h-[54px] text-lg border-2 border-black focus:ring-0 rounded-lg">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="kid">Kid</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="institution">Institution</SelectItem>
                </SelectContent>
              </Select>

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

            <div className="mt-4 flex flex-col gap-3">
              <Button 
                className="w-full h-[54px] text-lg font-medium bg-black text-white hover:bg-black/90 rounded-lg" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Continuing..." : "Continue"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full h-[54px] text-lg font-medium border-2 border-black rounded-lg"
                onClick={() => {
                  toast({
                    title: "Guest Access",
                    description: "You are now browsing as a guest.",
                  });
                  navigate('/chefs');
                }}
              >
                Continue as Guest
              </Button>
            </div>

            <div className="text-right mt-2">
              <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground p-0">
                    Forgot password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="h-[54px] text-lg"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleForgotPassword} disabled={sendingReset}>
                      {sendingReset ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            </form>

            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to calls, including by autodialler, WhatsApp or texts from ChefMii and its affiliates.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-black font-medium hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Login;