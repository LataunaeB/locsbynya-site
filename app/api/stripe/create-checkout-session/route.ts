import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { saveBookingDraft } from '@/lib/booking/draft-store';
import { getSiteUrl } from '@/lib/booking/site-url';
import { validateBookingFormData } from '@/lib/booking/validate';

export const runtime = 'nodejs';

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

function buildLineItems(): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const priceId = process.env.STRIPE_DEPOSIT_PRICE_ID?.trim();
  if (priceId) {
    return [{ price: priceId, quantity: 1 }];
  }

  return [
    {
      price_data: {
        currency: 'usd',
        unit_amount: 2500,
        product_data: {
          name: 'Locs by Nya — $25 Booking Security Deposit',
          description:
            'Required security deposit to hold your appointment. Applied toward your total service cost.',
        },
      },
      quantity: 1,
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { message: 'Payment service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const validation = await validateBookingFormData(formData);
    if (!validation.ok) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const bookingId = crypto.randomUUID();
    await saveBookingDraft(bookingId, validation.booking);

    const siteUrl = getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: validation.booking.email,
      line_items: buildLineItems(),
      metadata: {
        bookingId,
      },
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#book`,
    });

    if (!session.url) {
      return NextResponse.json(
        { message: 'Unable to start checkout. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { message: 'Unable to start checkout. Please try again.' },
      { status: 500 }
    );
  }
}
