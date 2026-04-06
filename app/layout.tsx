import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/ui/cart-context';
import { ToastProvider } from '@/components/ui/toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export const metadata: Metadata = {
  title: {
    default: 'BrightHome - Premium Lighting & Home Decor',
    template: '%s | BrightHome',
  },
  description: 'Discover premium lighting fixtures and home decor that transform your space. Shop the latest trending designs with worldwide shipping.',
  keywords: ['lighting', 'home decor', 'LED lights', 'pendant lights', 'floor lamps', 'table lamps', 'wall lights', 'BrightHome'],
  authors: [{ name: 'BrightHome' }],
  creator: 'BrightHome',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brighthouse.website',
    siteName: 'BrightHome',
    title: 'BrightHome - Premium Lighting & Home Decor',
    description: 'Transform your space with premium lighting and home decor. Worldwide shipping.',
    images: [{ url: 'https://brighthouse.website/og-image.jpg', width: 1200, height: 630, alt: 'BrightHome' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrightHome - Premium Lighting & Home Decor',
    description: 'Transform your space with premium lighting and home decor.',
    images: ['https://brighthouse.website/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://brighthouse.website'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-accent-silver font-inter antialiased">
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
