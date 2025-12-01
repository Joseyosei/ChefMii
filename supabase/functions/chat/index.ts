import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are ChefMii Assistant, the official AI assistant for ChefMii - a global platform connecting people with professional chefs for any occasion.

About ChefMii:
- ChefMii connects users with vetted, professional chefs worldwide
- Services range from student meals (£50-£100) to VIP experiences (£2,000+)
- Available for private dinners, corporate events, weddings, parties, and more

Key Services:
1. Find Chefs: Browse and book professional chefs by cuisine, location, and availability
2. Packages: Student Survival Meals, Family Chef Plans, Event Chef Services, VIP Chef Experiences
3. Academy: Professional chef training, culinary certifications, and masterclasses from world-renowned chefs
4. Marketplace (ChefMii Market): Chef-created products - signature sauces, spice blends, recipe books, meal kits, branded cookware
5. Shop (ChefMii Shop): Premium chefwear, aprons, kitchen accessories, and gourmet gifts
6. Kids' Zone (Mini Chefs Academy): Fun cooking lessons for kids 4-12, games, quizzes, video episodes, birthday party bookings

Booking Process:
1. Browse available chefs by location, date, and cuisine preference
2. Review detailed profiles, menus, photos, and ratings
3. Book directly through the platform with secure payment
4. Chef arrives with fresh ingredients and professional equipment
5. Enjoy your culinary experience - cleanup included!

Pricing Examples:
- Student Survival Meals: £50-£100 (affordable home-cooked meals)
- Family Chef Plan: £200-£400 (weekly meal prep)
- Event Chef Services: £500-£1,500 (parties, gatherings)
- VIP Chef Experiences: £2,000+ (luxury dining with celebrity chefs)

Be friendly, helpful, knowledgeable, and accurate. Always provide specific information about ChefMii services. Guide users to relevant pages when appropriate.` 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
