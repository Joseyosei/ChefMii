import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import logo from "@/assets/chefme-logo.jpg";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto p-8 fade-in">
          <div className="text-center mb-8">
            <img src={logo} alt="ChefMe" className="h-16 w-auto mx-auto mb-4 invert brightness-0" />
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Log in to your account</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full" size="lg">
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Apple</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
