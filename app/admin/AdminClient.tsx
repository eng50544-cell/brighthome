"use client";
import { useState } from "react";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  revenue: number;
}

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

interface Props {
  stats: Stats;
  recentOrders: Order[];
  featuredProducts: Product[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminClient({ stats, recentOrders, featuredProducts }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">BrightHome Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["dashboard", "orders", "products"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded capitalize transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Admin Panel v1.0
        </div>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${stats.revenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Recent Orders</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{order._id.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm">{order.firstName} {order.lastName}</td>
                      <td className="px-6 py-4 text-sm font-medium">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Orders</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Order ID", "Customer", "Email", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono">{order._id.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm">{order.firstName} {order.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.email}</td>
                      <td className="px-6 py-4 text-sm font-medium">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow overflow-hidden">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                    <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                    <p className={`text-sm mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                      {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
