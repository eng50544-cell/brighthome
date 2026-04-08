"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Star, ShoppingCart, Search, Filter, SlidersHorizontal } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  price: number;
  images: string[];
  rating: { average: number; count: number };
  isFeatured: boolean;
}

interface Props {
  products: Product[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
}

export default function ShopClient({ products, categories, total, page, limit }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const activeCategory = searchParams.get("category") || "";

  const totalPages = Math.ceil(total / limit);

  const navigate = (params: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    p.delete("page");
    router.push(`/shop?${p.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ q: searchInput });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-500">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>
              </form>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => navigate({ category: "" })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeCategory
                        ? "bg-yellow-400 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => navigate({ category: cat })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat
                          ? "bg-yellow-400 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <Link href={`/shop/${product.slug}`}>
                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                          <Image
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isFeatured && (
                            <span className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <span className="text-xs text-yellow-600 font-medium">{product.category}</span>
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 mt-1 mb-1 hover:text-yellow-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.shortDescription}</p>
                        <div className="flex items-center gap-1 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${s <= Math.round(product.rating?.average || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({product.rating?.count || 0})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          <button
                            onClick={() => addItem({
                              id: product._id,
                              name: product.name,
                              price: product.price,
                              image: product.images?.[0],
                            })}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2.5 rounded-full transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })}`}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-yellow-400 text-gray-900"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
