import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-muted-foreground">Last Updated: January 2026</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                Welcome to ChefMii Global. By accessing or using our platform, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p>
                ChefMii Global provides a platform connecting professional chefs with clients seeking culinary services. We 
                facilitate bookings, payments, and communications but are not directly involved in the provision of chef services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                You must create an account to use certain features of our platform. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Bookings and Payments</h2>
              <p>
                All bookings made through ChefMii Global are subject to availability and confirmation by the chef. Payment terms include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is processed at the time of booking confirmation</li>
                <li>Prices are set by individual chefs and may vary</li>
                <li>All prices are inclusive of platform fees unless stated otherwise</li>
                <li>Cancellation policies vary by chef and are displayed before booking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cancellation and Refunds</h2>
              <p>
                Cancellation policies are set by individual chefs. Generally:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refunds are available for cancellations made 7+ days before the event</li>
                <li>Partial refunds may be available for cancellations made 3-7 days before</li>
                <li>Cancellations within 48 hours may not be eligible for refunds</li>
                <li>ChefMii Global reserves the right to make exceptions in extraordinary circumstances</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Chef Responsibilities</h2>
              <p>
                Chefs using our platform agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide services as described in their profile and booking agreement</li>
                <li>Maintain appropriate licenses, certifications, and insurance</li>
                <li>Comply with all applicable food safety and health regulations</li>
                <li>Communicate promptly and professionally with clients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Client Responsibilities</h2>
              <p>
                Clients using our platform agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate event details and requirements</li>
                <li>Ensure a safe and appropriate working environment for the chef</li>
                <li>Communicate any dietary restrictions or allergies</li>
                <li>Provide access to necessary kitchen facilities and equipment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Prohibited Activities</h2>
              <p>
                Users may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Interfere with or disrupt the platform</li>
                <li>Attempt to bypass payment systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                ChefMii Global acts as a platform connecting chefs and clients. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The quality or safety of services provided by chefs</li>
                <li>Food-borne illnesses or allergic reactions</li>
                <li>Damages to property during service delivery</li>
                <li>Disputes between chefs and clients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
              <p>
                In case of disputes, users agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>First attempt to resolve disputes directly with the other party</li>
                <li>Contact ChefMii Global support for mediation assistance</li>
                <li>Participate in good faith in any dispute resolution process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Modifications to Terms</h2>
              <p>
                ChefMii Global reserves the right to modify these Terms of Service at any time. Changes will be effective 
                immediately upon posting. Continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="font-medium">
                Email: legal@chefmiiglobal.com<br />
                Phone: +44 20 1234 5678
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
