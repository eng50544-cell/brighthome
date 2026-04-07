import React from 'react';

const features = [
  { title: 'Premium Quality', description: 'Every product carefully selected and tested to meet our high standards.', icon: '✅' },
  { title: 'Fast Worldwide Shipping', description: 'Free shipping on orders over $50. Express delivery worldwide.', icon: '🚀' },
  { title: '30-Day Returns', description: 'Not satisfied? Return anything within 30 days no questions asked.', icon: '🔂' },
  { title: 'Secure Payment', description: 'Bank-level encryption keeps your payment safe.', icon: '🔒' },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-4xl font-bold text-white">
            Why <span className="text-gradient-gold">BrightHome?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-playfair text-lg font-bold text-accent-silver mb-3">{f.title}</h3>
              <p className="text-dark-silver text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
