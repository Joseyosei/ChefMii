import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUBSCRIPTION_PRICES = {
  "chefs-pantry-box": {
    priceId: "price_1SwCldLji6aFDLe2T04QzSQZ",
    name: "Chef's Pantry Box",
    amount: 3500,
  },
  "global-spice-journey": {
    priceId: "price_1SwCleLji6aFDLe2QxLboixR",
    name: "Global Spice Journey",
    amount: 2000,
  },
  "bakers-secret": {
    priceId: "price_1SwCleLji6aFDLe2h6kGFSNW",
    name: "The Baker's Secret",
    amount: 2500,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subscriptionType, successUrl, cancelUrl } = await req.json();

    if (!subscriptionType || !SUBSCRIPTION_PRICES[subscriptionType as keyof typeof SUBSCRIPTION_PRICES]) {
      return new Response(JSON.stringify({ error: "Invalid subscription type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = SUBSCRIPTION_PRICES[subscriptionType as keyof typeof SUBSCRIPTION_PRICES];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: subscription.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get("origin")}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/marketplace`,
      metadata: {
        user_id: user.id,
        user_email: user.email || "",
        subscription_type: subscriptionType,
        product_name: subscription.name,
      },
      customer_email: user.email,
      subscription_data: {
        metadata: {
          user_id: user.id,
          subscription_type: subscriptionType,
          product_name: subscription.name,
        },
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Subscription checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
