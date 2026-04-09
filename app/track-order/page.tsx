import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

interface PageProps {
  searchParams: { id?: string };
}

export default async function TrackOrderPage({ searchParams }: PageProps) {
  const orderId = searchParams.id;
  let order = null;
  let error = "";

  if (orderId) {
    try {
      await connectDB();
      order = await Order.findById(orderId).lean();
      if (!order) error = "Order not found. Please check your Order ID.";
    } catch {
      error = "Invalid Order ID format.";
    }
  }

  const steps = ["pending", "paid", "processing", "shipped", "delivered"];
  const currentStep = order ? steps.indexOf((order as any).status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>

        <form method="GET" className="bg-white rounded-xl p-6 shadow mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
          <div className="flex gap-3">
            <input
              name="id"
              defaultValue={orderId}
              placeholder="Enter your Order ID"
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Track
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {order && (
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-1">Order #{(order as any)._id.toString().slice(-8)}</h2>
              <p className="text-gray-500 text-sm">
                Placed on {new Date((order as any).createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className="text-xs mt-1 capitalize text-center">{step}</span>
                  {i < steps.length - 1 && (
                    <div className="absolute" style={{ display: "none" }} />
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Status:</strong> <span className="capitalize">{(order as any).status}</span></p>
              {(order as any).trackingNumber && (
                <p><strong>Tracking Number:</strong> {(order as any).trackingNumber}</p>
              )}
              <p><strong>Shipping to:</strong> {(order as any).address}, {(order as any).city}, {(order as any).country}</p>
              <p><strong>Total:</strong> ${(order as any).totalAmount?.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
