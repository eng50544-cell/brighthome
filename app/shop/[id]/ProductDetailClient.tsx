"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  costPrice: number;
  images: string[];
  features: string[];
  tags: string[];
  rating: { average: number; count: number };
  stock: number;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
    }
  };

  const faqs = [
    { q: "What is the warranty?", a: "All products come with a 1-year manufacturer warranty." },
    { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days. Express options available." },
    { q: "Can I return this product?", a: "Yes, we offer a 30-day hassle-free return policy." },
    { q: "Is this compatible with smart home systems?", a: "Most of our products are compatible with Alexa, Google Home, and Apple HomeKit." },
  ];

  const stars = Math.round(product.rating?.average || 4.5);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
              <Image
                src={product.images[activeImg] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImg === i ? "border-yellow-400" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-5 w-5 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.rating?.count || 0} reviews)</span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span className="text-lg text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
              <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-0.5 rounded">
                Save 23%
              </span>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="space-y-2 mb-6">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">✓</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAdd}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${
                  wishlist ? "border-red-400 bg-red-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlist ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-6 w-6 text-yellow-600" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-6 w-6 text-yellow-600" />
                <span className="text-xs text-gray-600">1-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw className="h-6 w-6 text-yellow-600" />
                <span className="text-xs text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
