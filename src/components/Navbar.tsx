import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Moon, Sun, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import ChefMiiLogo from "./ChefMiiLogo";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

    const navLinks = [
      { href: "/chefs", label: "Find Chefs", isButton: true },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/supply-market", label: "Farmer" },
      { href: "/pricing", label: "Pricing" },
      { href: "/packages", label: "Event Packages" },
      { href: "/chef-media", label: "Chef Media" },
      { href: "/academy", label: "Academy" },
      { href: "/kids-zone", label: "Kids' Zone" },
    ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

    const getDashboardLink = () => {
      if (profile?.role === "chef") {
        return "/chef-dashboard";
      }
      if (profile?.role === "vendor") {
        return "/vendor-dashboard";
      }
      if (profile?.role === "business") {
        return "/business-dashboard";
      }
      if (profile?.role === "institution") {
        return "/institution-dashboard";
      }
      if (profile?.role === "admin") {
        return "/admin";
      }
      if (profile?.role === "employee") {
        return "/employee";
      }
      if (profile?.role === "kid") {
        return "/kids-dashboard";
      }
      if (profile?.role === "parent") {
        return "/parent-dashboard";
      }
      if (profile?.role === "influencer") {
        return "/influencer-dashboard";
      }
      return "/user-dashboard";
    };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <ChefMiiLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isButton ? (
                <Link
                  key={link.href}
                  to={link.href}
                >
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    {link.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="cursor-pointer">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="cursor-pointer">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="cursor-pointer">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {!user && (
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                {navLinks.map((link) => (
                  link.isButton ? (
                    <Link
                      key={link.href}
                      to={link.href}
                    >
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        {link.label}
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  {user ? (
                    <>
                      <Link to={getDashboardLink()}>
                        <Button variant="outline" className="w-full">Dashboard</Button>
                      </Link>
                      <Button onClick={handleSignOut} variant="destructive" className="w-full">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
