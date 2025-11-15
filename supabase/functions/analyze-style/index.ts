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
    const { image, stylePreference = "Modern" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Analyze the image to get physical characteristics
    console.log("Analyzing image for physical characteristics...");
    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You are a professional fashion consultant. Analyze the person in the image and describe their physical characteristics that are relevant for fashion recommendations: skin tone (warm/cool/neutral), face shape, body type, and any other relevant features. Be specific but professional.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this person's physical characteristics for fashion recommendations.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error("Analysis API error:", analysisResponse.status, errorText);
      throw new Error(`Analysis failed: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const physicalDescription = analysisData.choices[0].message.content;
    console.log("Physical analysis complete:", physicalDescription);

    // Step 2: Generate 3 outfit descriptions based on the analysis
    console.log("Generating outfit descriptions...");
    const outfitPrompt = `Based on this physical description: "${physicalDescription}"

Generate 3 distinct, fashionable outfit options in a ${stylePreference} style. For each outfit, provide a detailed description in this exact format:

OUTFIT 1: [Describe a complete ${stylePreference.toLowerCase()} outfit with specific colors, patterns, and pieces. Include top, bottom, shoes, and any accessories. Be specific about colors and styles.]

OUTFIT 2: [Describe a different complete ${stylePreference.toLowerCase()} outfit with specific details]

OUTFIT 3: [Describe a third unique complete ${stylePreference.toLowerCase()} outfit with specific details]

Make each outfit distinct in subcategory (e.g., day wear, office appropriate, evening) while maintaining the ${stylePreference} aesthetic. Ensure the colors and styles complement the person's features.`;

    const outfitResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You are a professional fashion stylist creating complete outfit recommendations.",
          },
          {
            role: "user",
            content: outfitPrompt,
          },
        ],
      }),
    });

    if (!outfitResponse.ok) {
      const errorText = await outfitResponse.text();
      console.error("Outfit generation API error:", outfitResponse.status, errorText);
      throw new Error(`Outfit generation failed: ${outfitResponse.status}`);
    }

    const outfitData = await outfitResponse.json();
    const outfitDescriptions = outfitData.choices[0].message.content;
    console.log("Outfit descriptions generated");

    // Parse the outfit descriptions
    const outfits = outfitDescriptions.split(/OUTFIT \d+:/).filter((text: string) => text.trim());

    // Step 3: Generate images for each outfit using Nano Banana
    console.log("Generating outfit images...");
    const outfitPromises = outfits.slice(0, 3).map(async (description: string, index: number) => {
      const imagePrompt = `Fashion photography of ${description.trim()}. Professional studio lighting, clean background, high-quality fashion editorial style, detailed clothing textures.`;

      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: imagePrompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error(`Image generation ${index + 1} API error:`, imageResponse.status, errorText);
        throw new Error(`Image generation ${index + 1} failed`);
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error(`No image URL returned for outfit ${index + 1}`);
      }

      return {
        image: imageUrl,
        description: description.trim(),
      };
    });

    const generatedOutfits = await Promise.all(outfitPromises);
    console.log("All outfit images generated successfully");

    return new Response(
      JSON.stringify({
        outfits: generatedOutfits,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in analyze-style function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while analyzing your style",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
