import type { Plugin, Connect } from 'vite';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

function stripeApiPlugin(): Plugin {
  let stripeClient: Stripe;
  let supabaseAdmin: ReturnType<typeof createClient>;

  return {
    name: 'stripe-api',
    configureServer(server) {
      stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
      });

      supabaseAdmin = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );

      const parseBody = async (req: Connect.IncomingMessage): Promise<Record<string, unknown>> => {
        return new Promise((resolve, reject) => {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch {
              reject(new Error('Invalid JSON'));
            }
          });
          req.on('error', reject);
        });
      };

      const getUser = async (authHeader: string | undefined) => {
        if (!authHeader?.startsWith('Bearer ')) {
          return null;
        }
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        return user;
      };

      server.middlewares.use('/api/create-checkout', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const user = await getUser(req.headers.authorization);
          if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
          }

          const body = await parseBody(req) as {
            type?: string;
            items?: Array<{ name: string; price: number; quantity: number; image?: string }>;
            metadata?: Record<string, string>;
            successUrl?: string;
            cancelUrl?: string;
          };

          const { type, items, metadata, successUrl, cancelUrl } = body;

          if (!type || !items || !Array.isArray(items) || items.length === 0) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid request body' }));
            return;
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

          const origin = req.headers.origin || `http://localhost:8080`;
          const session = await stripeClient.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItems,
            success_url: successUrl || `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${origin}/payment-cancelled`,
            metadata: {
              type,
              user_id: user.id,
              user_email: user.email || '',
              ...metadata,
            },
            customer_email: user.email || undefined,
          });

          if (type === 'booking' && metadata?.booking_id) {
            await supabaseAdmin
              .from('bookings')
              .update({ stripe_session_id: session.id })
              .eq('id', metadata.booking_id);
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ url: session.url, sessionId: session.id }));
        } catch (error) {
          console.error('Checkout error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }));
        }
      });

      server.middlewares.use('/api/confirm-booking', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const user = await getUser(req.headers.authorization);
          if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
          }

          const body = await parseBody(req) as { session_id?: string };
          const { session_id } = body;

          if (!session_id) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'session_id is required' }));
            return;
          }

          const session = await stripeClient.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent'],
          });

          if (session.payment_status !== 'paid') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Payment not completed' }));
            return;
          }

          const bookingId = session.metadata?.booking_id;
          if (!bookingId) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No booking_id in session metadata' }));
            return;
          }

          const paymentIntentId =
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id;

          const { data: booking, error: updateError } = await supabaseAdmin
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              stripe_session_id: session.id,
              stripe_payment_intent_id: paymentIntentId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId)
            .eq('user_id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating booking:', updateError);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to update booking' }));
            return;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ success: true, booking }));
        } catch (error) {
          console.error('Confirm booking error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }));
        }
      });
    },
  };
}

export default stripeApiPlugin;
