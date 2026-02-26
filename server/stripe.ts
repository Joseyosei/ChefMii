import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as const,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface CreateCheckoutBody {
  type: string;
  items: Array<{ name: string; price: number; quantity: number; image?: string }>;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

interface ConfirmBookingBody {
  session_id: string;
}

export async function createCheckoutSession(
  body: CreateCheckoutBody,
  userId: string,
  userEmail: string | null,
  origin: string
): Promise<{ url: string | null; sessionId: string }> {
  const { type, items, metadata, successUrl, cancelUrl } = body;

  if (!type || !items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid request body');
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
        ...(item.image && { images: [item.image] }),
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${origin}/payment-cancelled`,
    metadata: {
      type,
      user_id: userId,
      user_email: userEmail || '',
      ...metadata,
    },
    customer_email: userEmail || undefined,
  });

  if (type === 'booking' && metadata?.booking_id) {
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', metadata.booking_id);
  }

  return { url: session.url, sessionId: session.id };
}

export async function confirmBookingPayment(
  body: ConfirmBookingBody,
  userId: string
): Promise<{ success: boolean; booking?: unknown }> {
  const { session_id } = body;

  if (!session_id) {
    throw new Error('session_id is required');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['payment_intent'],
  });

  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }

  const bookingId = session.metadata?.booking_id;
  if (!bookingId) {
    throw new Error('No booking_id in session metadata');
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  const { data: booking, error: updateError } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      payment_status: 'paid',
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    throw new Error('Failed to update booking');
  }

  return { success: true, booking };
}
