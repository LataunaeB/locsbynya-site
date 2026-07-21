import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message:
        'Bookings require payment. Please submit the booking form and complete the $25 deposit via Stripe Checkout.',
    },
    { status: 403 }
  );
}
