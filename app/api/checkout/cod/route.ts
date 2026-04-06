// COD disabled — placeholder for future use
import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'COD is not available' }, { status: 404 });
}
