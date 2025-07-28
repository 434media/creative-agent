import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "default", size = "1024x1024" } = await req.json();

    const brandMap: Record<string, { name: string; stylePrompt: string }> = {
      vemosvamos: {
        name: "Vemos Vamos",
        stylePrompt: `
Design a single-page poster with a clean, scrapbook-inspired look.

Use one central, realistic image that reflects the event theme. Keep the layout simple and minimal, like a student flyer.

Stick to a cream background (#ECEADA) with dark red (#861804) and black accents. Add subtle paper textures, cutout edges, or tape to create a handmade, analog feel.

Avoid multiple layouts, ornate patterns, decorative flourishes, or mockup-style borders. The final image should feel like a real flyer, photographed or scanned.
`,

      },
      devsa: {
        name: "DEVSA",
        stylePrompt: `
Use a modern, tech-inspired photo.

Design should be influenced by command-line terminals and code editor UIs. Incorporate visual elements such as:
- monospaced fonts
- dark backgrounds with neon green (#00FF00), electric blue (#00BFFF)
- brackets, code snippets, or syntax-like separators

Avoid serif fonts, analog textures, or retro imagery. The design should feel sleek, digital, and clearly themed around coding or developer culture.
        `,
      },
      texmex: {
        name: "TexMex Heritage",
        stylePrompt: `
Create a single black-and-white illustration with a gritty, high-contrast look. Inspired by vintage boxing aesthetics, but with no text.

Focus on texture, motion, and visual intensity — no layout or type. Just raw, rugged visual storytelling in bold style.
        `,
      },
    };

    const brand = brandMap[type] || {
      name: "Generic Event",
      stylePrompt: "",
    };

const dallePrompt = `
Create a bold, full-frame illustrated poster for the brand "${brand.name}" with the theme: ${prompt}.

Visual style:
- Follow this style: ${brand.stylePrompt}
- Emphasize strong composition, texture, and atmosphere.
- Use minimal or no text; avoid detailed lettering.
- Prioritize visual storytelling over layout or typography.

The image should be a single, standalone poster design—not a framed mockup, collage, or digital ad.
Avoid multiple layouts, frames, interiors, or photo-mockup elements.
`;


  const gptPrompt = `
You are a creative copywriter for posters and event flyers.

Brand: "${brand.name}"
Event theme and details: "${prompt}"

Write a short, punchy caption (max 25 words) that includes the real title, date, and location, and draws from the given details — but rewrite them in a vivid, inviting way.
Do not include dates or location if it is not explicitly given.

Do not add or invent new information. Just rephrase what’s given with energy and flair.
Match the brand's tone and style.
Make sure all language is appropriate.
`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    // === DALL·E Image Generation ===
    const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: dallePrompt,
        n: 1,
        size,
        response_format: "url",
      }),
    });

    const imageData = await imageRes.json();
    if (imageData.error) {
      console.error("OpenAI image error:", imageData.error);
      return NextResponse.json({ error: imageData.error.message }, { status: 500 });
    }

    const urls = imageData.data?.map((img: { url: string }) => img.url);

    // === GPT Caption Generation ===
    const captionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You write captions for event posters make it initing and fun!." },
          { role: "user", content: gptPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const captionData = await captionRes.json();
    const caption = captionData.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ urls, caption });

  } catch (err: unknown) {
    console.error("Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}