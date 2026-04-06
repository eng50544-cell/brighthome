import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  cost: number;
  margin: number;
  images: string[];
  cloudinaryIds: string[];
  description: string;
  bulletPoints: string[];
  faq: { q: string; a: string }[];
  metaSeo: { title: string; description: string };
  socialCaptions: {
    instagram?: string;
    tiktok?: string[];
    pinterest?: string;
    facebook?: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount?: number;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  aliexpressUrl?: string;
  aliexpressId?: string;
  shipping: string;
  shippingCost: number;
  source: string;
  processed: boolean;
  published: boolean;
  publishedAt?: Date;
  views: number;
  orders: number;
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    cost: { type: Number, default: 0 },
    margin: { type: Number, default: 0 },
    images: [{ type: String }],
    cloudinaryIds: [{ type: String }],
    description: { type: String, default: '' },
    bulletPoints: [{ type: String }],
    faq: [{ q: String, a: String }],
    metaSeo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    socialCaptions: {
      instagram: String,
      tiktok: [String],
      pinterest: String,
      facebook: String,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number },
    isNew: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    aliexpressUrl: String,
    aliexpressId: String,
    shipping: { type: String, default: 'Standard' },
    shippingCost: { type: Number, default: 0 },
    source: { type: String, default: 'aliexpress' },
    processed: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    publishedAt: Date,
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
