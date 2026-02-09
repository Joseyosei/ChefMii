import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Briefcase, Search, Heart, Rocket, Users, Coffee } from 'lucide-react';

const Careers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'London / Remote',
      type: 'Full-time',
      description: 'Build beautiful, responsive interfaces using React and TypeScript.',
    },
    {
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'London / Remote',
      type: 'Full-time',
      description: 'Design and implement scalable APIs and database solutions.',
    },
    {
      title: 'Chef Acquisition Manager',
      department: 'Operations',
      location: 'London',
      type: 'Full-time',
      description: 'Source and onboard top culinary talent to our platform.',
    },
    {
      title: 'UX/UI Designer',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive and delightful user experiences.',
    },
    {
      title: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'London / Remote',
      type: 'Full-time',
      description: 'Drive user acquisition and retention through data-driven campaigns.',
    },
    {
      title: 'Customer Success Representative',
      department: 'Operations',
      location: 'London',
      type: 'Full-time',
      description: 'Ensure our users have an exceptional experience.',
    },
  ];

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health insurance and wellness programs' },
    { icon: Coffee, title: 'Free Meals', description: 'Chef-prepared meals and snacks at the office' },
    { icon: Rocket, title: 'Growth', description: 'Learning budget and career development opportunities' },
    { icon: Users, title: 'Team Events', description: 'Regular team dinners and cooking experiences' },
  ];

  const filteredPositions = openPositions.filter(
    (pos) =>
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Careers</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join the ChefMii Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us revolutionize the way people experience private dining. We're building something special.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work at ChefMii?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
          
          {filteredPositions.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No positions found matching your search.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredPositions.map((position, i) => (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <p className="text-muted-foreground mb-3">{position.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {position.department}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    <Link to="/contact">
                      <Button>Apply Now</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Don't See Your Role?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always looking for exceptional talent. Send us your CV and we'll keep you in mind for future opportunities.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
