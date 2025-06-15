import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    features: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      web3: !!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    },
  });
}
