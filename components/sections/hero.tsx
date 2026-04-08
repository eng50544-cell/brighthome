"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  { title: "Smart Home Revolution", subtitle: "Transform your living space with cutting-edge technology", bg: "from-gray-900 via-blue-950 to-gray-900", cta: "Shop Now" },
  { title: "Premium Gadgets", subtitle: "Discover the latest in home automation and smart devices", bg: "from-gray-900 via-purple-950 to-gray-900", cta: "Explore" },
  { title: "Free Shipping", subtitle: "On all orders over 200 SAR - delivered to your door", bg: "from-gray-900 via-green-950 to-gray-900", cta: "Start Shopping" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={"relative min-h-screen flex items-center justify-center bg-gradient-to-br " + slide.bg + " transition-all duration-700"}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: "2s"}}></div>
      </div>
      <div className={"relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-300 " + (isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0")}>
        <div className="inline-block bg-gold-500 bg-opacity-20 border border-gold-500 border-opacity-30 rounded-full px-6 py-2 mb-6">
          <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">BrightHome Store</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{slide.title}</h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{slide.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="bg-gold-500 hover:bg-gold-400 text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block">
            {slide.cta}
          </Link>
          <Link href="/track-order" className="border border-white border-opacity-30 hover:border-gold-400 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:text-gold-400 inline-block">
            Track Order
          </Link>
        </div>
        <div className="flex justify-center mt-12 gap-3">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={"w-3 h-3 rounded-full transition-all duration-300 " + (i === current ? "bg-gold-400 w-8" : "bg-white bg-opacity-30")} />
          ))}
        </div>
      </div>
    </section>
  );
}
