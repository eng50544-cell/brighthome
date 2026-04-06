import React from 'react';
import HeroSection from '@/components/sections/hero';
import FeaturedProducts from '@/components/sections/featured-products';
import CollectionsGrid from '@/components/sections/collections-grid';
import WhyChooseUs from '@/components/sections/why-choose-us';
import ReviewsCarousel from '@/components/sections/reviews-carousel';
import Newsletter from '@/components/sections/newsletter';
import TrustBar from '@/components/sections/trust-bar';

export default function HomePage() {
  return (
    <div className="page-container">
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <CollectionsGrid />
      <WhyChooseUs />
      <ReviewsCarousel />
      <Newsletter />
    </div>
  );
}
