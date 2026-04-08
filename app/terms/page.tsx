import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BrightHome',
  description: 'BrightHome Terms of Service — the rules and guidelines governing use of our store.',
};

export default function TermsPage() {
  return (
    <div className="page-container pt-24">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📋</div>
          <h1 className="font-playfair text-4xl font-bold text-white mb-3">
            Terms of <span className="text-gradient-gold">Service</span>
          </h1>
          <p className="text-dark-silver text-sm">Last updated: January 2025</p>
        </div>

        <div className="space-y-6 text-primary-silver">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing or using brighthouse.website ("the Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site. BrightHome reserves the right to modify these terms at any time. Continued use of the Site after changes constitutes acceptance of the new terms.',
            },
            {
              title: '2. Products & Pricing',
              body: 'All prices are displayed in USD and are subject to change without notice. We make every effort to display accurate product information; however, errors may occasionally occur. BrightHome reserves the right to cancel any order where a pricing error has occurred. We will notify you of such cancellations promptly and issue a full refund.',
            },
            {
              title: '3. Orders & Payment',
              body: 'By placing an order, you represent that you are authorized to use the payment method provided. Payment is processed securely by PayTabs. Your order is not confirmed until payment has been successfully authorized. BrightHome reserves the right to refuse or cancel any order for any reason, including suspected fraud.',
            },
            {
              title: '4. Shipping & Delivery',
              body: 'We ship worldwide. Delivery times are estimates only and are not guaranteed. BrightHome is not responsible for delays caused by customs, weather, or carrier issues. Risk of loss transfers to you upon delivery to the carrier. If your package is lost or significantly delayed, please contact us and we will work to resolve the issue.',
            },
            {
              title: '5. Returns & Refunds',
              body: 'Our Return Policy (available at brighthouse.website/returns) is incorporated into these Terms by reference. By purchasing from us, you agree to the terms of our return Policy.',
            },
            {
              title: '6. Intellectual Property',
              body: 'All content on this Site — including text, images, logos, designs, and code — is the property of BrightHome or its content providers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.',
            },
            {
              title: '7. User Conduct',
              body: 'You agree not to use the Site to: violate any laws or regulations; transmit spam or malicious code; attempt to gain unauthorized access to any system; engage in any conduct that could harm BrightHome or other users; or misrepresent your identity. We reserve the right to terminate access for violations of these terms.',
            },
            {
              title: '8. Limitation of Liability',
              body: 'BrightHome shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our Site or products. Our total liability to you for any claim arising from your use of our services shall not exceed the amount you paid for the relevant order.',
            },
            {
              title: '9. Disclaimer of Warranties',
              body: 'The Site and products are provided "as is" without warranty of any kind. BrightHome does not warrant that the Site will be uninterrupted or error-free, that defects will be corrected, or that the Site or server are free of viruses or other harmful components.',
            },
            {
              title: '10. Governing Law',
              body: 'These Terms shall be governed by and construed in accordance with applicable international commercial law. Any disputes will be resolved through good-faith negotiation. If negotiation fails, disputes will be submitted to binding arbitration.',
            },
            {
              title: '11. Contact',
              body: 'For questions about these Terms, contact us at hello@brighthouse.website.',
            },
          ].map(section => (
            <section key={section.title} className="glass-card rounded-xl p-6">
              <h2 className="font-playfair text-lg font-bold text-white mb-3">{section.title}</h2>
              <p className="text-sm text-dark-silver leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
