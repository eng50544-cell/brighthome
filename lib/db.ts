import connectDBDefault from './mongodb';

export async function connectDB() {
  return connectDBDefault();
}
