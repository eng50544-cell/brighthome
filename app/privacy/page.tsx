import React from "react";

export const metadata = {
  title: "Privacy Policy | BrightHome",
  description: "BrightHome privacy policy - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: January 1, 2025</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information you provide directly to us, including your name, email address,
              shipping address, phone number, and payment information when you make a purchase or
              create an account. We also collect information automatically when you use our website,
              such as your IP address, browser type, pages visited, and browsing behavior.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to process your orders, send order confirmations and
              shipping updates, provide customer support, personalize your shopping experience,
              send promotional emails (with your consent), improve our website and services,
              and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with trusted service providers who assist us in operating our website
              (such as payment processors, shipping companies, and email service providers), but only
              to the extent necessary to provide these services. We may also disclose your information
              if required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience,
              analyze website traffic, and remember your preferences. You can control cookie settings
              through your browser settings. Please note that disabling cookies may affect some
              functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
              All payment information is encrypted using SSL technology. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time.
              You can opt out of marketing emails by clicking the unsubscribe link in any email we
              send. To exercise your rights or request data deletion, please contact us at
              privacy@brighthome.store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this policy, unless a longer retention period is required by law. Order
              information is retained for 7 years for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Children Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you believe we have collected
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 text-gray-600">
              <p>BrightHome</p>
              <p>Email: privacy@brighthome.store</p>
              <p>Address: 123 Commerce Street, Tech City, TC 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
