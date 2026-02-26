import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Code, ChefHat, TrendingUp, Scale, Briefcase } from 'lucide-react';

const Team = () => {
  const departments = [
    {
      title: 'Executive Team',
      icon: Briefcase,
      color: 'from-primary to-primary/70',
      members: [
        { role: 'Founder / CEO', description: 'Vision, fundraising, leadership' },
        { role: 'COO', description: 'Day-to-day ops, logistics' },
        { role: 'CTO', description: 'Tech strategy, infrastructure' },
        { role: 'CFO', description: 'Finance, budgets, investor reports' },
        { role: 'CPO', description: 'Product vision, roadmap' },
      ],
    },
    {
      title: 'Engineering + Product',
      icon: Code,
      color: 'from-blue-500 to-blue-400',
      members: [
        { role: 'Frontend Devs', description: 'React/Flutter – Web/mobile interface' },
        { role: 'Backend Devs', description: 'Node.js, Supabase – Logic, APIs, auth' },
        { role: 'DevOps Engineer', description: 'CI/CD, infrastructure' },
        { role: 'QA Engineer', description: 'Testing' },
        { role: 'UX/UI Designer', description: 'Flows, wireframes, design system' },
        { role: 'Motion Designer', description: 'Animations & gamified UI' },
      ],
    },
    {
      title: 'Chef & User Operations',
      icon: ChefHat,
      color: 'from-orange-500 to-orange-400',
      members: [
        { role: 'Chef Acquisition Manager', description: 'Onboarding top chefs' },
        { role: 'User Success Manager', description: 'Customer satisfaction' },
        { role: 'Support Agents', description: 'Customer service' },
        { role: 'Training Specialist', description: 'Chef Academy programs' },
      ],
    },
    {
      title: 'Growth & Marketing',
      icon: TrendingUp,
      color: 'from-green-500 to-green-400',
      members: [
        { role: 'Growth Lead', description: 'User acquisition & retention' },
        { role: 'Performance Marketer', description: 'Ads & paid campaigns' },
        { role: 'Content Lead', description: 'Blogs, SEO, Video' },
        { role: 'Community Manager', description: 'Social & community' },
        { role: 'Brand Designer', description: 'Visual identity' },
      ],
    },
    {
      title: 'Advisory & Freelance',
      icon: Scale,
      color: 'from-purple-500 to-purple-400',
      members: [
        { role: 'Legal Advisor', description: 'Compliance & contracts' },
        { role: 'Financial Consultant', description: 'Strategic finance' },
        { role: 'Data Analyst', description: 'Insights & analytics' },
        { role: 'Illustrator/Animator', description: 'Creative assets' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">Our Team</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet the ChefMii Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A passionate team of food lovers, technologists, and creatives building the future of private dining.
          </p>
        </div>
      </section>

      {/* Team Structure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12">
            {departments.map((dept, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${dept.color}`}>
                    <dept.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{dept.title}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dept.members.map((member, j) => (
                    <Card key={j} className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-lg mb-1">{member.role}</h3>
                      <p className="text-muted-foreground text-sm">{member.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-16 w-16 mx-auto text-primary-foreground mb-6" />
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Want to Join Us?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for food and technology.
          </p>
          <a href="/careers" className="inline-block bg-background text-foreground px-8 py-4 rounded-full font-semibold hover:bg-background/90 transition-colors">
            View Open Positions
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
