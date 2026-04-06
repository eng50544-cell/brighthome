import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
  payment: {
    provider: string;
    tranRef?: string;
    method?: string;
    responseStatus?: string;
    responseMessage?: string;
    paidAt?: Date;
  };
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    url?: string;
    shippedAt?: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name:    { type: String, required: true },
      email:   { type: String, required: true },
      phone:   String,
      address: { type: String, required: true },
      city:    { type: String, required: true },
      country: { type: String, required: true },
      zip:     String,
    },
    items: [{
      productId: String,
      name:      String,
      price:     Number,
      quantity:  Number,
      image:     String,
    }],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax:      { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total:    { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled'],
      default: 'pending',
    },
    payment: {
      provider:        { type: String, default: 'paytabs' },
      tranRef:         String,
      method:          String,
      responseStatus:  String,
      responseMessage: String,
      paidAt:          Date,
    },
    tracking: {
      carrier:        String,
      trackingNumber: String,
      url:            String,
      shippedAt:      Date,
    },
    notes: String,
  },
  { timestamps: true }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
