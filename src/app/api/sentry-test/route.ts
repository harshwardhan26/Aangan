import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  throw new Error('Sentry Test Error from Aangan backend');
  return NextResponse.json({ success: true });
}
