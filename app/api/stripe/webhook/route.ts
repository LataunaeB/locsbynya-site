import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  deleteBookingDraft,
  draftToValidatedBooking,
  isStripeEventProcessed,
  loadBookingDraft,
  loadDraftAttachments,
  markDraftEmailsSent,
  markStripeEventProcessed,
} from '@/lib/booking/draft-store';
import { isEmailConfigured, sendBookingEmails } from '@/lib/booking/send-emails';

export const runtime = 'nodejs';

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook is not configured');
    return NextResponse.json(
      { message: 'Webhook is not configured.' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ message: 'Missing Stripe signature.' }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ message: 'Invalid Stripe signature.' }, { status: 400 });
  }

  if (await isStripeEventProcessed(event.id)) {
    return NextResponse.json({ received: true });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error('Stripe session missing bookingId metadata:', session.id);
    return NextResponse.json({ message: 'Missing booking metadata.' }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    console.error('Email service is not configured for paid booking:', bookingId);
    return NextResponse.json(
      { message: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  try {
    const draft = await loadBookingDraft(bookingId);
    if (!draft) {
      console.error('Booking draft not found for paid session:', bookingId);
      return NextResponse.json({ message: 'Booking draft not found.' }, { status: 404 });
    }

    if (draft.emailsSent) {
      await markStripeEventProcessed(event.id);
      return NextResponse.json({ received: true });
    }

    const attachments = await loadDraftAttachments(draft);
    const booking = draftToValidatedBooking(draft);

    await sendBookingEmails(booking, attachments);
    await markDraftEmailsSent(bookingId);
    await deleteBookingDraft(bookingId);
    await markStripeEventProcessed(event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error fulfilling paid booking:', error);
    return NextResponse.json(
      { message: 'Failed to fulfill booking after payment.' },
      { status: 500 }
    );
  }
}
