import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, MapPin, Briefcase, Globe, ChevronDown, 
  Bell, ArrowRight, Users, Heart, Zap, Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ============================================================
// TYPES
// ============================================================

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
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  published_at: string;
  status: 'open' | 'closed';
}

interface FilterState {
  location: string;
  department: string;
  employmentType: string;
  search: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const DEPARTMENTS = [
  { value: '', label: 'All Departments' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'customer_success', label: 'Customer Success' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
];

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'london', label: 'London, UK' },
  { value: 'remote_uk', label: 'Remote - UK' },
  { value: 'remote_eu', label: 'Remote - Europe' },
  { value: 'remote_global', label: 'Remote - Global' },
  { value: 'accra', label: 'Accra, Ghana' },
  { value: 'new_york', label: 'New York, USA' },
];

const EMPLOYMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
];

// ============================================================
// COMPONENTS
// ============================================================

// Filter Dropdown Component
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600 flex items-center gap-1">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// Job Card Component (HubSpot Style)
function JobCard({ job }: { job: Job }) {
  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      remote: 'Remote',
      hybrid: 'Hybrid',
      onsite: 'On-site',
    };
    return labels[type] || type;
  };

  const formatDepartment = (dept: string) => {
    return dept
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-200">
      <Link to={`/careers/${job.id}`}>
        <h3 className="text-lg font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors mb-2">
          {job.title}
        </h3>
      </Link>
      
      <p className="text-gray-700 font-medium mb-1">
        {formatDepartment(job.department)}
      </p>
      
      <p className="text-gray-600 mb-4">
        {getLocationTypeLabel(job.location_type)} - {job.location}
      </p>
      
      <Link
        to={`/careers/${job.id}`}
        className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
      >
        Apply
      </Link>
    </div>
  );
}

// Job Alert Banner
function JobAlertBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setSubscribed(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-orange-50 rounded-full">
          <Bell className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Create a Job Alert</h3>
          <p className="text-gray-600 text-sm mb-3">
            Get the latest open positions at ChefMii sent right to your inbox.
          </p>
          {subscribed ? (
            <p className="text-green-600 font-medium">✓ You're subscribed to job alerts!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                Create alert
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Culture Section
function CultureSection() {
  const values = [
    {
      icon: Heart,
      title: 'Customer Obsessed',
      description: 'We put our chefs and customers at the heart of everything we do.',
    },
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'We ship quickly, learn from feedback, and iterate constantly.',
    },
    {
      icon: Users,
      title: 'Team First',
      description: 'We succeed together. Collaboration and support define our culture.',
    },
    {
      icon: Coffee,
      title: 'Work-Life Balance',
      description: 'Flexible working, unlimited PTO, and respect for your time.',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 mb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Why Join ChefMii?</h2>
        <p className="text-center text-orange-100 mb-12 max-w-2xl mx-auto">
          We're building the future of how people discover and book private chefs. 
          Join us and help revolutionize the culinary industry.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">{value.title}</h3>
              <p className="text-orange-100 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Benefits Section
function BenefitsSection() {
  const benefits = [
    '🏠 Remote-first culture',
    '💰 Competitive salary + equity',
    '🏖️ Unlimited PTO',
    '🍽️ Free ChefMii credits',
    '📚 Learning & development budget',
    '💪 Health & wellness stipend',
    '👶 Parental leave',
    '💻 Latest equipment',
  ];

  return (
    <div className="bg-gray-50 py-12 mb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Benefits & Perks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="bg-white rounded-lg p-4 text-center shadow-sm"
            >
              <p className="text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    department: '',
    employmentType: '',
    search: '',
  });
  const [showAll, setShowAll] = useState(false);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        // Use mock data if no database
        setJobs(MOCK_JOBS);
      } else {
        setJobs(data || MOCK_JOBS);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...jobs];

    if (filters.location) {
      result = result.filter((job) => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.department) {
      result = result.filter((job) => job.department === filters.department);
    }

    if (filters.employmentType) {
      result = result.filter((job) => job.employment_type === filters.employmentType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.department.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredJobs(result);
  }, [jobs, filters]);

  const displayedJobs = showAll ? filteredJobs : filteredJobs.slice(0, 12);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-white py-16 border-b">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join the ChefMii Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us connect people with amazing culinary experiences. 
            We're looking for passionate individuals to join our mission.
          </p>
        </div>
      </div>

      {/* Culture Section */}
      <CultureSection />

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <FilterDropdown
            label="Filter by Location"
            value={filters.location}
            options={LOCATIONS}
            onChange={(value) => setFilters({ ...filters, location: value })}
            icon={MapPin}
          />
          <FilterDropdown
            label="Filter by Department"
            value={filters.department}
            options={DEPARTMENTS}
            onChange={(value) => setFilters({ ...filters, department: value })}
            icon={Briefcase}
          />
          <FilterDropdown
            label="Filter by Type"
            value={filters.employmentType}
            options={EMPLOYMENT_TYPES}
            onChange={(value) => setFilters({ ...filters, employmentType: value })}
            icon={Globe}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 flex items-center gap-1">
              <Search className="w-4 h-4" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Open Positions</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {displayedJobs.length} of {filteredJobs.length}
            </span>
            {filteredJobs.length > 12 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-orange-500 hover:text-orange-600 font-medium border border-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Show all
              </button>
            )}
          </div>
        </div>

        {/* Job Alert */}
        <JobAlertBanner />

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No positions found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or check back later for new openings.
            </p>
            <button
              onClick={() =>
                setFilters({
                  location: '',
                  department: '',
                  employmentType: '',
                  search: '',
                })
              }
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Show More Button */}
        {filteredJobs.length > 12 && showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(false)}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Show less
            </button>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-gray-400 mb-8">
            We're always looking for talented people. Send us your CV and we'll 
            keep you in mind for future opportunities.
          </p>
          <Link
            to="/careers/general-application"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit General Application
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ============================================================
// MOCK DATA (for development/demo)
// ============================================================

const MOCK_JOBS: Job[] = [
  {
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
    requirements: ['5+ years experience', 'React/Next.js', 'Node.js', 'PostgreSQL'],
    responsibilities: ['Build features', 'Code review', 'Mentor juniors'],
    benefits: ['Equity', 'Remote work', 'Health insurance'],
    published_at: '2026-01-15',
    status: 'open',
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'design',
    location: 'Remote - UK',
    location_type: 'remote',
    employment_type: 'full_time',
    salary_min: 60000,
    salary_max: 90000,
    currency: 'GBP',
    description: 'Design beautiful experiences for our chef and customer apps.',
    requirements: ['3+ years experience', 'Figma expert', 'User research'],
    responsibilities: ['UI/UX design', 'Prototyping', 'User testing'],
    benefits: ['Equity', 'Remote work', 'Learning budget'],
    published_at: '2026-01-10',
    status: 'open',
  },
  {
    id: '3',
    title: 'Head of Marketing',
    department: 'marketing',
    location: 'London, UK',
    location_type: 'hybrid',
    employment_type: 'full_time',
    salary_min: 90000,
    salary_max: 130000,
    currency: 'GBP',
    description: 'Lead our marketing strategy and brand growth.',
    requirements: ['7+ years experience', 'B2C marketing', 'Team leadership'],
    responsibilities: ['Strategy', 'Brand', 'Performance marketing'],
    benefits: ['Equity', 'Bonus', 'Health insurance'],
    published_at: '2026-01-08',
    status: 'open',
  },
  {
    id: '4',
    title: 'Customer Success Manager',
    department: 'customer_success',
    location: 'Remote - Europe',
    location_type: 'remote',
    employment_type: 'full_time',
    salary_min: 45000,
    salary_max: 65000,
    currency: 'GBP',
    description: 'Help our chefs succeed and grow on the platform.',
    requirements: ['2+ years experience', 'Customer-facing', 'Food industry knowledge'],
    responsibilities: ['Onboarding', 'Support', 'Retention'],
    benefits: ['Equity', 'Remote work', 'ChefMii credits'],
    published_at: '2026-01-05',
    status: 'open',
  },
  {
    id: '5',
    title: 'Sales Development Representative',
    department: 'sales',
    location: 'London, UK',
    location_type: 'onsite',
    employment_type: 'full_time',
    salary_min: 30000,
    salary_max: 45000,
    currency: 'GBP',
    description: 'Drive B2B sales for our enterprise product.',
    requirements: ['1+ years experience', 'Sales background', 'Great communication'],
    responsibilities: ['Lead generation', 'Outreach', 'Pipeline management'],
    benefits: ['Commission', 'Equity', 'Training'],
    published_at: '2026-01-03',
    status: 'open',
  },
  {
    id: '6',
    title: 'Mobile Engineer (React Native)',
    department: 'engineering',
    location: 'Remote - Global',
    location_type: 'remote',
    employment_type: 'full_time',
    salary_min: 70000,
    salary_max: 100000,
    currency: 'GBP',
    description: 'Build our iOS and Android apps.',
    requirements: ['3+ years React Native', 'iOS/Android', 'TypeScript'],
    responsibilities: ['Mobile development', 'Performance', 'Testing'],
    benefits: ['Equity', 'Remote work', 'Equipment budget'],
    published_at: '2026-01-01',
    status: 'open',
  },
];
