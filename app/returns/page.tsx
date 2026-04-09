import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | BrightHome',
  description: 'Learn about our hassle-free returns and refunds policy.',
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">&#128230;</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns &amp; Refunds</h1>
          <p className="text-lg text-gray-600">We offer a simple, hassle-free return policy.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Policy</h2>
          <div className="space-y-4 text-gray-700">
            <p>We accept returns within <strong>30 days</strong> of delivery for most items.</p>
            <p>Items must be in their original condition, unused, and in original packaging.</p>
            <p>Once we receive your return, refunds are processed within 5-7 business days.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Return</h2>
          <ol className="space-y-4 text-gray-700 list-decimal list-inside">
            <li>Contact us at <a href="mailto:eng50544@gmail.com" className="text-blue-600 hover:underline">eng50544@gmail.com</a> with your order number.</li>
            <li>We will send you a return shipping label within 24 hours.</li>
            <li>Pack your item securely and attach the label.</li>
            <li>Drop off at any courier location.</li>
            <li>Your refund will be processed once we receive the item.</li>
          </ol>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-4">Our support team is ready to assist you.</p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
