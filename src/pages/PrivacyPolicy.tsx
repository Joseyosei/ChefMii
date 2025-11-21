import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-muted-foreground">Last Updated: January 2025</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                ChefMe Global ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, phone number</li>
                <li>Billing and payment information</li>
                <li>Profile information and preferences</li>
                <li>Event details and dietary requirements</li>
                <li>Communications with chefs and customer support</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Automatically Collected Information</h3>
              <p>When you access our platform, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages viewed, time spent, features used)</li>
                <li>Location information (with your permission)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitating bookings and connecting you with chefs</li>
                <li>Processing payments and managing transactions</li>
                <li>Sending booking confirmations and updates</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Improving our platform and services</li>
                <li>Personalizing your experience</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Detecting and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Chefs</h3>
              <p>
                We share necessary booking details with chefs to facilitate your service, including your name, 
                contact information, event details, and dietary requirements.
              </p>

              <h3 className="text-xl font-semibold mt-4 mb-2">Service Providers</h3>
              <p>Third-party service providers who assist us with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processing</li>
                <li>Email and communication services</li>
                <li>Analytics and data analysis</li>
                <li>Cloud hosting and storage</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Legal Requirements</h3>
              <p>We may disclose information if required by law or in response to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal processes or government requests</li>
                <li>Protection of our rights or property</li>
                <li>Prevention of fraud or illegal activities</li>
                <li>Safety concerns for users or the public</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to certain data processing activities</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Deliver targeted advertising</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings, but disabling cookies may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our platform is not intended for users under 18 years of age. We do not knowingly collect information 
                from children. If we become aware that we have collected information from a child, we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 
                revision date. Continued use of the platform after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p>
                For questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="font-medium">
                Email: privacy@chefmeglobal.com<br />
                Phone: +44 20 1234 5678<br />
                Address: ChefMe Global, 123 Culinary Lane, London, UK
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
