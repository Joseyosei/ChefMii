import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Play, Clock, Users, Award, Star, ChefHat, Globe, BookOpen } from "lucide-react";

const Academy = () => {
  const courses = [
    {
      title: "Italian Pasta Mastery",
      instructor: "Chef Marco Ricci",
      level: "Intermediate",
      duration: "8 weeks",
      students: 1240,
      rating: 4.9,
      price: "£299",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
      category: "Italian"
    },
    {
      title: "Sushi & Sashimi Fundamentals",
      instructor: "Chef Yuki Tanaka",
      level: "Beginner",
      duration: "6 weeks",
      students: 890,
      rating: 5.0,
      price: "£349",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
      category: "Japanese"
    },
    {
      title: "French Pastry Excellence",
      instructor: "Chef Sophie Laurent",
      level: "Advanced",
      duration: "12 weeks",
      students: 650,
      rating: 4.8,
      price: "£499",
      image: "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80",
      category: "French"
    },
    {
      title: "Mediterranean Cuisine",
      instructor: "Chef Maria Santos",
      level: "Beginner",
      duration: "6 weeks",
      students: 1050,
      rating: 4.9,
      price: "£279",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      category: "Mediterranean"
    },
    {
      title: "Michelin-Level Plating",
      instructor: "Chef Gordon Harrison",
      level: "Advanced",
      duration: "4 weeks",
      students: 420,
      rating: 5.0,
      price: "£599",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      category: "Fine Dining"
    },
    {
      title: "Vegan Cooking Mastery",
      instructor: "Chef Emma Green",
      level: "Intermediate",
      duration: "8 weeks",
      students: 980,
      rating: 4.7,
      price: "£259",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      category: "Vegan"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">ChefMii Academy</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master the Culinary Arts
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn from world-renowned chefs. Earn professional certifications. 
              Join a global community of culinary enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Browse Courses</Button>
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-5 w-5" />
                Watch Preview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "50,000+", label: "Students Worldwide" },
              { icon: ChefHat, value: "200+", label: "Expert Instructors" },
              { icon: BookOpen, value: "350+", label: "Courses Available" },
              { icon: Award, value: "15,000+", label: "Certifications Issued" }
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Search courses..." className="md:w-80" />
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Cuisine Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-muted-foreground">
              Start your culinary journey with our most popular courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <Card key={i} className="overflow-hidden hover-lift">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{course.category}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      Preview
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-primary">{course.price}</p>
                    <Button>Enroll Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl font-bold mb-6">Get Certified</h2>
            <p className="text-xl text-background/80 mb-8">
              Upon completion, receive industry-recognized certifications that showcase 
              your culinary expertise to employers and clients worldwide.
            </p>
            <Button size="lg" variant="secondary">
              View Certification Programs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academy;