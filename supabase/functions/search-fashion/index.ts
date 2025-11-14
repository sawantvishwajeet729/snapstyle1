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
    const { description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Extract individual clothing items from the description
    console.log("Extracting clothing items from description...");
    const extractResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You are a fashion item extractor. Extract individual clothing items and accessories from outfit descriptions. Return ONLY a JSON array of items, like: [\"item1\", \"item2\", \"item3\"]. Each item should be a concise search term.",
          },
          {
            role: "user",
            content: `Extract individual searchable clothing items from this outfit description: "${description}"\n\nReturn only a JSON array of 3-5 specific items.`,
          },
        ],
      }),
    });

    if (!extractResponse.ok) {
      throw new Error("Failed to extract items");
    }

    const extractData = await extractResponse.json();
    const itemsText = extractData.choices[0].message.content;
    
    // Parse the JSON array from the response
    const items = JSON.parse(itemsText.trim());
    console.log("Extracted items:", items);

    // Step 2: Search for each item using web search
    const searchPromises = items.map(async (item: string) => {
      console.log(`Searching for: ${item}`);
      
      // Use a simple mock search since we don't have a real shopping API
      // In production, you would integrate with Google Shopping API or similar
      const mockResults = [
        {
          title: `${item} - Premium Quality`,
          link: `https://example.com/shop/${item.toLowerCase().replace(/\s+/g, "-")}`,
          source: "Fashion Store",
        },
        {
          title: `Designer ${item}`,
          link: `https://example.com/designer/${item.toLowerCase().replace(/\s+/g, "-")}`,
          source: "Luxury Boutique",
        },
        {
          title: `${item} - Best Seller`,
          link: `https://example.com/bestseller/${item.toLowerCase().replace(/\s+/g, "-")}`,
          source: "Top Shop",
        },
        {
          title: `Affordable ${item}`,
          link: `https://example.com/affordable/${item.toLowerCase().replace(/\s+/g, "-")}`,
          source: "Budget Fashion",
        },
        {
          title: `Trending ${item}`,
          link: `https://example.com/trending/${item.toLowerCase().replace(/\s+/g, "-")}`,
          source: "Style Hub",
        },
      ];

      return {
        item,
        results: mockResults,
      };
    });

    const results = await Promise.all(searchPromises);
    console.log("Search complete");

    return new Response(
      JSON.stringify({
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in search-fashion function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while searching for items",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
