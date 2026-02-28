import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, MapPin, Briefcase, Clock, CheckCircle, Send, Linkedin, Twitter,
  Facebook, Link as LinkIcon, ChevronRight
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  location_type: 'remote' | 'hybrid' | 'onsite';
  employment_type: 'full_time' | 'part_time' | 'contract';
  salary_min?: number;
  salary_max?: number;
  currency: string;
  description: string;
  team_overview: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  published_at: string;
  status: 'open' | 'closed';
}

const formatSalary = (min?: number, max?: number, currency: string = 'GBP') => {
  if (!min && !max) return null;
  
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return null;
};

const formatDepartment = (dept: string) => {
  return dept
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getLocationTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  };
  return labels[type] || type;
};

const getEmploymentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
  };
  return labels[type] || type;
};

// Share Button Component
function ShareButton({ 
  icon: Icon, 
  label, 
  onClick,
  href 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const Component = href ? 'a' : 'button';
  
  return (
    <Component
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Component>
  );
}

// Application Form Component
function ApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    resume: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, send to your API/Supabase
    console.log('Application submitted:', { jobId, ...formData });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for applying to {jobTitle}. We'll review your application and 
          get back to you within 5 business days.
        </p>
        <Link
          to="/careers"
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Browse more positions →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Apply for this position</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/..."
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio / Website
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume/CV *
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            {formData.resume ? (
              <div className="text-green-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{formData.resume.name}</p>
                <p className="text-sm text-gray-500">Click to change</p>
              </div>
            ) : (
              <>
                <Send className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Drop your resume here or <span className="text-orange-500">browse</span></p>
                <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
              </>
            )}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Letter
        </label>
        <textarea
          rows={5}
          placeholder="Tell us why you'd be great for this role..."
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        By submitting this application, you agree to our{' '}
        <Link to="/privacy" className="text-orange-500 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        // Use mock data
        setJob(MOCK_JOB_DETAIL);
      } else {
        setJob(data);
      }

      setLoading(false);
    }

    fetchJob();
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `${job?.title} at ChefMii`;
    
    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Position Not Found</h2>
        <p className="text-gray-500 mb-4">This position may have been filled or removed.</p>
        <Link
          to="/careers"
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all openings
        </Link>
      </div>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max, job.currency);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all openings
          </Link>
        </div>
      </div>

      {/* Job Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <span className="flex items-center gap-2 font-medium">
            <Briefcase className="w-5 h-5" />
            {formatDepartment(job.department)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {getLocationTypeLabel(job.location_type)} - {job.location}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {getEmploymentTypeLabel(job.employment_type)}
          </span>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <ShareButton
            icon={Linkedin}
            label="LinkedIn"
            onClick={() => handleShare('linkedin')}
          />
          <ShareButton
            icon={Twitter}
            label="Twitter"
            onClick={() => handleShare('twitter')}
          />
          <ShareButton
            icon={Facebook}
            label="Facebook"
            onClick={() => handleShare('facebook')}
          />
          <ShareButton
            icon={LinkIcon}
            label="Copy Link"
            onClick={() => handleShare('copy')}
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Mission */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 mt-0">
              Our Mission: Connecting People with Amazing Culinary Experiences
            </h2>
          </div>

          {/* Team Overview */}
          {job.team_overview && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">Team Overview</h2>
              <p className="text-gray-600 text-left">{job.team_overview}</p>
            </section>
          )}

          {/* Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
              In this role, you'll get to:
            </h2>
            <ul className="space-y-3">
              {job.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 text-left">
                  <span className="text-orange-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
              We are looking for people who have:
            </h2>
            <ul className="space-y-3">
              {job.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 text-left">
                  <span className="text-orange-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Nice to Have */}
          {job.nice_to_have && job.nice_to_have.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
                Nice to have:
              </h2>
              <ul className="space-y-3">
                {job.nice_to_have.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600 text-left">
                    <span className="text-orange-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Salary */}
          {salary && (
            <section className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-left">
                Compensation
              </h2>
              <p className="text-2xl font-bold text-orange-500 text-left">{salary}</p>
              <p className="text-gray-500 text-sm mt-2 text-left">
                Plus equity, benefits, and bonus potential
              </p>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* About ChefMii */}
          <section className="mb-8 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-left">About ChefMii</h2>
            <p className="text-gray-600 mb-4 text-left">
              ChefMii is the leading marketplace for booking private chefs. We connect 
              food lovers with talented culinary professionals for private dining experiences, 
              cooking classes, events, and more.
            </p>
            <p className="text-gray-600 text-left">
              At ChefMii, we value diversity, creativity, and a passion for food. 
              We're building a company where people can do their best work. We focus on 
              brilliant work, not badge swipes. By combining clarity, ownership, and trust, 
              we create space for big thinking and meaningful progress.
            </p>
          </section>

          {/* Diversity Statement */}
          <section className="mb-8 bg-gray-900 text-white rounded-xl p-6">
            <p className="text-sm italic">
              ChefMii is an equal opportunity employer. We celebrate diversity and are 
              committed to creating an inclusive environment for all employees. We know 
              the confidence gap and imposter syndrome can get in the way of meeting 
              spectacular candidates, so please don't hesitate to apply — we'd love to 
              hear from you.
            </p>
          </section>
        </div>

        {/* Application Form */}
        <div className="border-t pt-8 mt-8">
          <ApplicationForm jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_JOB_DETAIL: Job = {
  id: '1',
  title: 'Senior Full Stack Engineer',
  department: 'engineering',
  location: 'London, UK',
  location_type: 'hybrid',
  employment_type: 'full_time',
  salary_min: 80000,
  salary_max: 120000,
  currency: 'GBP',
  description: 'Join our engineering team to build the future of chef booking.',
  team_overview: 'Our Engineering team builds the technology that powers ChefMii. We work on challenging problems in marketplace dynamics, real-time communications, payments, and mobile experiences. We balance technical excellence with shipping speed.',
  responsibilities: [
    'Design, build, and maintain scalable backend services and APIs',
    'Collaborate with product and design to ship new features',
    'Write clean, maintainable, and well-tested code',
    'Participate in code reviews and technical discussions',
    'Mentor junior engineers and share knowledge',
    'Contribute to architectural decisions and technical strategy',
    'Help improve our development processes and tooling',
  ],
  requirements: [
    '5+ years of professional software development experience',
    'Strong proficiency in TypeScript and modern JavaScript',
    'Experience with React/Next.js and Node.js',
    'Experience with PostgreSQL or similar relational databases',
    'Understanding of RESTful APIs and system design',
    'Experience with cloud platforms (AWS, GCP, or similar)',
    'Strong communication skills and ability to work in a team',
    'Product mindset - you care about the impact of your work',
  ],
  nice_to_have: [
    'Experience with React Native mobile development',
    'Experience with real-time systems (WebSockets, etc.)',
    'Experience with payment systems (Stripe, etc.)',
    'Previous startup or marketplace experience',
    'Open source contributions',
  ],
  benefits: [
    'Competitive salary + equity',
    'Flexible hybrid working (2 days/week in London office)',
    'Unlimited PTO (minimum 25 days)',
    'Private health insurance',
    'Learning & development budget (£2,000/year)',
    'Latest MacBook Pro and equipment',
    'Free ChefMii credits (£200/month)',
    'Team events and offsites',
    'Pension contribution',
    'Cycle to work scheme',
  ],
  published_at: '2026-01-15',
  status: 'open',
};
