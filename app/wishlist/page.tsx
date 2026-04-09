"use client";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">♡</div>
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length})</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="relative h-48">
                <Image src={item.images?.[0] || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addToCart(item)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">Add to Cart</button>
                  <button onClick={() => removeFromWishlist(item._id)} className="p-2 text-red-500 rounded-lg">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
