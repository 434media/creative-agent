import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "default", size = "1024x1024", } = await req.json();

    const brandMap: Record<string, { name: string; stylePrompt: string }> = {
      vemosvamos: {
        name: "Vemos Vamos",
        stylePrompt: `
Create a clean, scrapbook-inspired layout using real paper textures, cut-out-style elements, and minimalist composition.

Typography should use bold, serif fonts similar to TexGyreTermes or Times New Roman. Use expressive placement—centered or slightly off-axis. Colors should include rich dark red (#861804), cream (#ECEADA), and black.

Incorporate a sense of handmade or scanned physical media—tape edges, uneven cutouts, or shadowed layers—while keeping the overall layout simple and legible.

Avoid digital gloss or gradients. This should feel like a real page, photographed or scanned.
`

      },
      devsa: {
        name: "DEVSA",
        stylePrompt: `
        Use a modern, tech-inspired photo.
        
        Design should be influenced by command-line terminals and code editor UIs.
        Incorporate visual elements such as:
        - monospaced fonts (like Consolas, Inconsolata, or Courier)
        - dark backgrounds with neon green (#00FF00), electric blue (#00BFFF), or gray text
        - brackets, code snippets, or syntax-like separators (e.g., {}, [], <>)
        - grid-based layout, clean lines, and digital/techno style accents
        
        Avoid serif fonts, analog textures, or retro imagery.
        The poster should feel sleek, digital, and clearly themed around coding or developer culture.
        `,
    },
    texmex: {
        name: "TexMex Heritage",
        stylePrompt: `
      Create a single black-and-white illustration with a gritty, high-contrast look.
      Inspired by vintage boxing aesthetics, but with no text or lettering.
      Focus entirely on texture, motion, and visual intensity — not layout or typography.
      No titles, no labels, no typefaces. Just raw, rugged visual storytelling in a bold style.
      `,
      }
    }      

    const brand = brandMap[type] || {
      name: "Generic Event",
      stylePrompt: "",
    };

    

    const dallePrompt = `
Create a bold, full-frame illustrated image for the brand "${brand.name}".
Theme: ${prompt}

Visual direction:
- Apply the following style: ${brand.stylePrompt}
- Focus on strong composition, texture, and atmosphere.
- Avoid excessive or detailed text; use minimal or no lettering.
- Emphasize visual storytelling over layout or typography.

This should look like a single, standalone poster design — not a framed mockup, not a collage, not a digital ad.
Do not show multiple layouts, frames, rooms, or photo-mockups.
No side-by-side variants.

Output a clean, centered image that captures the spirit of the event.
`;

    


    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    console.log("Received type:", type);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
        
      method: "POST",
      
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: dallePrompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const urls = data.data?.map((img: { url: string }) => img.url);
    return NextResponse.json({ urls });

  } catch (err: unknown) {
    console.error("Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
